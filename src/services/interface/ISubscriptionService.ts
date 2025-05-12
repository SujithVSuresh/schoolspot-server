import { CreatePlanDTO, CreateSubscriptionDTO, PlanResponseDTO, SubscriptionResponseDTO, UpdatePlanDTO } from "../../dto/SubscriptionDTO";


export interface ISubscriptionService {
    createPlan(data: CreatePlanDTO): Promise<PlanResponseDTO>
    findPlans(): Promise<PlanResponseDTO[]>
    deletePlan(id: string): Promise<{_id: string}>
    updatePlan(id: string, data: UpdatePlanDTO): Promise<PlanResponseDTO | null>
    createSubscription(data: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO>
    handleSubscription(schoolId: string): Promise<boolean>
}