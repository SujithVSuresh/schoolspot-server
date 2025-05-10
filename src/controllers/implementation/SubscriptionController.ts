import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "../../services/interface/ISubscriptionService";
import { ISubscriptionController } from "../interface/ISubscriptionController";
import { CreatePlanDTO } from "../../dto/SubscriptionDTO";
import HttpStatus from "../../constants/StatusConstants";


export class SubscriptionController implements ISubscriptionController {
    constructor(
       private _subscriptionService: ISubscriptionService
    ){}

    async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        const data = req.body

        const planData: CreatePlanDTO = {
            name: data.name,
            durationInDays: data.durationInDays,
            price: data.price
        }

        const response = await this._subscriptionService.createPlan(planData)

        res.status(HttpStatus.CREATED).json(response)
    }
}