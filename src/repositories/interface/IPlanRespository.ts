import { PlanEntityType } from "../../types/SubscriptionType";



export interface IPlanRepository {
    createPlan(data: PlanEntityType): Promise<PlanEntityType>
    updatePlan(id: string, data: Partial<PlanEntityType>): Promise<PlanEntityType | null>
    deletePlan(id: string): Promise<boolean>
    findPlans(): Promise<PlanEntityType[]>
}