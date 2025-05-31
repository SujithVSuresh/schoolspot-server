import { Request, Response, NextFunction } from "express"
import { CustomRequest } from "../../types/types"

export interface IPlanController {
    findAllPlans(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}