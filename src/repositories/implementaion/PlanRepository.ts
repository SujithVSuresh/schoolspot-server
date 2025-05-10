import { PlanEntityType } from "../../types/SubscriptionType";
import { IPlanRepository } from "../interface/IPlanRespository";
import { BaseRepository } from "./BaseRepository";
import Plan from "../../models/Plan";

class PlanRepository extends BaseRepository<PlanEntityType>implements IPlanRepository
{
  constructor() {
    super(Plan);
  }

  async createPlan(data: PlanEntityType): Promise<PlanEntityType> {
    try {
      return await this.create(data);
    } catch (error) {
      console.error("Error creating plan", error);
      throw new Error("Error creating plan");
    }
  }
}

export default new PlanRepository();
