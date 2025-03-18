

import { Request, Response,NextFunction } from "express";


export interface IStudentController {
    addStudent(req: Request, res: Response, next: NextFunction): Promise<void>
    getStudents(req: Request, res: Response, next: NextFunction): Promise<void>
    getStudentProfile(req: Request, res: Response, next: NextFunction): Promise<void>
}