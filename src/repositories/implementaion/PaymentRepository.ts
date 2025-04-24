import { BaseRepository } from "./BaseRepository";
import { PaymentEntityType } from "../../types/types";
import { IPaymentRepository } from "../interface/IPaymentRepository";
import Payment from "../../models/Payment";
import mongoose from "mongoose";

class PaymentRepository
  extends BaseRepository<PaymentEntityType>
  implements IPaymentRepository
{
  constructor() {
    super(Payment);
  }
  async createPayment(data: PaymentEntityType): Promise<PaymentEntityType> {
    try {
      return await this.create({
        ...data,
        student: new mongoose.Types.ObjectId(data.student),
        relatedId: new mongoose.Types.ObjectId(data.relatedId)
      })
    } catch (error) {
      console.error("Error creating payment", error);
      throw new Error("Error creating payment");
    }
  }

  async fetchPaymentsByInvoiceId(invoiceId: string): Promise<PaymentEntityType[]> {
    try {
        return await this.findByQuery({relatedId: new mongoose.Types.ObjectId(invoiceId)})
      } catch (error) {
        console.error("Error creating payment", error);
        throw new Error("Error creating payment");
      }
  }
}

export default new PaymentRepository();
