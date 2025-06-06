import mongoose from "mongoose";
import Notification from "../../models/Notification";
import { NotificationEntityType } from "../../types/NotificationType";
import { INotificationRepository } from "../interface/INotificationRepository";
import { BaseRepository } from "./BaseRepository";
import { UpdateResult } from "mongoose";

class NotificationRepository
  extends BaseRepository<NotificationEntityType>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async createNotification(
    data: NotificationEntityType
  ): Promise<NotificationEntityType> {
    try {
      return await Notification.insertOne(data);
    } catch (error) {
      console.error("Error creating notification", error);
      throw new Error("Error creating notification");
    }
  }
}

export default new NotificationRepository();
