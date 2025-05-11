import mongoose from "mongoose";


export interface PlanEntityType {
  _id?: mongoose.Types.ObjectId | string;
  name: "Free" | "3 Month" | "6 Month";
  price: number;
  durationInDays: 30 | 90 | 180;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SubscriptionStatusType = "pending" | "active" | "expired" | "cancelled"

export interface SubscriptionEntityType {
  _id?: mongoose.Types.ObjectId;
  userId:  mongoose.Types.ObjectId;
  schoolId:  mongoose.Types.ObjectId;
  planId:  mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatusType;
  createdAt?: Date;
  updatedAt?: Date;
}