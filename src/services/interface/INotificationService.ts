import {
  CreateNotificationDTO,
  NotificationResponseDTO,
} from "../../dto/NotificationDTO";

export interface INotificationService {
  sendNotification(
    data: CreateNotificationDTO,
    users: string[]
  ): Promise<NotificationResponseDTO>;
  fetchNotifications(
    userId: string,
    academicYear: string
  ): Promise<NotificationResponseDTO[]>;
  clearNotification(notificationId: string): Promise<{ _id: string }>;
  clearAllNotifications(userId: string): Promise<{ userId: string }>;
  setReadNotifications(userId: string): Promise<{ userId: string }>;
}
