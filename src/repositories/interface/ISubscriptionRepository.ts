import { SubscriptionEntityType } from "../../types/SubscriptionType";
import { SubscriptionStatusType } from "../../types/SubscriptionType";

export interface ISubscriptionRepository {
    createSubscription(data: SubscriptionEntityType): Promise<SubscriptionEntityType>
    updateSubscription(id: string, data: Partial<SubscriptionEntityType>): Promise<SubscriptionEntityType | null>
    findSubscription(data: {schoolId: string; status: SubscriptionStatusType}): Promise<SubscriptionEntityType | null>
    findSubscriptionsBySchoolId(schoolId: string): Promise<SubscriptionEntityType[]>
    findSubscriptionById(id: string): Promise<SubscriptionEntityType | null>
    deleteSubscription(id: string): Promise<boolean>
}