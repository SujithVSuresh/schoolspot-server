import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "../../services/interface/ISubscriptionService";
import { ISubscriptionController } from "../interface/ISubscriptionController";
import { CreatePlanDTO, UpdatePlanDTO } from "../../dto/SubscriptionDTO";
import HttpStatus from "../../constants/StatusConstants";


export class SubscriptionController implements ISubscriptionController {
    constructor(
       private _subscriptionService: ISubscriptionService
    ){}

    async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
        const data = req.body

        const planData: CreatePlanDTO = {
            name: data.name,
            durationInDays: data.durationInDays,
            price: data.price
        }

        const response = await this._subscriptionService.createPlan(planData)

        res.status(HttpStatus.CREATED).json(response)
    }catch(err){
        next(err)
    }
    }

    async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const data = req.body
        const {planId} = req.params

        const planData: UpdatePlanDTO = {
            name: data.name,
            durationInDays: data.durationInDays,
            price: data.price
        }

        const response = await this._subscriptionService.updatePlan(planId, planData)

        res.status(HttpStatus.OK).json(response)
    }catch(err){
        next(err)
    }
    }

    async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
       try{
        const {planId} = req.params

        const response = await this._subscriptionService.deletePlan(planId)

        res.status(HttpStatus.OK).json(response)
    }catch(err){
        next(err)
    }   
    }

    async findPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
          try{

        const response = await this._subscriptionService.findPlans()

        res.status(HttpStatus.OK).json(response)
    }catch(err){
        next(err)
    }
    }
}