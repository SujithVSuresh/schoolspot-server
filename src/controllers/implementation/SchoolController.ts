import { ISchoolController } from "../interface/ISchoolController";
import { ISchoolService } from "../../services/interface/ISchoolService";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest } from "../../types/types";
import { SchoolProfileDTO } from "../../dto/SchoolDTO";

export class SchoolController implements ISchoolController {
  constructor(private _schoolService: ISchoolService) {}

  async getSchool(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
      try{
        const schoolId = req.user?.schoolId;

        const school = await this._schoolService.getSchool(schoolId as string)

        res.status(HttpStatus.OK).json(school)

      }catch(err){
        next(err)
      }
  }

  async editSchoolProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
      try{

        const schoolId = req.params.schoolId

                const schoolData: SchoolProfileDTO = {
                    schoolName: req.body.schoolName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    regNumber: req.body.regNumber,
                    yearEstablished: req.body.yearEstablished,
                    principalName: req.body.principalName,
                    websiteUrl: req.body.websiteUrl,
                    totalStudents: req.body.totalStudents,
                    totalTeachers: req.body.totalTeachers,
                    board: req.body.board,
                    address: {
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country,
                        postalCode: req.body.postalCode
                    }
                }

            

                const response = await this._schoolService.editSchoolProfile(schoolId, schoolData)

                res.status(HttpStatus.OK).json(response)
      }catch(err){
        next(err)
      }
  }

}