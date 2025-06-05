import mongoose from "mongoose";

export type NotificationTypesType =
  | "message"
  | "study_material"
  | "assignment"
  | "invoice"
  | "exam"
  | "exam_result"
  | "attendance";

export interface NotificationEntityType {
  _id?: mongoose.Types.ObjectId | string;
  title: string;
  message: string;
  notificationType: NotificationTypesType;
  metadata?: string | null;
  academicYear: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}



// -------------- 

export interface UserNotificationEntityType {
  _id?: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  notificationId: mongoose.Types.ObjectId | string;
  isRead: boolean;
  isCleared: boolean;
  readAt?: Date | null;
  clearedAt?: Date | null;
  academicYear: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}