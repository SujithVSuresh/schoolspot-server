import { NotificationEntityType } from "../../types/NotificationType";
import { UpdateResult } from "mongoose";

export interface INotificationRepository {
    createNotification(data: NotificationEntityType): Promise<NotificationEntityType>
    findNotifications(userId: string): Promise<NotificationEntityType[]>
    clearOneNotification(notificationId: string, userId: string): Promise<NotificationEntityType | null>
    clearManyNotification(userId: string): Promise<UpdateResult>
}