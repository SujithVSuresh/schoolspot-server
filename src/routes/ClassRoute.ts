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


classRouter.post('/', protectRoute(["admin"]), classController.createClass.bind(classController));
classRouter.get('/get-classes', protectRoute(["admin"]), classController.findAllClasses.bind(classController));
classRouter.get('/classes/teacher', protectRoute(["teacher"]), classController.findClassesByTeacherId.bind(classController));
classRouter.put('/:classId', protectRoute(["admin"]), classController.updateClass.bind(classController));
classRouter.get('/:classId', protectRoute(["admin", "teacher", "student"]), classController.findClassById.bind(classController));
classRouter.delete('/:classId', protectRoute(["admin"]), classController.deleteClass.bind(classController));

classRouter.get('/announcements/author', protectRoute(["admin"]), classController.findAnnouncementsByAuthor.bind(classController))
classRouter.post('/announcement', protectRoute(["admin", "teacher"]), classController.addAnnouncement.bind(classController))
classRouter.put('/announcement/:announcementId', protectRoute(["admin", "teacher"]), classController.updateAnnouncement.bind(classController))
classRouter.get('/announcement/:announcementId', protectRoute(["student", "admin", "teacher"]), classController.findAnnouncementDetails.bind(classController))
classRouter.get('/announcements/pin', protectRoute(["student"]), classController.findPinnedAnnouncements.bind(classController))
classRouter.get('/announcements/:classId', protectRoute(["admin", "teacher", "student"]), classController.findAnnouncements.bind(classController))
classRouter.delete('/announcement/:announcementId', protectRoute(["admin", "teacher"]), classController.deleteAnnouncement.bind(classController))
classRouter.patch('/announcement/:announcementId/pin', protectRoute(["student"]), classController.updatePinnedStatus.bind(classController))

classRouter.get('/announcements/:classId/:count', protectRoute(["student"]), classController.findAnnouncementsByCount.bind(classController))

export default classRouter;


