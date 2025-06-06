import { UserNotificationEntityType } from "../../types/NotificationType";
import { InsertManyOptions } from "mongoose";


export interface IUserNotificationRepository {
    createUserNotifications(
      data: UserNotificationEntityType[],
    ): Promise<UserNotificationEntityType[]>
    updateNotificationStatus(id: string, data: Partial<UserNotificationEntityType>): Promise<UserNotificationEntityType | null>
    updateManyNotificationStatus(filter: Partial<UserNotificationEntityType>, data: Partial<UserNotificationEntityType>): Promise<boolean>
    findUserNotifications(userId: string, academicYear: string): Promise<UserNotificationEntityType[]>
}