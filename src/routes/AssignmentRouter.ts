import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import AssignmentRepository from "../repositories/implementaion/AssignmentRepository";
import { AssignmentService } from "../services/implementation/AssignmentService";
import { AssignmentController } from "../controllers/implementation/AssignmentController";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import AssignmentSubmissionRepository from "../repositories/implementaion/AssignmentSubmissionRepository";
import StudyMaterialRepository from "../repositories/implementaion/StudyMaterialRepository";
import upload from '../middlewares/UploadMiddleware'


const assignmentService = new AssignmentService(AssignmentRepository, StudentRepository, AssignmentSubmissionRepository, StudyMaterialRepository);
const assignmentController = new AssignmentController(assignmentService);

const assignmentRouter = Router();


assignmentRouter.post('/add', protectRoute(["teacher"]), assignmentController.createAssignment.bind(assignmentController));
assignmentRouter.get('/get-assignments/:subjectId', protectRoute(["teacher"]), assignmentController.getAssignments.bind(assignmentController));
assignmentRouter.get('/get-assignment/:assignmentId', protectRoute(["teacher"]), assignmentController.getAssignmentById.bind(assignmentController));
assignmentRouter.get('/get-submissions/:assignmentId', protectRoute(["teacher"]), assignmentController.getAllAssignmentSubmissions.bind(assignmentController));


assignmentRouter.post('/create/studymaterial', protectRoute(["teacher"]), upload.single("fileMaterial"), assignmentController.createStudyMaterial.bind(assignmentController));
assignmentRouter.get('/get-studymaterials/:subjectId', protectRoute(["teacher"]), assignmentController.fetchStudyMaterials.bind(assignmentController));


export default assignmentRouter