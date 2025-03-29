import SchoolRepository from "../repositories/implementaion/SchoolRepository";
import { SchoolService } from "../services/implementation/SchoolService";
import { SchoolController } from "../controllers/implementation/SchoolController";
import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";

const schoolRouter = Router()

const schoolService = new SchoolService(SchoolRepository)

const schoolController = new SchoolController(schoolService)

schoolRouter.get('/get-school', protectRoute("admin"), schoolController.getSchool.bind(schoolController))
schoolRouter.put('/edit-school/:schoolId', protectRoute("admin"), schoolController.editSchoolProfile.bind(schoolController))


export default schoolRouter
