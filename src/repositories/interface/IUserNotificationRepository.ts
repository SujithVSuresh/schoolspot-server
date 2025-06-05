import { UserNotificationEntityType } from "../../types/NotificationType";



export interface IUserNotificationRepository {
    createUserNotifications(data: UserNotificationEntityType[]): Promise<UserNotificationEntityType[]>
    updateNotificationStatus(id: string, data: Partial<UserNotificationEntityType>): Promise<UserNotificationEntityType | null>
}