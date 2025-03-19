import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { ClassService } from "../services/implementation/ClassService";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import { ClassController } from "../controllers/implementation/ClassController";
import TeacherRepository from "../repositories/implementaion/TeacherRepository";

const classService = new ClassService(ClassRepository, TeacherRepository);

const classController = new ClassController(classService);

const classRouter = Router();


classRouter.post('/add-class', protectRoute("admin"), classController.createClass.bind(classController));
classRouter.get('/get-classes', protectRoute("admin"), classController.findAllClasses.bind(classController));
classRouter.get('/get-class/:classId', protectRoute("admin"), classController.findClassById.bind(classController));
classRouter.post('/add-subject', protectRoute("admin"), classController.addSubject.bind(classController))
classRouter.delete('/remove-subject', protectRoute("admin"), classController.removeSubject.bind(classController))


export default classRouter;