import UserNotification from "../../models/UserNotification";
import { UserNotificationEntityType } from "../../types/NotificationType";
import { IUserNotificationRepository } from "../interface/IUserNotificationRepository";
import { BaseRepository } from "./BaseRepository";


class UserNotificationRespository extends BaseRepository<UserNotificationEntityType> implements IUserNotificationRepository {
    constructor(){
        super(UserNotification)
    }


    async createUserNotifications(data: UserNotificationEntityType[]): Promise<UserNotificationEntityType[]> {
        try{
            const notifications = await this.createMany(data)

            return notifications
        }catch(error){
            console.error("Error creating user notifications", error);
            throw new Error("Error creating user notifications")
        }
    }

    async updateNotificationStatus(id: string, data: Partial<UserNotificationEntityType>): Promise<UserNotificationEntityType | null> {
        try{
            const notifications = await this.update(id, data)

            return notifications
        }catch(error){
            console.error("Error updatiing user notifications", error);
            throw new Error("Error updating user notifications")
        }
    }
}


export default new UserNotificationRespository()