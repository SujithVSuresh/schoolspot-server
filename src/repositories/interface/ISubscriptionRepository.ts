import { SubscriptionEntityType } from "../../types/SubscriptionType";
import { SubscriptionStatusType } from "../../types/SubscriptionType";

export interface ISubscriptionRepository {
    createSubscription(data: SubscriptionEntityType): Promise<SubscriptionEntityType>
    changeSubscriptionStatus(id: string, status: SubscriptionStatusType): Promise<SubscriptionEntityType | null>
}