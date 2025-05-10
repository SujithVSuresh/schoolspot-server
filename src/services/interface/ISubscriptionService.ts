import { CreatePlanDTO, PlanResponseDTO } from "../../dto/SubscriptionDTO";


export interface ISubscriptionService {
    createPlan(data: CreatePlanDTO): Promise<PlanResponseDTO>
}