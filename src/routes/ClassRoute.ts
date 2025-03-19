import { Router } from "express";
import { protectRoute } from "../middlewares/AuthHandler";
import { ClassService } from "../services/implementation/ClassService";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import { ClassController } from "../controllers/implementation/ClassController";

const classService = new ClassService(ClassRepository);

const classController = new ClassController(classService);

const classRouter = Router();


classRouter.post("/add-class", protectRoute("admin"), classController.createClass.bind(classController));
classRouter.get('/get-classes', protectRoute("admin"), classController.findAllClasses.bind(classController));

export default classRouter;