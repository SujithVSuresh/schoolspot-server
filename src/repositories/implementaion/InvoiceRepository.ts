import { BaseRepository } from "./BaseRepository";
import {
  InvoiceDetailsEntityType,
  InvoiceEntityType,
  InvoiceWithUserEntityType,
} from "../../types/types";
import Invoice from "../../models/Invoice";
import mongoose from "mongoose";
import { IInvoiceRepository } from "../interface/IInvoiceRepository";

class InvoiceRepository
  extends BaseRepository<InvoiceEntityType>
  implements IInvoiceRepository
{
  constructor() {
    super(Invoice);
  }

  async createInvoice(data: InvoiceEntityType[]): Promise<InvoiceEntityType[]> {
    try {
      return await Invoice.insertMany(data);
    } catch (error) {
      console.error("Error creating invoice", error);
      throw new Error("Error creating invoice");
    }
  }

  async findInvoicesByQuery(query: any): Promise<InvoiceEntityType[]> {
    try {
      return await this.findByQuery({ ...query });
    } catch (error) {
      console.error("Error fetching invoice", error);
      throw new Error("Error fetching invoice");
    }
  }

  async findInvoicesByClassId(
    classId: string
  ): Promise<InvoiceWithUserEntityType[]> {
    try {
      const invoices = Invoice.aggregate([
        {
          $match: {
            class: new mongoose.Types.ObjectId(classId),
          },
        },
        {
          $lookup: {
            from: "Students",
            localField: "student",
            foreignField: "userId",
            as: "student",
          },
        },
        { $unwind: "$student" },
        {
          $sort: {
            createdAt: -1
          }
        }
      ]);

      return invoices
    } catch (error) {
      console.error("Error fetching invoice", error);
      throw new Error("Error fetching invoice");
    }
  }

  async findInvoiceById(
    invoiceId: string
  ): Promise<InvoiceDetailsEntityType | null> {
    try {
      const invoice = await Invoice.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(invoiceId),
          },
        },
        {
          $lookup: {
            from: "Students",
            localField: "student",
            foreignField: "userId",
            as: "studentProfile",
          },
        },
        { $unwind: "$studentProfile" },
        {
          $lookup: {
            from: "Schools",
            localField: "school",
            foreignField: "_id",
            as: "school",
          },
        },
        { $unwind: "$school" },
        {
          $lookup: {
            from: "Classes",
            localField: "class",
            foreignField: "_id",
            as: "class",
          },
        },
        { $unwind: "$class" },
        {
          $lookup: {
            from: "Users",
            localField: "student",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
      ]);

      return invoice[0];
    } catch (error) {
      console.error("Error fetching invoice", error);
      throw new Error("Error fetching invoice");
    }
  }

  async findInvoiceByNumber(
    invoiceNumber: string
  ): Promise<InvoiceEntityType | null> {
    try {
      const invoice = await this.findOne({ invoiceNumber });
      return invoice;
    } catch (error) {
      console.error("Error fetching invoice", error);
      throw new Error("Error fetching invoice");
    }
  }

  async updateInvoiceStatus(
    invoiceId: string,
    status: "Paid" | "Unpaid"
  ): Promise<InvoiceEntityType | null> {
    try {
      const invoice = await this.update(invoiceId, { status: status });
      return invoice;
    } catch (error) {
      console.error("Error updating invoice", error);
      throw new Error("Error oupdating invoice");
    }
  }

  async findInvoicesByStudentId(
    studentId: string
  ): Promise<InvoiceEntityType[]> {
    try {
      const invoices = Invoice.aggregate([
        {
          $match: {
            student: new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      return invoices;
    } catch (error) {
      console.error("Error fetching invoice", error);
      throw new Error("Error fetching invoice");
    }
  }


  async deleteInvoice(invoiceId: string): Promise<boolean | null> {
    try{
      return this.delete(invoiceId)

    } catch (error) {
      console.error("Error deleting invoice", error);
      throw new Error("Error deleting invoice");
    }
  }
}

export default new InvoiceRepository();
