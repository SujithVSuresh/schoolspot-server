import { ISchoolController } from "../interface/ISchoolController";
import { ISchoolService } from "../../services/interface/ISchoolService";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest } from "../../types/types";

export class SchoolController implements ISchoolController {
  constructor(private _schoolService: ISchoolService) {}

  async getSchool(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
      try{
        console.log(req.user, "this is the school req user...")
        const schoolId = req.user?.schoolId;

        const school = await this._schoolService.getSchool(schoolId as string)

        res.status(HttpStatus.OK).json(school)

      }catch(err){
        next(err)
      }
  }

}