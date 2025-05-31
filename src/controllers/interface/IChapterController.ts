import { Request, Response, NextFunction } from "express"


export interface IChapterController {
    createChapter(req: Request, res: Response, next: NextFunction): Promise<void>
    updateChapter(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteChapter(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchChapterBySubject(req: Request, res: Response, next: NextFunction): Promise<void>
    findChapterById(req: Request, res: Response, next: NextFunction): Promise<void>
}