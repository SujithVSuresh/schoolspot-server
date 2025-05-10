import { PlanEntityType } from "../../types/SubscriptionType";



export interface IPlanRepository {
    createPlan(data: PlanEntityType): Promise<PlanEntityType>
}