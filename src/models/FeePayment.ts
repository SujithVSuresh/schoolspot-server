import mongoose, {Schema, Types} from "mongoose";

const PaymentSchema = new Schema({
  student: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  invoice: {
    type: Types.ObjectId,
    ref: 'Invoice',
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


// export default mongoose.model<>('Payment', PaymentSchema, "Payments")
