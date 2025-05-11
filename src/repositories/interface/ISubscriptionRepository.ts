import { SubscriptionEntityType } from "../../types/SubscriptionType";


export interface ISubscriptionRepository {
    createSubscription(data: SubscriptionEntityType): Promise<SubscriptionEntityType>
}