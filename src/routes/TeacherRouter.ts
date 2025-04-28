
import { Router } from "express";
import UserRepository from "../repositories/implementaion/UserRepository";
import {upload} from '../middlewares/UploadMiddleware'
import { protectRoute } from "../middlewares/AuthHandler";
import { TeacherService } from "../services/implementation/TeacherService";
import TeacherRepository from "../repositories/implementaion/TeacherRepository";
import { TeacherController } from "../controllers/implementation/TeacherController";

const teacherService = new TeacherService(TeacherRepository, UserRepository);

const teacherController = new TeacherController(teacherService);

const teacherRouter = Router();


teacherRouter.post("/", protectRoute(["admin"]), upload.single("profilePhoto"), teacherController.addTeacher.bind(teacherController));
teacherRouter.get("/teachers", protectRoute(["admin"]), teacherController.getTeachers.bind(teacherController));
teacherRouter.get("/teachers/school", protectRoute(["admin"]), teacherController.getTeacherBySchool.bind(teacherController))
teacherRouter.get("/profile", protectRoute(["teacher"]), teacherController.getTeacherProfile.bind(teacherController))
teacherRouter.get("/profile/:userId", protectRoute(["admin"]), teacherController.getTeacherProfileById.bind(teacherController))
teacherRouter.put("/:userId", protectRoute(["admin"]), upload.single("profilePhoto"), teacherController.updateTeacher.bind(teacherController));


export default teacherRouter;