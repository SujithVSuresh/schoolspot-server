import { NextFunction, Request, Response } from "express";


export interface IExamResultController {
    upsertExamResult(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteExamResult(req: Request, res: Response, next: NextFunction): Promise<void>
    findExamResultsByStudent(req: Request, res: Response, next: NextFunction): Promise<void>
    findExamResultsBySubject(req: Request, res: Response, next: NextFunction): Promise<void>

}