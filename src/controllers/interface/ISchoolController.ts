import { Request, Response, NextFunction } from "express";


export interface ISchoolController {
    getSchool(req: Request, res: Response, next: NextFunction): Promise<void>
    editSchoolProfile(req: Request, res: Response, next: NextFunction): Promise<void>
    getSchoolOverview(req: Request, res: Response, next: NextFunction): Promise<void>
    findSchools(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchSchoolProfileDetails(req: Request, res: Response, next: NextFunction): Promise<void>
}