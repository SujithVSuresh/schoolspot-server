import { Request, Response, NextFunction } from "express"

export interface ISubscriptionController {
    createPlan(req: Request, res: Response, next: NextFunction): Promise<void>
}