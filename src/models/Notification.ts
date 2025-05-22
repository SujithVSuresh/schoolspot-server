import mongoose, { Schema } from "mongoose";
import { NotificationEntityType } from "../types/NotificationType";

const NotificationSchema = new Schema(
  {
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    ],
    notificationType: {
      type: String,
      enum: ["message", "study_material", "assignment", "invoice", "exam", "exam_result", "attendance"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<NotificationEntityType>(
  "Notification",
  NotificationSchema,
  "Notifications"
);
