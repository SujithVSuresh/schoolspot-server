import mongoose from "mongoose";

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
    enum: ["pending", "active", "expired", "cancelled"],
    required: true
  }
  },
  { timestamps: true }
);

export default mongoose.model<null>(
  "Subscription",
  subscriptionSchema,
  "Subscriptions"
);
