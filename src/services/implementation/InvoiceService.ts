import { CreateInvoiceDTO, InvoiceResponseDTO } from "../../dto/InvoiceDTO";
import { IInvoiceService } from "../interface/IInvoiceService";
import { IInvoiceRepository } from "../../repositories/interface/IInvoiceRepository";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import {
  InvoiceEntityType,
  StudentProfileUserEntityType,
} from "../../types/types";
import mongoose from "mongoose";
import Stripe from "stripe";
import stripe from "../../config/stripe";

export class InvoiceService implements IInvoiceService {
  constructor(
    private _invoiceRepository: IInvoiceRepository,
    private _studentRepository: IStudentRepository
  ) {}

  async createInvoice(data: CreateInvoiceDTO): Promise<{ classId: string }> {
    const students = await this._studentRepository.getStudentsByQuery(
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
      mode: "payment",
      success_url: "http://localhost:5173/student/invoices",
      cancel_url: "http://localhost:5173/student/invoices",
    });

    return session;
  }

  async handleStripeEvent(event: Stripe.Event): Promise<string> {
    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("payment done ..", session)

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1,
      });
    
      const productName = lineItems.data[0]?.description; // 👈 should match your invoiceId
      console.log("✅ Product name (invoiceId):", productName);

      // Save order to DB
      console.log("✅ Payment confirmed: ", session.id);
      // Add DB logic here
    }

    return "completed";
  }
}
