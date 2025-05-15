import { NextFunction, Request, Response } from "express";


export interface ITimeTableController {
    createTimetable(req: Request, res: Response, next: NextFunction): Promise<void>
    updateTimetable(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteTimetable(req: Request, res: Response, next: NextFunction): Promise<void>
    findTimetableByClass(req: Request, res: Response, next: NextFunction): Promise<void>
}