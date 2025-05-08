import { Request, Response, NextFunction } from "express";
import { INotificationService } from "../../services/interface/INotificationService";
import { INotificationController } from "../interface/INotificationController";
import { CustomRequest, PayloadType } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";



export class NotificationController implements INotificationController {
    constructor(
        private _notificationService: INotificationService
    ){}

    async fetchNotifications(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.user as PayloadType

            const response = await this._notificationService.fetchNotifications(userId)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }
}