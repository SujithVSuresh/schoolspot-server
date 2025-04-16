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
classRouter.post('/add-announcement', protectRoute(["admin"]), classController.addAnnouncement.bind(classController))
classRouter.put('/update-announcement', protectRoute(["admin"]), classController.updateAnnouncement.bind(classController))
classRouter.get('/get-announcements', protectRoute(["admin"]), classController.fetchAnnouncements.bind(classController))


export default classRouter;


