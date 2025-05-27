import { Router } from "express";
import { ExamResultController } from "../controllers/implementation/ExamResultController";
import ExamResultRepository from "../repositories/implementaion/ExamResultRepository";
import { ExamResultService } from "../services/implementation/ExamResultService";
import { protectRoute } from "../middlewares/AuthHandler";

const examResultService = new ExamResultService(ExamResultRepository)

const examResultController = new ExamResultController(examResultService)

const examResultRouter = Router()

examResultRouter.post('/', protectRoute(["admin"]), examResultController.upsertExamResult.bind(examResultController));
examResultRouter.delete('/:id', protectRoute(["admin"]), examResultController.deleteExamResult.bind(examResultController));
examResultRouter.get('/:examId/:userId?', protectRoute(["student", "admin", "teacher"]), examResultController.findExamResultsByStudent.bind(examResultController));
examResultRouter.get('/:examId/subject/:subject', protectRoute(["admin", "teacher"]), examResultController.findExamResultsBySubject.bind(examResultController));


export default examResultRouter