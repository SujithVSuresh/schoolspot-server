import { NextFunction, Request, Response } from "express"

export interface IAssignmentController {
    createAssignment(req: Request, res: Response, next: NextFunction): Promise<void>
    getAssignments(req: Request, res: Response, next: NextFunction): Promise<void>
    getAssignmentById(req: Request, res: Response, next: NextFunction): Promise<void>
}