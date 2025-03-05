import { Router } from "express";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import { StudentService } from "../services/implementation/StudentService";
import { StudentController } from "../controllers/implementation/StudentController";
import UserRepository from "../repositories/implementaion/UserRepository";

const studentService = new StudentService(StudentRepository, UserRepository);

const studentController = new StudentController(studentService);

const studentRouter = Router();


studentRouter.post("/add-student", studentController.addStudent.bind(studentController));
studentRouter.get("/get-students", studentController.getStudents.bind(studentController));



export default studentRouter;