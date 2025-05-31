import { PlanResponseDTO } from "../../dto/SubscriptionDTO";


export interface IPlanService {
    findAllPlans(): Promise<PlanResponseDTO[]>
}