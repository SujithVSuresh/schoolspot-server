import {
  CreateInvoiceDTO,
  InvoiceByClassResponseDTO,
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
import { INotificationRepository } from "../../repositories/interface/INotificationRepository";
import { INotificationService } from "../interface/INotificationService";

export class InvoiceService implements IInvoiceService {
  constructor(
    private _invoiceRepository: IInvoiceRepository,
    private _paymentRepository: IPaymentRepository,
    private _notificationService: INotificationService
  ) {}

  async createInvoice(data: CreateInvoiceDTO, studentIds: string[]): Promise<{ classId: string }> {

    if(data.dueDate && new Date(data.dueDate) < new Date()){
      throw new CustomError(
        Messages.DUE_DATE_INVALID,
        HttpStatus.BAD_REQUEST
      );
    }
    
    const studentInvoices: InvoiceEntityType[] = studentIds.map(
      (id) => {
        return {
          student: id,
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

    const invoices: InvoiceEntityType[] = await this._invoiceRepository.createInvoice(studentInvoices);

    await this._notificationService.sendNotification({
      userId: invoices.map((item) => String(item.student)),
      notificationType: "invoice",
      message: invoices[0].title
    })

    return {
      classId: String(invoices[0].class),
    };
  }

  async findInvoicesByClassId(classId: string): Promise<InvoiceByClassResponseDTO[]> {
    const invoices = await this._invoiceRepository.findInvoicesByClassId(classId);

    const invoicesData: InvoiceByClassResponseDTO[] = invoices.map((invoice) => {
      return {
        _id: String(invoice._id),
        student: {
          fullName: invoice.student.fullName,
          userId: String(invoice.student.userId),
        },
        title: invoice.title,
        class: String(invoice.class),
        invoiceNumber: invoice.invoiceNumber,
        dueDate: invoice.dueDate,
        status: invoice.status,
        totalAmount: invoice.totalAmount,
        createdAt: invoice.createdAt as Date,
        updatedAt: invoice.updatedAt as Date,
      };
    });
    

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
            currency: "inr",
            product_data: { name: invoiceId },
            unit_amount: Math.round(amount * 100),
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
          user: invoice.student,
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
          user: invoice.student,
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
        console.log(`Unhandled event type: ${event.type}`);
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

  async deleteInvoice(invoiceId: string): Promise<{ _id: string; }> {
    const response = this._invoiceRepository.deleteInvoice(invoiceId)

    if(!response){
      throw new CustomError(Messages.INVOICE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: invoiceId
    }
  }
}
