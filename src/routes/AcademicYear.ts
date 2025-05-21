import { Router } from "express";
import { AcademicYearController } from "../controllers/implementation/AcademicYearController";
import AcademicYearRepository from "../repositories/implementaion/AcademicYearRepository";
import { AcademicYearService } from "../services/implementation/AcademicYearService";
import { protectRoute } from "../middlewares/AuthHandler";

const academicYearService = new AcademicYearService(AcademicYearRepository)

const academicYearController = new AcademicYearController(academicYearService)

const academicYearRouter = Router()

academicYearRouter.get("/", protectRoute(['admin']), academicYearController.findAcademicYearsBySchool.bind(academicYearController));
academicYearRouter.post("/", protectRoute(['admin']), academicYearController.createAcademicYear.bind(academicYearController));
academicYearRouter.patch("/:id", protectRoute(['admin']), academicYearController.updateAcademicYearStatus.bind(academicYearController));


export default academicYearRouter