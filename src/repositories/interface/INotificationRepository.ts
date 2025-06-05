import { NotificationEntityType } from "../../types/NotificationType";
import { UpdateResult } from "mongoose";
import mongoose from "mongoose";

export interface INotificationRepository {
    createNotification(data: NotificationEntityType, options: { session?: mongoose.ClientSession }): Promise<NotificationEntityType>
    // findNotifications(userId: string): Promise<NotificationEntityType[]>
    // clearOneNotification(notificationId: string, userId: string): Promise<NotificationEntityType | null>
    // clearManyNotification(userId: string): Promise<UpdateResult>
}