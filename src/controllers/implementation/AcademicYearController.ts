import { Request, Response, NextFunction } from "express";
import { IAcademicYearService } from "../../services/interface/IAcademicYearService";
import { IAcademicYearController } from "../interface/IAcademicYearController";
import { CustomRequest } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";
import { CreateAcademicYearDTO } from "../../dto/AcademicYearDTO";

export class AcademicYearController implements IAcademicYearController {
  constructor(private _academicYearService: IAcademicYearService) {}

  async findAcademicYearsBySchool(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const schoolId = req.user?.schoolId;

      const response = await this._academicYearService.findAcademicYearsBySchool(schoolId as string)

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async createAcademicYear(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
         try {
      const schoolId = req.user?.schoolId;

      const academicYear: CreateAcademicYearDTO = {
        name: req.body.name,
        isActive: false,
        schoolId: schoolId as string
      }

      const response = await this._academicYearService.createAcademicYear(academicYear)

      res.status(HttpStatus.CREATED).json(response);
    } catch (err) {
      next(err);
    } 
  }


  async updateAcademicYearStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const schoolId = req.user?.schoolId;

      const {id} = req.params

      const response = await this._academicYearService.updateAcademicYearStatus(id, schoolId as string)

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    } 
  }



}
