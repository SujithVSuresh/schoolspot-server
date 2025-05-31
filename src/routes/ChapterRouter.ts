import { Router } from "express";
import { ChapterController } from "../controllers/implementation/ChapterController";
import ChapterRepository from "../repositories/implementaion/ChapterRepository";
import { ChapterService } from "../services/implementation/ChapterService";
import { protectRoute } from "../middlewares/AuthHandler";


const chapterService = new ChapterService(ChapterRepository)

const chapterController = new ChapterController(chapterService)

const chapterRouter = Router()


chapterRouter.get("/subject/:subjectId", protectRoute(["teacher", "student"]), chapterController.fetchChapterBySubject.bind(chapterController))
chapterRouter.post("/", protectRoute(["teacher"]), chapterController.createChapter.bind(chapterController))
chapterRouter.put("/:chapterId", protectRoute(["teacher"]), chapterController.updateChapter.bind(chapterController))
chapterRouter.delete("/:chapterId", protectRoute(["teacher"]), chapterController.deleteChapter.bind(chapterController))
chapterRouter.get("/:chapterId", protectRoute(["teacher"]), chapterController.findChapterById.bind(chapterController))


export default chapterRouter
