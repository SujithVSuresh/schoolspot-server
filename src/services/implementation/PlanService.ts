import { PlanResponseDTO } from "../../dto/SubscriptionDTO";
import { IPlanRepository } from "../../repositories/interface/IPlanRespository";
import { IPlanService } from "../interface/IPlanService";



export class PlanService implements IPlanService {
    constructor(
        private _planRepository: IPlanRepository
    ){}

    async findAllPlans(): Promise<PlanResponseDTO[]> {
        const response = await this._planRepository.findAllPlans()

       const allPlans: PlanResponseDTO[] = response.map((plan) => {
        return {
            _id: String(plan._id),
            name: plan.name,
            durationInDays: plan.durationInDays,
            price: plan.price,
            createdAt: plan.createdAt
        }
       })

       return allPlans
    }
}