import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { ClassService } from "../services/implementation/ClassService";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import { ClassController } from "../controllers/implementation/ClassController";
import AnnouncementRepository from "../repositories/implementaion/AnnouncementRepository";
import AttendanceRepository from "../repositories/implementaion/AttendanceRepository";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import SubjectRepository from "../repositories/implementaion/SubjectRepository";



const classService = new ClassService(ClassRepository, AnnouncementRepository, AttendanceRepository, StudentRepository, SubjectRepository);

const classController = new ClassController(classService);

const classRouter = Router();


classRouter.post('/add-class', protectRoute(["admin"]), classController.createClass.bind(classController));
classRouter.get('/get-classes', protectRoute(["admin"]), classController.findAllClasses.bind(classController));
classRouter.get('/get-classes/teacher', protectRoute(["teacher"]), classController.findClassesByTeacherId.bind(classController));
classRouter.get('/get-class/:classId', protectRoute(["admin", "teacher", "student"]), classController.findClassById.bind(classController));

classRouter.post('/announcement', protectRoute(["admin", "teacher"]), classController.addAnnouncement.bind(classController))
classRouter.put('/announcement', protectRoute(["admin", "teacher"]), classController.updateAnnouncement.bind(classController))
classRouter.get('/announcements', protectRoute(["admin", "teacher"]), classController.findAnnouncements.bind(classController))
classRouter.get('/announcements/:classId', protectRoute(["admin", "teacher"]), classController.findAnnouncements.bind(classController))


export default classRouter;


