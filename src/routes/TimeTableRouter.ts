import { TimeTableService } from "../services/implementation/TimeTableService";
import TimeTableRepository from "../repositories/implementaion/TimeTableRepository";
import { TimeTableController } from "../controllers/implementation/TimeTableController";
import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";

const timetableService = new TimeTableService(TimeTableRepository)

const timetableController = new TimeTableController(timetableService)

const timetableRouter = Router()


timetableRouter.post("/:classId", protectRoute(["admin"]), timetableController.upsertTimetable.bind(timetableController));
timetableRouter.delete("/:id", protectRoute(["admin"]), timetableController.deleteTimetable.bind(timetableController));
timetableRouter.get("/:classId", protectRoute(["admin", "student", "teacher"]), timetableController.findTimetableByClass.bind(timetableController));


export default timetableRouter
