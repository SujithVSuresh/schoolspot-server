import { Request, Response, NextFunction } from "express"

export interface ISubscriptionController {
    createPlan(req: Request, res: Response, next: NextFunction): Promise<void>
    updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>
    deletePlan(req: Request, res: Response, next: NextFunction): Promise<void>
    findPlans(req: Request, res: Response, next: NextFunction): Promise<void>
}