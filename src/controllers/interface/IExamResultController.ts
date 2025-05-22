import { NextFunction, Request, Response } from "express";


export interface IExamResultController {
    createExamResult(req: Request, res: Response, next: NextFunction): Promise<void>
    updateExamResult(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteExamResult(req: Request, res: Response, next: NextFunction): Promise<void>
    findExamResultsByStudent(req: Request, res: Response, next: NextFunction): Promise<void>
}