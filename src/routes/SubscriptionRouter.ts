import { Router } from "express";
import { SubscriptionController } from "../controllers/implementation/SubscriptionController";
import PlanRepository from "../repositories/implementaion/PlanRepository";
import { SubscriptionService } from "../services/implementation/SubscriptionService";
import { protectRoute } from "../middlewares/AuthHandler";
import SubscriptionRepository from "../repositories/implementaion/SubscriptionRepository";
import PaymentRepository from "../repositories/implementaion/PaymentRepository";


const subscriptionService = new SubscriptionService(PlanRepository, SubscriptionRepository, PaymentRepository)

const subscriptionController = new SubscriptionController(subscriptionService)

const subscriptionRouter = Router()

subscriptionRouter.get('/school', protectRoute(["superadmin", "admin"]), subscriptionController.findSubscriptionsBySchoolId.bind(subscriptionController));

subscriptionRouter.post('/plan', protectRoute(["superadmin"]), subscriptionController.createPlan.bind(subscriptionController));
subscriptionRouter.put('/plan/:planId', protectRoute(["superadmin"]), subscriptionController.updatePlan.bind(subscriptionController));
subscriptionRouter.delete('/plan/:planId', protectRoute(["superadmin"]), subscriptionController.deletePlan.bind(subscriptionController));
subscriptionRouter.get('/plans', protectRoute(["superadmin", "admin"]), subscriptionController.findPlans.bind(subscriptionController));
subscriptionRouter.post('/subscription-session', protectRoute(["admin"]), subscriptionController.createSubscriptionSession.bind(subscriptionController));


export default subscriptionRouter