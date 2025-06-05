import mongoose from "mongoose";
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

    async findUserNotifications(userId: string, academicYear: string): Promise<UserNotificationEntityType[]>{
        try{
            const notifications = UserNotification.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        academicYear: new mongoose.Types.ObjectId(academicYear)
                    }
                },
                {
                    $lookup: {
                        from: 'Notifications',
                        localField: 'notificationId',
                        foreignField: '_id',
                        as: 'notificationId'
                    }
                },
                {
                    $unwind: "$notificationId"
                }
            ])

            return notifications

        }catch(error){
            console.error("Error finding user notifications", error);
            throw new Error("Error finding user notifications")
        }
    }
}


export default new UserNotificationRespository()