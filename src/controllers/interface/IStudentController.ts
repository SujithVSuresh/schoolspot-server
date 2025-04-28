

import { Request, Response,NextFunction } from "express";


export interface IStudentController {
    addStudent(req: Request, res: Response, next: NextFunction): Promise<void>
    updateStudent(req: Request, res: Response, next: NextFunction): Promise<void>
    getStudents(req: Request, res: Response, next: NextFunction): Promise<void>
    getStudentProfile(req: Request, res: Response, next: NextFunction): Promise<void>
    getStudentByQuery(req: Request, res: Response, next: NextFunction): Promise<void>
    getStudentsByClassId(req: Request, res: Response, next: NextFunction): Promise<void>
}




