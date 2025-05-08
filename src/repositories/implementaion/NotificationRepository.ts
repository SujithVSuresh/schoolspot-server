import mongoose from "mongoose";
import Notification from "../../models/Notification";
import { NotificationEntityType } from "../../types/NotificationType";
import { INotificationRepository } from "../interface/INotificationRepository";
import { BaseRepository } from "./BaseRepository";

class NotificationRepository
  extends BaseRepository<NotificationEntityType>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async createNotification(data: NotificationEntityType): Promise<NotificationEntityType> {
    try {
      return await this.create({
        ...data,
        userId: data.userId.map((id) => new mongoose.Types.ObjectId(id)),
      });
    } catch (error) {
      console.error("Error creating notification", error);
      throw new Error("Error creating notification");
    }
  }

  async findNotifications(userId: string): Promise<NotificationEntityType[]> {
    try {
      return await Notification.find({userId: new mongoose.Types.ObjectId(userId)}).sort({createdAt: -1})
    } catch (error) {
      console.error("Error creating notification", error);
      throw new Error("Error creating notification");
    }
  }
}

export default new NotificationRepository();
