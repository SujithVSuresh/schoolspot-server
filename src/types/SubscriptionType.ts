import mongoose from "mongoose";


export interface PlanEntityType {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  price: number;
  durationInDays: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SubscriptionStatusType = "pending" | "queued" | "active" | "expired" | "cancelled"

export interface SubscriptionEntityType {
  _id?: mongoose.Types.ObjectId | string;
  userId:  mongoose.Types.ObjectId | string;
  schoolId:  mongoose.Types.ObjectId | string;
  planId:  mongoose.Types.ObjectId | string | PlanEntityType;
  planPrice: number;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatusType;
  createdAt?: Date;
  updatedAt?: Date;
}