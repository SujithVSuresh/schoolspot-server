import { CreatePlanDTO, CreateSubscriptionDTO, PlanResponseDTO, SubscriptionResponseDTO, UpdatePlanDTO } from "../../dto/SubscriptionDTO";
import { IPlanRepository } from "../../repositories/interface/IPlanRespository";
import { ISubscriptionRepository } from "../../repositories/interface/ISubscriptionRepository";
import { ISubscriptionService } from "../interface/ISubscriptionService";
import { checkSubscription } from "../../utils/CheckSubscription";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";

export class SubscriptionService implements ISubscriptionService {
    constructor(
        private _planRepository: IPlanRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ){}

    async createPlan(data: CreatePlanDTO): Promise<PlanResponseDTO> {
        const response = await this._planRepository.createPlan(data)

        return {
            _id: String(response._id),
            name: response.name,
            durationInDays: response.durationInDays,
            price: response.price,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt
        }
    }


    async updatePlan(id: string, data: UpdatePlanDTO): Promise<PlanResponseDTO | null> {
        const response = await this._planRepository.updatePlan(id, data)

        if(!response){
            throw new CustomError(Messages.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(response._id),
            name: response.name,
            durationInDays: response.durationInDays,
            price: response.price,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt
        }
            
    }

    async findPlans(): Promise<PlanResponseDTO[]> {
        const response = await this._planRepository.findPlans()

        return response.map((plan) => ({
            _id: String(plan._id),
            name: plan.name,
            durationInDays: plan.durationInDays,
            price: plan.price,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt
        }))
    }

    async deletePlan(id: string): Promise<{ _id: string; }> {
        const response = await this._planRepository.deletePlan(id)

        if(!response){
            throw new CustomError(Messages.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: id
        }
    }

    async createSubscription(data: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO> {
        const response = await this._subscriptionRepository.createSubscription(data)

        return {
            _id: String(response._id),
            userId: String(response.userId),
              schoolId: String(response.schoolId),
              planId: String(response.planId),
              startDate: response.startDate,
              endDate: response.endDate,
              status: response.status,
              createdAt: response.createdAt as Date,
              updatedAt: response.updatedAt as Date
        }
    }

    async handleSubscription(schoolId: string): Promise<boolean> {
        const subscription = await this._subscriptionRepository.findSubscription({schoolId, status: "active"})

        const isActive = checkSubscription(String(subscription?.endDate))

        if(isActive){
            return true
        }

        const pendingSubscription = await this._subscriptionRepository.findSubscription({schoolId, status: "pending"})


        if(pendingSubscription){
            await this._subscriptionRepository.updateSubscription(String(pendingSubscription._id), {status: "active"})
            return true
        }

        return false

    }


}