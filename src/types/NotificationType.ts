import mongoose from "mongoose";


export type NotificationTypesType = 'message' | 'study_material' | 'assignment' | 'invoice' | 'exam' | 'exam_result' | 'attendance'

export interface NotificationEntityType {
    _id?: string;
    userId: mongoose.Types.ObjectId[] | string[];
    notificationType: NotificationTypesType;
    message: string;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }