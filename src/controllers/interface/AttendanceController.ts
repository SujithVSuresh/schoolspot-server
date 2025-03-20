import { Request, Response,NextFunction } from "express";


export interface IAttendanceController {
    addAttendance(req: Request, res: Response, next: NextFunction): Promise<void>
}