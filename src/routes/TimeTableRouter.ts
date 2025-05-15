import { TimeTableService } from "../services/implementation/TimeTableService";
import TimeTableRepository from "../repositories/implementaion/TimeTableRepository";
import { TimeTableController } from "../controllers/implementation/TimeTableController";
import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";

const timetableService = new TimeTableService(TimeTableRepository)

const timetableController = new TimeTableController(timetableService)

const timetableRouter = Router()


timetableRouter.post("/", protectRoute(["admin"]), timetableController.createTimetable.bind(timetableController));
timetableRouter.put("/", protectRoute(["admin"]), timetableController.updateTimetable.bind(timetableController));
timetableRouter.delete("/", protectRoute(["admin"]), timetableController.deleteTimetable.bind(timetableController));
timetableRouter.get("/:classId", protectRoute(["admin"]), timetableController.findTimetableByClass.bind(timetableController));


export default timetableRouter
