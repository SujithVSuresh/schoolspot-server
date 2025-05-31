import mongoose from "mongoose";
import { PlanEntityType } from "../types/SubscriptionType";

const planSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  price: { 
    type: Number, 
    required: true 
  },
  durationInDays: { 
    type: Number,  
    required: true
  },
}, { timestamps: true });

export default mongoose.model<PlanEntityType>("Plan", planSchema, "Plans");
