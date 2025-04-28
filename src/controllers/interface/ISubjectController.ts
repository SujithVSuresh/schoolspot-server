import { Request, Response,NextFunction } from "express";


export interface ISubjectController {
    createSubject(req: Request, res: Response, next: NextFunction): Promise<void>
    findSubjectsByClass(req: Request, res: Response, next: NextFunction): Promise<void>
    updateSubject(req: Request, res: Response, next: NextFunction): Promise<void>
    findSubjectById(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteSubject(req: Request, res: Response, next: NextFunction): Promise<void>
}