import { Request, Response, NextFunction } from "express";
import IAttendanceService from "../../services/interface/IAttendanceService";
import { IAttendanceController } from "../interface/IAttendanceController";
import { CustomRequest, PayloadType } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";
import { CreateLeaveLetterDTO, EditLeaveLetterDTO } from "../../dto/AttendanceDTO";

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

  async getAttendanceByMonth(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.user as PayloadType;
      const {date} = req.query;
      const response = await this._attendanceService.getAttendanceByMonth(
        userId,
        date as string
      );
      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async getAttendanceOverview(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, schoolId } = req.user as PayloadType;
      const response = await this._attendanceService.getAttendanceOverview(
        userId,
        schoolId
      );
      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }


  async createLeaveLetter(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, schoolId } = req.user as PayloadType;

      const leaveLetterData: CreateLeaveLetterDTO = {
        reason: req.body.reason,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        classId: req.body.classId,
        studentId: userId,
        schoolId: schoolId,
        status: "pending"
      }

      const response = await this._attendanceService.createLeaveLetter(
        leaveLetterData
      );

      res.status(HttpStatus.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }

  async editLeaveLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {id} = req.params

    const leaveLetter: EditLeaveLetterDTO = {
      reason: req.body.reason,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate
    }

    const response = await this._attendanceService.editLeaveLetter(id, leaveLetter)

    res.status(HttpStatus.OK).json(response)
  }

  async deleteLeaveLetter(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {id} = req.params

    const response = await this._attendanceService.deleteleaveLetter(id)

    res.status(HttpStatus.OK).json(response)
  }

  async getLeaveLetterByMonth(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId } = req.user as PayloadType;
      const {date} = req.query;

      console.log(date, "dadaadda")

      const response = await this._attendanceService.getLeaveLetterByMonth(userId, date as string)

      res.status(HttpStatus.OK).json(response);


    }catch(err){
      next(err)
    }
  }
}
