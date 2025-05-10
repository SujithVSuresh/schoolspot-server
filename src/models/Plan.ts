import mongoose from "mongoose";
import { PlanEntityType } from "../types/SubscriptionType";

const planSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ["Free", "3 Month", "6 Month"] 
  },
  price: { 
    type: Number, 
    required: true 
  },
  durationInDays: { 
    type: Number,  
    required: true,
    enum: [30, 90, 180] 
  },
}, { timestamps: true });

export default mongoose.model<PlanEntityType>("Plan", planSchema, "Plans");
