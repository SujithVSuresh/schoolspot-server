import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { AttendanceService } from "../services/implementation/AttendanceService";
import AttendanceRepository from "../repositories/implementaion/AttendanceRepository";
import { AttendanceController } from "../controllers/implementation/AttendanceController";

const attendaceService = new AttendanceService(AttendanceRepository);

const attendanceController = new AttendanceController(attendaceService);

const attendaceRouter = Router();


attendaceRouter.post('/add-attendance', protectRoute("admin"), attendanceController.addAttendance.bind(attendanceController));
attendaceRouter.get('/get-attendance', protectRoute("admin"), attendanceController.findAttendanceByClass.bind(attendanceController));
attendaceRouter.put('/update-attendance-status', protectRoute("admin"), attendanceController.updateAttendanceStatus.bind(attendanceController))


export default attendaceRouter;


