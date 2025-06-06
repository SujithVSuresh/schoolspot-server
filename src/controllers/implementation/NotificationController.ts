import { Request, Response, NextFunction } from "express";
import { INotificationService } from "../../services/interface/INotificationService";
import { INotificationController } from "../interface/INotificationController";
import { CustomRequest, PayloadType } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";

export class NotificationController implements INotificationController {
  constructor(private _notificationService: INotificationService) {}

  async fetchNotifications(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user as PayloadType;
      console.log(userId, req.academicYear, "blii")

      const response = await this._notificationService.fetchNotifications(
        userId,
        req.academicYear as string
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async clearNotification(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;

      const response = await this._notificationService.clearNotification(
        notificationId
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async clearAllNotifications(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      const response = await this._notificationService.clearAllNotifications(
        userId as string
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async setReadNotifications(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      const response = await this._notificationService.setReadNotifications(
        userId as string
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
