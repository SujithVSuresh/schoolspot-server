import { Request, Response,NextFunction } from "express";


export interface IAttendanceController {
    addAttendance(req: Request, res: Response, next: NextFunction): Promise<void>
    findAttendanceByClass(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAttendanceStatus(req: Request, res: Response, next: NextFunction): Promise<vo>
}