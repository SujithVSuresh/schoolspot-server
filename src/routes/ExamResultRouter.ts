import { Router } from "express";
import { ExamResultController } from "../controllers/implementation/ExamResultController";
import ExamResultRepository from "../repositories/implementaion/ExamResultRepository";
import { ExamResultService } from "../services/implementation/ExamResultService";
import { protectRoute } from "../middlewares/AuthHandler";

const examResultService = new ExamResultService(ExamResultRepository)

const examResultController = new ExamResultController(examResultService)

const examResultRouter = Router()

examResultRouter.post('/', protectRoute(["admin"]), examResultController.createExamResult.bind(examResultController));
examResultRouter.put('/:id', protectRoute(["admin"]), examResultController.updateExamResult.bind(examResultController));
examResultRouter.delete('/:id', protectRoute(["admin"]), examResultController.deleteExamResult.bind(examResultController));



export default examResultRouter