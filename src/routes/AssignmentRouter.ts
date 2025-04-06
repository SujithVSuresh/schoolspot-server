import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import AssignmentRepository from "../repositories/implementaion/AssignmentRepository";
import { AssignmentService } from "../services/implementation/AssignmentService";
import { AssignmentController } from "../controllers/implementation/AssignmentController";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import AssignmentSubmissionRepository from "../repositories/implementaion/AssignmentSubmissionRepository";

const assignmentService = new AssignmentService(AssignmentRepository, StudentRepository, AssignmentSubmissionRepository);
const assignmentController = new AssignmentController(assignmentService);

const assignmentRouter = Router();


assignmentRouter.post('/add', protectRoute(["teacher"]), assignmentController.createAssignment.bind(assignmentController));
assignmentRouter.get('/get-assignments/:subjectId', protectRoute(["teacher"]), assignmentController.getAssignments.bind(assignmentController));
assignmentRouter.get('/get-assignment/:assignmentId', protectRoute(["teacher"]), assignmentController.getAssignmentById.bind(assignmentController));
assignmentRouter.get('/get-submissions/:assignmentId', protectRoute(["teacher"]), assignmentController.getAllAssignmentSubmissions.bind(assignmentController));

export default assignmentRouter