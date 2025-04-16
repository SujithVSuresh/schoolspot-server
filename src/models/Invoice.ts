import { InvoiceEntityType } from '../types/types';
import mongoose, {Schema, Types} from 'mongoose';


const InvoiceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    student: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    class: {
        type: Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    school: {
      type: Types.ObjectId,
      ref: 'School',
      required: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    dueDate: {
        type: Date,
        required: true,
      },
    feeBreakdown: [
      {
        feeType: { type: String},
        amount: { type: Number, min: 0 },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
    remarks: {
      type: String,
    },
  }, { timestamps: true });


export default mongoose.model<InvoiceEntityType>('Invoice', InvoiceSchema, "Invoices")
