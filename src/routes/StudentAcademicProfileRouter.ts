import { Router } from "express";
import { StudentAcademicProfileController } from "../controllers/implementation/StudentAcademicProfileController";
import StudentAcademicProfileRepository from "../repositories/implementaion/StudentAcademicProfileRepository";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import { StudentAcadmicProfileService } from "../services/implementation/StudentAcademicProfileService";
import { protectRoute } from "../middlewares/AuthHandler";


const studentAcademicProfileService = new StudentAcadmicProfileService(StudentAcademicProfileRepository, StudentRepository)

const studentAcademicProfileController = new StudentAcademicProfileController(studentAcademicProfileService)

const studentAcademicProfileRouter = Router()

studentAcademicProfileRouter.post("/", protectRoute(["admin"]), studentAcademicProfileController.createAcademicProfile.bind(studentAcademicProfileController));
studentAcademicProfileRouter.get("/:userId", protectRoute(["admin"]), studentAcademicProfileController.fetchStudentProfile.bind(studentAcademicProfileController));
studentAcademicProfileRouter.get("/class/:classId", protectRoute(["admin"]), studentAcademicProfileController.fetchAcademicProfileByClassId.bind(studentAcademicProfileController));


export default studentAcademicProfileRouter;