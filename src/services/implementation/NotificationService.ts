import { INotificationRepository } from "../../repositories/interface/INotificationRepository";
import {
  NotificationEntityType,
  UserNotificationEntityType,
} from "../../types/NotificationType";
import { INotificationService } from "../interface/INotificationService";
import {
  CreateNotificationDTO,
  CreateUserNotificationDTO,
  NotificationResponseDTO,
} from "../../dto/NotificationDTO";
import { NotificationTypesType } from "../../types/NotificationType";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { IUserNotificationRepository } from "../../repositories/interface/IUserNotificationRepository";
import mongoose from "mongoose";

export class NotificationService implements INotificationService {
  constructor(
    private _notificationRepository: INotificationRepository,
    private _userNotificationRepository: IUserNotificationRepository
  ) {}

  async sendNotification(
    data: CreateNotificationDTO,
    users: string[]
  ): Promise<NotificationResponseDTO> {

    console.log(users, "uuusserrrss")

      const notificationContent = this.handleNotificationMessage(
        data.notificationType,
        data.message
      );

      const createNotification =
        await this._notificationRepository.createNotification(
          {
            ...data,
            title: notificationContent.title,
            message: notificationContent.message,
          },
        );

      const userNotificationData: UserNotificationEntityType[] = users.map(
        (user) => {
          return {
            academicYear: new mongoose.Types.ObjectId(
              createNotification.academicYear
            ),
            notificationId: new mongoose.Types.ObjectId(createNotification._id),
            userId: new mongoose.Types.ObjectId(user),
            isCleared: false,
            isRead: false,
          };
        }
      );

      await this._userNotificationRepository.createUserNotifications(
        userNotificationData,
      );

      return {
        _id: String(createNotification._id),
        title: createNotification.title,
        message: createNotification.message,
        notificationType: createNotification.notificationType,
        createdAt: createNotification.createdAt as Date,
      };

  }

  private handleNotificationMessage(
    notificationType: NotificationTypesType,
    message: string
  ): { title: string; message: string } {
    switch (notificationType) {
      case "assignment":
        return {
          title: `Assignment Notification`,
          message: `You have a new assignment: ${message}`,
        };
      case "study_material":
        return {
          title: `Study Material Notification`,
          message: `You have a new study material: ${message}`,
        };
      case "message":
        return {
          title: `Assignment Notification`,
          message: `You have a new assignment: ${message}`,
        };
      case "invoice":
        return {
          title: `Invoice Notification`,
          message: `You have a new invoice: ${message}`,
        };
      case "attendance":
        return {
          title: `Attendance Notification`,
          message:
            message == "Present"
              ? `Your attendance for today (${String(new Date()).slice(
                  0,
                  10
                )}) has been successfully marked as Present. Keep up the consistent`
              : `Our records show that you were marked Absent today (${String(
                  new Date()
                ).slice(
                  0,
                  10
                )}). If this is an error or you have a valid reason, please contact your class teacher or the school office.`,
        };

      default:
        throw new Error("Unsupported notification type");
    }
  }

  async fetchNotifications(
    userId: string,
    academicYear: string
  ): Promise<NotificationResponseDTO[]> {
    const response =
      await this._userNotificationRepository.findUserNotifications(
        userId,
        academicYear
      );

    const notifications: NotificationResponseDTO[] = response.map(
      (item: UserNotificationEntityType) => {
        const notification = item.notificationId as NotificationEntityType;
        return {
          _id: String(notification._id),
          title: notification.title,
          message: notification.message,
          notificationType: notification.notificationType,
          createdAt: notification.createdAt as Date,
          userNotificationId: String(item._id),
        };
      }
    );

    return notifications;
  }

  async clearNotification(notificationId: string): Promise<{ _id: string }> {
    const response =
      await this._userNotificationRepository.updateNotificationStatus(
        notificationId,
        {
          isCleared: true,
          clearedAt: new Date(),
        }
      );
    if (!response) {
      throw new CustomError(
        Messages.NOTIFICATION_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      _id: String(response._id),
    };
  }

  async clearAllNotifications(userId: string): Promise<{ userId: string }> {
    const response =
      await this._userNotificationRepository.updateManyNotificationStatus(
        {
          userId: new mongoose.Types.ObjectId(userId),
          isCleared: false,
        },
        {
          isCleared: true,
          clearedAt: new Date(),
        }
      );

    if (!response) {
      throw new CustomError(
        Messages.NOTIFICATION_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      userId,
    };
  }

  async setReadNotifications(userId: string): Promise<{ userId: string }> {
    const response =
      await this._userNotificationRepository.updateManyNotificationStatus(
        {
          userId: new mongoose.Types.ObjectId(userId),
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      );

    if (!response) {
      throw new CustomError(
        Messages.NOTIFICATION_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      userId,
    };
  }
}
