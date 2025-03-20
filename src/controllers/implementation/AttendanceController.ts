import { Request, Response, NextFunction } from "express";
import IAttendanceService from "../../services/interface/IAttendanceService";
import { IAttendanceController } from "../interface/AttendanceController";
import { CustomRequest, PayloadType } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";



export class AttendanceController implements IAttendanceController{
    constructor(private _attendanceService: IAttendanceService){}

    async addAttendance(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
      try{
        const {schoolId, userId} = req.user as PayloadType
        const {data} = req.body


        const response = await this._attendanceService.addAttendance(data, schoolId, userId)

        res.status(HttpStatus.CREATED).json(response)


      }catch(err){
            next(err)
        }
    }
}