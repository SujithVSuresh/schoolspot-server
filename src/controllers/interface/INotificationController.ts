import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../../types/types";

export interface INotificationController {
    fetchNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    clearNotification(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
    setReadNotifications(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
}