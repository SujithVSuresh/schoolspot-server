import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { ClassService } from "../services/implementation/ClassService";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import { ClassController } from "../controllers/implementation/ClassController";
import TeacherRepository from "../repositories/implementaion/TeacherRepository";
import AnnouncementRepository from "../repositories/implementaion/AnnouncementRepository";

const classService = new ClassService(ClassRepository, TeacherRepository, AnnouncementRepository);

const classController = new ClassController(classService);

const classRouter = Router();


classRouter.post('/add-class', protectRoute("admin"), classController.createClass.bind(classController));
classRouter.get('/get-classes', protectRoute("admin"), classController.findAllClasses.bind(classController));
classRouter.get('/get-class/:classId', protectRoute("admin"), classController.findClassById.bind(classController));
classRouter.post('/add-subject', protectRoute("admin"), classController.addSubject.bind(classController))
classRouter.delete('/remove-subject', protectRoute("admin"), classController.removeSubject.bind(classController));
classRouter.put('/update-subject', protectRoute("admin"), classController.updateSubject.bind(classController))
classRouter.post('/add-announcement', protectRoute("admin"), classController.addAnnouncement.bind(classController))
classRouter.put('/update-announcement', protectRoute("admin"), classController.updateAnnouncement.bind(classController))


export default classRouter;


