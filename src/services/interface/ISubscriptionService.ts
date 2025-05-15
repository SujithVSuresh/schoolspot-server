import { CreatePlanDTO, CreateSubscriptionDTO, PlanResponseDTO, SubscriptionListResponseDTO, SubscriptionResponseDTO, UpdatePlanDTO } from "../../dto/SubscriptionDTO";
import Stripe from "stripe";

export interface ISubscriptionService {
    createPlan(data: CreatePlanDTO): Promise<PlanResponseDTO>
    findPlans(): Promise<PlanResponseDTO[]>
    deletePlan(id: string): Promise<{_id: string}>
    updatePlan(id: string, data: UpdatePlanDTO): Promise<PlanResponseDTO | null>
    createSubscription(data: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO>
    handleSubscription(schoolId: string): Promise<boolean>
    findSubscriptionsBySchoolId(schoolId: string): Promise<SubscriptionListResponseDTO[]>
    createSubscriptionSession(    planId: string,
    amount: number,
    schoolId: string,
    userId: string): Promise<Stripe.Checkout.Session>
    handleStripeEvent(event: Stripe.Event): Promise<string>
}