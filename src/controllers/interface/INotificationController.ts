import { Request, Response, NextFunction } from "express";

export interface INotificationController {
    fetchNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
}