import { Router } from "express";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import { StudentService } from "../services/implementation/StudentService";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import { StudentController } from "../controllers/implementation/StudentController";
import UserRepository from "../repositories/implementaion/UserRepository";
import {upload} from '../middlewares/UploadMiddleware'
import { protectRoute } from "../middlewares/AuthHandler";
import StudentAcademicProfileRepository from "../repositories/implementaion/StudentAcademicProfileRepository";

const studentService = new StudentService(StudentRepository, UserRepository, ClassRepository, StudentAcademicProfileRepository);

const studentController = new StudentController(studentService);

const studentRouter = Router();

studentRouter.post("/", protectRoute(["admin"]), upload.single("profilePhoto"), studentController.addStudent.bind(studentController));
// studentRouter.put("/:studentId", protectRoute(["admin"]), upload.single("profilePhoto"), studentController.updateStudent.bind(studentController));
studentRouter.get("/students", protectRoute(["admin"]), studentController.getStudents.bind(studentController));
studentRouter.get("/:userId", protectRoute(["admin", "teacher", "student"]), studentController.getStudentProfile.bind(studentController))
studentRouter.get("/profile", protectRoute(["student"]), studentController.getStudentProfile.bind(studentController))

// studentRouter.get("/students/:classId", protectRoute(["admin", "teacher"]), studentController.getStudentsByClassId.bind(studentController));

export default studentRouter;