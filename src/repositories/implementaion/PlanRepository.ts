import { PlanEntityType } from "../../types/SubscriptionType";
import { IPlanRepository } from "../interface/IPlanRespository";
import { BaseRepository } from "./BaseRepository";
import Plan from "../../models/Plan";

class PlanRepository
  extends BaseRepository<PlanEntityType>
  implements IPlanRepository
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

  async updatePlan(
    id: string,
    data: Partial<PlanEntityType>
  ): Promise<PlanEntityType | null> {
    try {
      const updatedPlan = await this.update(id, data);
      return updatedPlan;
    } catch (error) {
      console.error("Error updating plan", error);
      throw new Error("Error updating plan");
    }
  }

  async deletePlan(id: string): Promise<boolean> {
    try {
      const updatedPlan = await this.delete(id);
      return updatedPlan;
    } catch (error) {
      console.error("Error deleting plan", error);
      throw new Error("Error deleting plan");
    }
  }

  async findPlans(): Promise<PlanEntityType[]> {
    try {
      const plans = await this.findAll();
      return plans;
    } catch (error) {
      console.error("Error finding plans", error);
      throw new Error("Error finding plans");
    }
  }
}

export default new PlanRepository();
