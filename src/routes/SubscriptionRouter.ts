import { Router } from "express";
import { SubscriptionController } from "../controllers/implementation/SubscriptionController";
import PlanRepository from "../repositories/implementaion/PlanRepository";
import { SubscriptionService } from "../services/implementation/SubscriptionService";
import { protectRoute } from "../middlewares/AuthHandler";


const subscriptionService = new SubscriptionService(PlanRepository)

const subscriptionController = new SubscriptionController(subscriptionService)

const subscriptionRouter = Router()


subscriptionRouter.post('/plan', protectRoute(["superadmin"]), subscriptionController.createPlan.bind(subscriptionController));


export default subscriptionRouter