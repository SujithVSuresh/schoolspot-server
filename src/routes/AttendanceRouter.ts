import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { AttendanceService } from "../services/implementation/AttendanceService";
import AttendanceRepository from "../repositories/implementaion/AttendanceRepository";
import { AttendanceController } from "../controllers/implementation/AttendanceController";
import LeaveLetterRepository from "../repositories/implementaion/LeaveLetterRepository";

const attendaceService = new AttendanceService(AttendanceRepository, LeaveLetterRepository);

const attendanceController = new AttendanceController(attendaceService);

const attendaceRouter = Router();


attendaceRouter.post('/add-attendance', protectRoute(["admin", "teacher"]), attendanceController.addAttendance.bind(attendanceController));
attendaceRouter.get('/get-attendance', protectRoute(["admin", "teacher"]), attendanceController.findAttendanceByClass.bind(attendanceController));
attendaceRouter.put('/update-attendance-status', protectRoute(["admin", "teacher"]), attendanceController.updateAttendanceStatus.bind(attendanceController))
attendaceRouter.get('/monthly-attendance', protectRoute(["admin", "student", "teacher"]), attendanceController.getAttendanceByMonth.bind(attendanceController))

attendaceRouter.post('/leave-letter', protectRoute(["student"]), attendanceController.createLeaveLetter.bind(attendanceController))
attendaceRouter.get('/monthly-leaves', protectRoute(["student"]), attendanceController.getLeaveLetterByMonth.bind(attendanceController))

export default attendaceRouter;


