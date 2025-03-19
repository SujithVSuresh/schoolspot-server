import { Request, Response,NextFunction } from "express";


export interface ITeacherController {
    addTeacher(req: Request, res: Response, next: NextFunction): Promise<void>
    getTeachers(req: Request, res: Response, next: NextFunction): Promise<void>
    getTeacherBySchool(req: Request, res: Response, next: NextFunction): Promise<void>
}