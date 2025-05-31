import { PlanService } from "../services/implementation/PlanService";
import PlanRepository from "../repositories/implementaion/PlanRepository";
import { PlanController } from "../controllers/implementation/PlanController";
import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";


const planService = new PlanService(PlanRepository)

const planController = new PlanController(planService)

const planRouter = Router()


planRouter.get('/', protectRoute(["superadmin"]), planController.findAllPlans.bind(planController));

export default planRouter

