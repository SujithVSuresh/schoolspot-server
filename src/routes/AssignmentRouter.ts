import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import AssignmentRepository from "../repositories/implementaion/AssignmentRepository";
import { AssignmentService } from "../services/implementation/AssignmentService";
import { AssignmentController } from "../controllers/implementation/AssignmentController";

const assignmentService = new AssignmentService(AssignmentRepository);
const assignmentController = new AssignmentController(assignmentService);

const assignmentRouter = Router();


assignmentRouter.post('/assignment', protectRoute(["teacher"]), assignmentController.createAssignment.bind(assignmentController));