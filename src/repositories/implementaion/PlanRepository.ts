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

  async findAllPlans(): Promise<PlanEntityType[]> {
    try {
      const plans = await this.findAll();
      return plans;
    } catch (error) {
      console.error("Error finding plans", error);
      throw new Error("Error finding plans");
    }
  }

  async findPlanByDuration(duration: number): Promise<PlanEntityType | null> {
    try {
      const plans = await this.findOne({durationInDays: duration})
      return plans;
    } catch (error) {
      console.error("Error finding plans", error);
      throw new Error("Error finding plans");
    }
  }

    async findPlan(query: Partial<PlanEntityType>): Promise<PlanEntityType | null> {
    try {
      const plan = await Plan.findOne({...query})
      return plan;
    } catch (error) {
      console.error("Error finding plans", error);
      throw new Error("Error finding plans");
    }
  }


  async findPlanById(id: string): Promise<PlanEntityType | null> {
    try {
      const plan = await this.findById(id);
      return plan;
    } catch (error) {
      console.error("Error finding plan", error);
      throw new Error("Error finding plan");
    }
  }
}

export default new PlanRepository();
