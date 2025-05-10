import { CreatePlanDTO, PlanResponseDTO } from "../../dto/SubscriptionDTO";
import { IPlanRepository } from "../../repositories/interface/IPlanRespository";
import { ISubscriptionService } from "../interface/ISubscriptionService";


export class SubscriptionService implements ISubscriptionService {
    constructor(
        private _planRepository: IPlanRepository
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
}