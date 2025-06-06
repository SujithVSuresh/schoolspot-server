import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import AssignmentRepository from "../repositories/implementaion/AssignmentRepository";
import { AssignmentService } from "../services/implementation/AssignmentService";
import { AssignmentController } from "../controllers/implementation/AssignmentController";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import AssignmentSubmissionRepository from "../repositories/implementaion/AssignmentSubmissionRepository";
import StudyMaterialRepository from "../repositories/implementaion/StudyMaterialRepository";
import {fileUpload} from '../middlewares/UploadMiddleware'
import { NotificationService } from "../services/implementation/NotificationService";
import NotificationRepository from "../repositories/implementaion/NotificationRepository";
import UserNotificationRepository from "../repositories/implementaion/UserNotificationRepository";
import StudentAcademicProfileRepository from "../repositories/implementaion/StudentAcademicProfileRepository";

const notificationService = new NotificationService(NotificationRepository, UserNotificationRepository)

const assignmentService = new AssignmentService(AssignmentRepository, StudentRepository, AssignmentSubmissionRepository, StudyMaterialRepository, notificationService, StudentAcademicProfileRepository);
const assignmentController = new AssignmentController(assignmentService);

const assignmentRouter = Router();

assignmentRouter.get('/submission/pending', protectRoute(["student"]), assignmentController.fetchPendingAssignments.bind(assignmentController));
assignmentRouter.put('/update/:assignmentId', protectRoute(["teacher"]), assignmentController.updateAssignment.bind(assignmentController));
assignmentRouter.post('/add', protectRoute(["teacher"]), assignmentController.createAssignment.bind(assignmentController));
assignmentRouter.delete('/:assignmentId', protectRoute(["teacher"]), assignmentController.deleteAssignment.bind(assignmentController));
assignmentRouter.get('/get-assignments/:subjectId', protectRoute(["teacher", "student"]), assignmentController.getAssignments.bind(assignmentController));
assignmentRouter.get('/get-assignment/:assignmentId', protectRoute(["teacher", "student"]), assignmentController.getAssignmentById.bind(assignmentController));
assignmentRouter.get('/get-submissions/:assignmentId', protectRoute(["teacher"]), assignmentController.getAllAssignmentSubmissions.bind(assignmentController));
assignmentRouter.get('/submission/:assignmentId', protectRoute(["teacher", "student"]), assignmentController.getAssignmentSubmission.bind(assignmentController));
assignmentRouter.post('/submission/:submissionId', protectRoute(["student"]), assignmentController.addAssignmentSubmission.bind(assignmentController));
assignmentRouter.get('/submission/id/:submissionId', protectRoute(["teacher"]), assignmentController.getAssignmentSubmissionById.bind(assignmentController));
assignmentRouter.post('/submission/grade/:submissionId', protectRoute(["teacher"]), assignmentController.addMarksToAssignmentSubmission.bind(assignmentController));


assignmentRouter.post('/create/studymaterial', protectRoute(["teacher"]), fileUpload.single("fileMaterial"), assignmentController.createStudyMaterial.bind(assignmentController));
assignmentRouter.put('/studymaterial/:studyMaterialId', protectRoute(["teacher"]), fileUpload.single("fileMaterial"), assignmentController.updateStudyMaterial.bind(assignmentController));
assignmentRouter.delete('/studymaterial/:studyMaterialId', protectRoute(["teacher"]), assignmentController.deleteStudyMaterial.bind(assignmentController));
assignmentRouter.get('/get-studymaterials/:subjectId', protectRoute(["teacher", "student"]), assignmentController.fetchStudyMaterials.bind(assignmentController));
assignmentRouter.get('/get-studymaterial/:id', protectRoute(["teacher", "student"]), assignmentController.fetchStudyMaterialById.bind(assignmentController));
assignmentRouter.post('/studymaterial/viewer/:materialId', protectRoute(["student"]), assignmentController.addStudyMaterialView.bind(assignmentController));


export default assignmentRouter