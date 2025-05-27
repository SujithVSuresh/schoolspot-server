import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { AttendanceService } from "../services/implementation/AttendanceService";
import AttendanceRepository from "../repositories/implementaion/AttendanceRepository";
import { AttendanceController } from "../controllers/implementation/AttendanceController";
import LeaveLetterRepository from "../repositories/implementaion/LeaveLetterRepository";
import { NotificationService } from "../services/implementation/NotificationService";
import NotificationRepository from "../repositories/implementaion/NotificationRepository";


const notificationService = new NotificationService(NotificationRepository)


const attendaceService = new AttendanceService(AttendanceRepository, LeaveLetterRepository, notificationService);

const attendanceController = new AttendanceController(attendaceService);

const attendaceRouter = Router();


attendaceRouter.post('/', protectRoute(["admin", "teacher"]), attendanceController.addAttendance.bind(attendanceController));
attendaceRouter.get('/', protectRoute(["admin", "teacher"]), attendanceController.findAttendanceByClass.bind(attendanceController));
attendaceRouter.put('/status', protectRoute(["admin", "teacher"]), attendanceController.updateAttendanceStatus.bind(attendanceController))
attendaceRouter.get('/monthly', protectRoute(["admin", "student", "teacher"]), attendanceController.getAttendanceByMonth.bind(attendanceController))
attendaceRouter.get('/overview', protectRoute(["admin", "student", "teacher"]), attendanceController.getAttendanceOverview.bind(attendanceController))

attendaceRouter.post('/leave-letter', protectRoute(["student"]), attendanceController.createLeaveLetter.bind(attendanceController))
attendaceRouter.put('/leave-letter/:id', protectRoute(["student"]), attendanceController.editLeaveLetter.bind(attendanceController))
attendaceRouter.delete('/leave-letter/:id', protectRoute(["student"]), attendanceController.deleteLeaveLetter.bind(attendanceController))
attendaceRouter.get('/leave-letters', protectRoute(["student", "teachers"]), attendanceController.getLeaveLetterByMonth.bind(attendanceController))

export default attendaceRouter;


