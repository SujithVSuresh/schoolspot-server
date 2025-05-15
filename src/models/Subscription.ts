import mongoose from "mongoose";
import { SubscriptionEntityType } from "../types/SubscriptionType";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schoolId: {
      type: mongoose.Types.ObjectId,
      ref: "School",
      required: true,
    },
    planId: {
      type: mongoose.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
    type: String,
    enum: ["pending", "queued", "active", "expired", "cancelled"],
    required: true
  }
  },
  { timestamps: true }
);

export default mongoose.model<SubscriptionEntityType>(
  "Subscription",
  subscriptionSchema,
  "Subscriptions"
);
