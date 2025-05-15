import { PlanEntityType } from "../../types/SubscriptionType";



export interface IPlanRepository {
    createPlan(data: PlanEntityType): Promise<PlanEntityType>
    updatePlan(id: string, data: Partial<PlanEntityType>): Promise<PlanEntityType | null>
    deletePlan(id: string): Promise<boolean>
    findAllPlans(): Promise<PlanEntityType[]>
    findPlanByDuration(duration: number): Promise<PlanEntityType | null>
    findPlanById(id: string): Promise<PlanEntityType | null>
}