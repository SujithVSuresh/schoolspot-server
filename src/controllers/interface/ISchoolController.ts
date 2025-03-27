import { Request, Response, NextFunction } from "express";


export interface ISchoolController {
    getSchool(req: Request, res: Response, next: NextFunction): Promise<void>
}