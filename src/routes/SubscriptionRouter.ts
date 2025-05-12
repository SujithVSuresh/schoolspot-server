import { Router } from "express";
import { SubscriptionController } from "../controllers/implementation/SubscriptionController";
import PlanRepository from "../repositories/implementaion/PlanRepository";
import { SubscriptionService } from "../services/implementation/SubscriptionService";
import { protectRoute } from "../middlewares/AuthHandler";
import SubscriptionRepository from "../repositories/implementaion/SubscriptionRepository";


const subscriptionService = new SubscriptionService(PlanRepository, SubscriptionRepository)

const subscriptionController = new SubscriptionController(subscriptionService)

const subscriptionRouter = Router()


subscriptionRouter.post('/plan', protectRoute(["superadmin"]), subscriptionController.createPlan.bind(subscriptionController));
subscriptionRouter.put('/plan/:planId', protectRoute(["superadmin"]), subscriptionController.updatePlan.bind(subscriptionController));
subscriptionRouter.delete('/plan/:planId', protectRoute(["superadmin"]), subscriptionController.deletePlan.bind(subscriptionController));
subscriptionRouter.get('/plans', protectRoute(["superadmin"]), subscriptionController.findPlans.bind(subscriptionController));



export default subscriptionRouter