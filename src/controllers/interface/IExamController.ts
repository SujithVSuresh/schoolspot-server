import { NextFunction, Request, Response } from "express";


export interface IExamController {
    createExam(req: Request, res: Response, next: NextFunction): Promise<void>
    updateExam(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteExam(req: Request, res: Response, next: NextFunction): Promise<void>
    findExamsByClass(req: Request, res: Response, next: NextFunction): Promise<void>
    findExamById(req: Request, res: Response, next: NextFunction): Promise<void>
}