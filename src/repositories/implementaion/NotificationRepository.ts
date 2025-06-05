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
      return await Notification.find({
        userId: new mongoose.Types.ObjectId(userId),
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error creating notification", error);
      throw new Error("Error creating notification");
    }
  }

  // async clearOneNotification(
  //   notificationId: string,
  //   userId: string
  // ): Promise<NotificationEntityType | null> {
  //   try {
  //     return await Notification.findOneAndUpdate(
  //       { _id: new mongoose.Types.ObjectId(notificationId) },
  //       { $pull: { userId: userId } },
  //       {new: true}
  //     );
  //   } catch (error) {
  //     console.error("Error clearing notification", error);
  //     throw new Error("Error clearing notification");
  //   }
  // }

  // async clearManyNotification(userId: string): Promise<UpdateResult> {
  //   try {
  //     const response = await Notification.updateMany(
  //       { userId: new mongoose.Types.ObjectId(userId) },
  //       { $pull: { userId: userId } }
  //     );
  //     return response
  //   } catch (error) {
  //     console.error("Error clearing notifications", error);
  //     throw new Error("Error clearing notifications");
  //   }
  // }
}

export default new NotificationRepository();
