import mongoose from "mongoose";

export interface NotificationEntityType {
    _id?: string;
    userId: mongoose.Types.ObjectId[] | string[];
    notificationType: 'message' | 'study_material' | 'assignment';
    message: string;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }