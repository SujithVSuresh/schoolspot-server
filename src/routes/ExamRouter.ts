import { ExamService } from "../services/implementation/ExamService";
import ExamRepository from "../repositories/implementaion/ExamRepository";
import { ExamController } from "../controllers/implementation/ExamController";
import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";

const examService = new ExamService(ExamRepository)

const examController = new ExamController(examService)

const examRouter = Router()

examRouter.post('/', protectRoute(["admin"]), examController.createExam.bind(examController));
examRouter.put('/:examId', protectRoute(["admin"]), examController.updateExam.bind(examController));
examRouter.delete('/:examId', protectRoute(["admin"]), examController.deleteExam.bind(examController));
examRouter.get('/:examId', protectRoute(["admin"]), examController.findExamById.bind(examController));
examRouter.get('exams/:classId', protectRoute(["admin"]), examController.findExamsByClass.bind(examController));


export default examRouter