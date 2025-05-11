import Subscription from "../../models/Subscription";
import { SubscriptionEntityType } from "../../types/SubscriptionType";
import { ISubscriptionRepository } from "../interface/ISubscriptionRepository";
import { BaseRepository } from "./BaseRepository";
import mongoose from "mongoose";



class SubscriptionRepository extends BaseRepository<SubscriptionEntityType> implements ISubscriptionRepository {
    constructor(){
        super(Subscription)
    }

    async createSubscription(data: SubscriptionEntityType): Promise<SubscriptionEntityType> {
        const response = await this.create({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId),
            schoolId: new mongoose.Types.ObjectId(data.schoolId),
            planId: new mongoose.Types.ObjectId(data.planId),
        })

        return response
    }
}


export default new SubscriptionRepository()