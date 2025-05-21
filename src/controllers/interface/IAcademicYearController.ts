import { NextFunction, Request, Response } from "express";


export interface IAcademicYearController {
    findAcademicYearsBySchool(req: Request, res: Response, next: NextFunction): Promise<void>
    createAcademicYear(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAcademicYearStatus(req: Request, res: Response, next: NextFunction): Promise<void>
}