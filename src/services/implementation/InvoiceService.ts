import {
  CreateInvoiceDTO,
  InvoiceDetailsResponseDTO,
  InvoiceResponseDTO,
} from "../../dto/InvoiceDTO";
import { IInvoiceService } from "../interface/IInvoiceService";
import { IInvoiceRepository } from "../../repositories/interface/IInvoiceRepository";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import {
  InvoiceEntityType,
} from "../../types/types";
import { StudentProfileUserEntityType } from "../../types/StudentType";
import mongoose from "mongoose";
import Stripe from "stripe";
import stripe from "../../config/stripe";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { IPaymentRepository } from "../../repositories/interface/IPaymentRepository";

export class InvoiceService implements IInvoiceService {
  constructor(
    private _invoiceRepository: IInvoiceRepository,
    private _studentRepository: IStudentRepository,
    private _paymentRepository: IPaymentRepository
  ) {}

  async createInvoice(data: CreateInvoiceDTO): Promise<{ classId: string }> {
    const students = await this._studentRepository.getStudents(
      {
        classId: new mongoose.Types.ObjectId(data.class),
      },
      data.school
    );

    const studentInvoices: InvoiceEntityType[] = students.map(
      (student: StudentProfileUserEntityType) => {
        return {
          student: student.user._id,
          title: data.title,
          class: data.class,
          school: data.school,
          invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
          dueDate: data.dueDate,
          feeBreakdown: data.feeBreakdown,
          totalAmount: data.totalAmount,
          status: "Unpaid",
          remarks: data.remarks,
        };
      }
    );

    const invoices: InvoiceEntityType[] =
      await this._invoiceRepository.createInvoice(studentInvoices);

    return {
      classId: String(invoices[0].class),
    };
  }

  async findInvoicesByClassId(classId: string): Promise<InvoiceResponseDTO[]> {
    const invoices: InvoiceEntityType[] =
      await this._invoiceRepository.findInvoicesByQuery({
        class: new mongoose.Types.ObjectId(classId),
      });

    const invoicesData: InvoiceResponseDTO[] = invoices.map(
      (invoice: InvoiceEntityType) => {
        return {
          _id: String(invoice._id),
          student: String(invoice.student),
          title: invoice.title,
          class: String(invoice.class),
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          feeBreakdown: invoice.feeBreakdown ? invoice.feeBreakdown : [],
          status: invoice.status,
          totalAmount: invoice.totalAmount,
          remarks: invoice.remarks ? invoice.remarks : "",
          createdAt: invoice.createdAt as Date,
          updatedAt: invoice.updatedAt as Date,
        };
      }
    );

    return invoicesData;
  }

  async findInvoicesByStudentId(
    studentId: string
  ): Promise<InvoiceResponseDTO[]> {
    const invoices: InvoiceEntityType[] =
      await this._invoiceRepository.findInvoicesByStudentId(studentId);

    const invoicesData: InvoiceResponseDTO[] = invoices.map(
      (invoice: InvoiceEntityType) => {
        return {
          _id: String(invoice._id),
          title: invoice.title,
          student: String(invoice.student),
          class: String(invoice.class),
          invoiceNumber: invoice.invoiceNumber,
          dueDate: invoice.dueDate,
          feeBreakdown: invoice.feeBreakdown ? invoice.feeBreakdown : [],
          status: invoice.status,
          totalAmount: invoice.totalAmount,
          remarks: invoice.remarks ? invoice.remarks : "",
          createdAt: invoice.createdAt as Date,
          updatedAt: invoice.updatedAt as Date,
        };
      }
    );

    return invoicesData;
  }

  async createInvoiceSession(
    invoiceId: string,
    amount: number
  ): Promise<Stripe.Checkout.Session> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: invoiceId },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          invoiceNumber: invoiceId,
        },
      },
      mode: "payment",
      success_url: "http://localhost:5173/student/invoices",
      cancel_url: "http://localhost:5173/student/invoices",
    });

    return session;
  }

  async handleStripeEvent(event: Stripe.Event): Promise<string> {
    let paymentId
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          {
            limit: 1,
          }
        );

        const invoiceNumber = lineItems.data[0]?.description; 

        const invoice = await this._invoiceRepository.findInvoiceByNumber(
          invoiceNumber as string
        );

        if (!invoice) {
          throw new CustomError(
            Messages.INVOICE_NOT_FOUND,
            HttpStatus.NOT_FOUND
          );
        }

        const payment = await this._paymentRepository.createPayment({
          student: invoice.student,
          paymentFor: "Invoice",
          relatedId: invoice._id ? invoice._id : "",
          amountPaid: session.amount_total as number,
          paymentMethod: "Card",
          transactionId: session.id,
          paymentDate: new Date(),
          status: "Success",
        });
        await this._invoiceRepository.updateInvoiceStatus(
          String(invoice._id),
          "Paid"
        );
        paymentId = payment._id
        break;
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const session = event.data.object as
          | Stripe.Checkout.Session
          | Stripe.PaymentIntent;
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const invoiceNumber = paymentIntent.metadata.invoiceNumber;

        const invoice = await this._invoiceRepository.findInvoiceByNumber(
          invoiceNumber as string
        );

        if (!invoice) {
          throw new CustomError(
            Messages.INVOICE_NOT_FOUND,
            HttpStatus.NOT_FOUND
          );
        }

        const payment = await this._paymentRepository.createPayment({
          student: invoice.student,
          paymentFor: "Invoice",
          relatedId: invoice._id ? invoice._id : "",
          amountPaid: invoice.totalAmount,
          paymentMethod: "Card",
          transactionId: session.id,
          paymentDate: new Date(),
          status: "Failed",
        });
        paymentId = payment._id
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return "completed";
  }

  async findInvoiceById(invoiceId: string): Promise<InvoiceDetailsResponseDTO> {
    const invoice = await this._invoiceRepository.findInvoiceById(invoiceId);

    if (!invoice) {
      throw new CustomError(Messages.INVOICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: String(invoice._id),
      title: invoice.title,
      student: {
        _id: String(invoice.user._id),
        fullName: invoice.studentProfile.fullName,
        email: invoice.user.email,
        contactNumber: invoice.studentProfile.contactNumber,
      },
      class: {
        _id: String(invoice.class._id),
        name: invoice.class.name,
        section: invoice.class.section,
      },
      school: {
        _id: String(invoice.school._id),
        schoolName: invoice.school.schoolName,
        address: {
          city: invoice.school.address.city,
          state: invoice.school.address.state,
        },
      },
      invoiceNumber: invoice.invoiceNumber,
      dueDate: invoice.dueDate,
      feeBreakdown: invoice.feeBreakdown ? invoice.feeBreakdown : [],
      status: invoice.status,
      totalAmount: invoice.totalAmount,
      remarks: invoice.remarks ? invoice.remarks : "",
      createdAt: invoice.createdAt as Date,
      updatedAt: invoice.updatedAt as Date,
    };
  }
}
