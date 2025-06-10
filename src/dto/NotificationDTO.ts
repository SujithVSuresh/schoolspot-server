export type NotificationTypesType =
  | "message"
  | "study_material"
  | "assignment"
  | "invoice"
  | "exam"
  | "exam_result"
  | "attendance";

export interface CreateNotificationDTO {
  message: string;
  notificationType: NotificationTypesType;
  metadata?: string | null;
  academicYear: string;
}

export interface NotificationResponseDTO {
  _id: string;
  notificationType: NotificationTypesType;
  title: string;
  message: string;
  metadata?: string | null;
  createdAt: Date;
}

//---------

export interface CreateUserNotificationDTO {
  userId: string;
  notificationId: string;
  isRead: boolean;
  isCleared: boolean;
  readAt?: Date | null;
  clearedAt?: Date | null;
  academicYear: string;
}

export interface UserNotificationResponseDTO {
  _id: string;
  notificationId: NotificationResponseDTO;
  isRead: boolean;
  isCleared: boolean;
  readAt?: Date | null;
  clearedAt?: Date | null;
}
