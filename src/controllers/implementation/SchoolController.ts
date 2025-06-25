import { ISchoolController } from "../interface/ISchoolController";
import { ISchoolService } from "../../services/interface/ISchoolService";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest } from "../../types/types";
import { SchoolProfileResponseDTO } from "../../dto/SchoolDTO";

export class SchoolController implements ISchoolController {
  constructor(private _schoolService: ISchoolService) {}

  async getSchool(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const schoolId = req.user?.schoolId;

      const school = await this._schoolService.getSchool(schoolId as string);

      res.status(HttpStatus.OK).json(school);
    } catch (err) {
      next(err);
    }
  }

  async editSchoolProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const schoolId = req.params.schoolId;

      const schoolData: SchoolProfileResponseDTO = {
        schoolName: req.body.schoolName,
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
          postalCode: req.body.postalCode,
        },
      };

      const response = await this._schoolService.editSchoolProfile(
        schoolId,
        schoolData
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getSchoolOverview(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const schoolId = req.user?.schoolId;

      const overview = await this._schoolService.getSchoolOverview(
        schoolId as string
      );

      res.status(HttpStatus.OK).json(overview);
    } catch (err) {
      next(err);
    }
  }

  async findSchools(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const schools = await this._schoolService.findSchools();

      res.status(HttpStatus.OK).json(schools);
    } catch (err) {
      next(err);
    }
  }

  async fetchSchoolProfileDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId } = req.params;
      const schoolProfile = await this._schoolService.fetchSchoolProfileDetails(
        schoolId
      );

      res.status(HttpStatus.OK).json(schoolProfile);
    } catch (err) {
      next(err);
    }
  }
}
