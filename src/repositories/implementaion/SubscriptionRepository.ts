import Subscription from "../../models/Subscription";
import {
  SubscriptionEntityType,
  SubscriptionStatusType,
} from "../../types/SubscriptionType";
import { ISubscriptionRepository } from "../interface/ISubscriptionRepository";
import { BaseRepository } from "./BaseRepository";
import mongoose from "mongoose";

class SubscriptionRepository
  extends BaseRepository<SubscriptionEntityType>
  implements ISubscriptionRepository
{
  constructor() {
    super(Subscription);
  }

  async createSubscription(
    data: SubscriptionEntityType
  ): Promise<SubscriptionEntityType> {
    try {
      const response = await this.create({
        ...data,
        userId: new mongoose.Types.ObjectId(data.userId),
        schoolId: new mongoose.Types.ObjectId(data.schoolId),
        planId: new mongoose.Types.ObjectId(data.planId),
      });

      return response;
    } catch (error) {
      console.error("Error creating subscription", error);
      throw new Error("Error creating subscription");
    }
  }

  async changeSubscriptionStatus(
    id: string,
    status: SubscriptionStatusType
  ): Promise<SubscriptionEntityType | null> {
    try {
      const response = await this.update(
        id,
        { status } 
      );

      return response;
    } catch (error) {
      console.error("Error creating subscription", error);
      throw new Error("Error creating subscription");
    }
  }
}

export default new SubscriptionRepository();
