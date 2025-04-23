import { BaseRepository } from "./BaseRepository";
import { InvoiceEntityType } from "../../types/types";
import Invoice from "../../models/Invoice";
import mongoose from "mongoose";

class IInvoiceRepository
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

  async findInvoicesByStudentId(studentId: string): Promise<InvoiceEntityType[]> {
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

      return invoices
    } catch (error) {
      console.error("Error fetching invoice", error);
      throw new Error("Error fetching invoice");
    }
  }
}

export default new IInvoiceRepository();
