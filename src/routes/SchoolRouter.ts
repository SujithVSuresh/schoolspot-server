import SchoolRepository from "../repositories/implementaion/SchoolRepository";
import { SchoolService } from "../services/implementation/SchoolService";
import { SchoolController } from "../controllers/implementation/SchoolController";
import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { schoolInfoValidationSchema } from "../utils/ValidationSchema";
import validateRequest from "../middlewares/ValidationHandler";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import TeacherRepository from "../repositories/implementaion/TeacherRepository";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import AdminRepository from "../repositories/implementaion/AdminRepository";
import SubscriptionRepository from "../repositories/implementaion/SubscriptionRepository";

const schoolService = new SchoolService(SchoolRepository, TeacherRepository, StudentRepository, ClassRepository, AdminRepository, SubscriptionRepository)

const schoolController = new SchoolController(schoolService)

const schoolRouter = Router()

schoolRouter.get('/get-school', protectRoute(["admin"]), schoolController.getSchool.bind(schoolController))
schoolRouter.put('/edit-school/:schoolId', protectRoute(["admin"]), validateRequest(schoolInfoValidationSchema), schoolController.editSchoolProfile.bind(schoolController))
schoolRouter.get('/overview', protectRoute(["admin"]), schoolController.getSchoolOverview.bind(schoolController))
schoolRouter.get('/', protectRoute(["superadmin"]), schoolController.findSchools.bind(schoolController))
schoolRouter.get('/details/:schoolId', protectRoute(["superadmin"]), schoolController.fetchSchoolProfileDetails.bind(schoolController))


export default schoolRouter
