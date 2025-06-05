import mongoose, { Schema } from "mongoose";
import { NotificationEntityType } from "../types/NotificationType";

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    notificationType: {
      type: String,
      enum: [
        "message",
        "study_material",
        "assignment",
        "invoice",
        "exam",
        "exam_result",
        "attendance",
      ],
      required: true,
    },
    metadata: {
      type: String,
      default: null,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
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
