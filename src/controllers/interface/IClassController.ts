import { Request, Response,NextFunction } from "express";


export interface IClassController {
    createClass(req: Request, res: Response, next: NextFunction): Promise<void>
    findAllClasses(req: Request, res: Response, next: NextFunction): Promise<void>
    findClassById(req: Request, res: Response, next: NextFunction): Promise<void>
    addSubject(req: Request, res: Response, next: NextFunction): Promise<void>
    removeSubject(req: Request, res: Response, next: NextFunction): Promise<void>
}