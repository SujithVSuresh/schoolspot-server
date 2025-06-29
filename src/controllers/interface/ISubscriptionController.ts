import { Request, Response, NextFunction } from "express"

export interface ISubscriptionController {
    createPlan(req: Request, res: Response, next: NextFunction): Promise<void>
    updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>
    deletePlan(req: Request, res: Response, next: NextFunction): Promise<void>
    findPlans(req: Request, res: Response, next: NextFunction): Promise<void>
    findPlanById(req: Request, res: Response, next: NextFunction): Promise<void>

    findSubscriptionsBySchoolId(req: Request, res: Response, next: NextFunction): Promise<void>
    createSubscriptionSession(req: Request, res: Response, next: NextFunction): Promise<void>
}