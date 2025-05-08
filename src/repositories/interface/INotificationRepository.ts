import { NotificationEntityType } from "../../types/NotificationType";


export interface INotificationRepository {
    createNotification(data: NotificationEntityType): Promise<NotificationEntityType>
    findNotifications(userId: string): Promise<NotificationEntityType[]>
}