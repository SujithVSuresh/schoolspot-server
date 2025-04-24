import mongoose, { Schema, Types } from "mongoose";
import { PaymentEntityType } from "../types/types";

const PaymentSchema = new Schema({
  student: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentFor: {
    type: String,
    enum: ['Invoice', 'Subscription'],
    required: true,
  },
  relatedId: {
    type: Types.ObjectId,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Online', 'Bank Transfer'],
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Pending'],
    default: 'Success',
  }
}, { timestamps: true });

export default mongoose.model<PaymentEntityType>('Payment', PaymentSchema, "Payments");
