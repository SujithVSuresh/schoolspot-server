import { Request, Response, NextFunction } from "express";
import IAttendanceService from "../../services/interface/IAttendanceService";
import { IAttendanceController } from "../interface/IAttendanceController";
import { CustomRequest, PayloadType } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";

export class AttendanceController implements IAttendanceController {
  constructor(private _attendanceService: IAttendanceService) {}

  async addAttendance(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId, userId } = req.user as PayloadType;
      const { data } = req.body;

      const response = await this._attendanceService.addAttendance(
        data,
        schoolId,
        userId
      );

      res.status(HttpStatus.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }

  async findAttendanceByClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { classId, date } = req.query;
      const response = await this._attendanceService.getAttendanceByClass(
        classId as string,
        date as string
      );
      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async updateAttendanceStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { attendanceId, status } = req.body;
      const response = await this._attendanceService.updateAttendanceStatus(
        attendanceId,
        status
      );
      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
