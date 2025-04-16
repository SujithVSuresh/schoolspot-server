import { Router } from "express";
import { SubjectController } from "../controllers/implementation/SubjectController";
import SubjectRepository from "../repositories/implementaion/SubjectRepository";
import { SubjectService } from "../services/implementation/SubjectService";
import { protectRoute } from "../middlewares/AuthHandler";



const subjectService = new SubjectService(SubjectRepository);

const subjectController = new SubjectController(subjectService);

const subjectRouter = Router();

subjectRouter.post('/', protectRoute(["admin"]), subjectController.createSubject.bind(subjectController));
subjectRouter.put('/:subjectId', protectRoute(["admin"]), subjectController.updateSubject.bind(subjectController));
subjectRouter.get('/subjects/:classId', protectRoute(["admin", "teacher", "student"]), subjectController.findSubjectsByClass.bind(subjectController));



export default subjectRouter;

