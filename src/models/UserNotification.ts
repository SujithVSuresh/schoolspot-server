import mongoose, { Schema } from "mongoose";
import { UserNotificationEntityType } from "../types/NotificationType";

const UserNotificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isCleared: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    clearedAt: {
      type: Date,
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


export default mongoose.model<UserNotificationEntityType>(
  "UserNotification",
  UserNotificationSchema,
  "UserNotifications"
);
