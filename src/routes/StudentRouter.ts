import { Router } from "express";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import { StudentService } from "../services/implementation/StudentService";
import { StudentController } from "../controllers/implementation/StudentController";
import UserRepository from "../repositories/implementaion/UserRepository";
import upload from '../middlewares/UploadMiddleware'
import { protectRoute } from "../middlewares/AuthHandler";

const studentService = new StudentService(StudentRepository, UserRepository);

const studentController = new StudentController(studentService);

const studentRouter = Router();


studentRouter.post("/add-student", protectRoute("admin"), upload.single("profilePhoto"), studentController.addStudent.bind(studentController));
studentRouter.get("/get-students", protectRoute("admin"), studentController.getStudents.bind(studentController));



export default studentRouter;