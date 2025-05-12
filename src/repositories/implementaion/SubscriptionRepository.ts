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
        planId: new mongoose.Types.ObjectId(data.planId as string),
      });

      return response;
    } catch (error) {
      console.error("Error creating subscription", error);
      throw new Error("Error creating subscription");
    }
  }

  async updateSubscription(id: string, data: Partial<SubscriptionEntityType>): Promise<SubscriptionEntityType | null> {
    try {
      const response = await this.update(
        id,
        { ...data } 
      );

      return response;
    } catch (error) {
      console.error("Error creating subscription", error);
      throw new Error("Error creating subscription");
    }
  }

  async findSubscription(data: { schoolId: string; status: SubscriptionStatusType; }): Promise<SubscriptionEntityType | null> {
         try {
      const response = await Subscription.aggregate([
        {
            $match: {
                schoolId: new mongoose.Types.ObjectId(data.schoolId),
                status: "active"
            }
        },
        {
            $lookup: {
                from: 'Plan',
                foreignField: '_id',
                localField: 'planId',
                as: 'planId'
            }
        },
        {
            $unwind: "$planId"
        }
      ])

      return response[0];
    } catch (error) {
      console.error("Error finding subscription", error);
      throw new Error("Error finding subscription");
    } 
  }
}

export default new SubscriptionRepository();
