import { Response, NextFunction } from "express";
import { IPlanService } from "../../services/interface/IPlanService";
import { CustomRequest } from "../../types/types";
import { IPlanController } from "../interface/IPlanController";
import HttpStatus from "../../constants/StatusConstants";



export class PlanController implements IPlanController {
    constructor(
      private _planService: IPlanService
    ){}

    async findAllPlans(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
        const plans = await this._planService.findAllPlans()

        res.status(HttpStatus.OK).json(plans)
        
        }catch(err){
            next(err)
        }
    }
}

