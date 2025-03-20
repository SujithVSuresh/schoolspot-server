import mongoose from "mongoose";
import { CreateAttendanceDTO } from "../../dto/AttendanceDTO";
import { IAttendanceRepository } from "../../repositories/interface/IAttendanceRepository";
import { AttendaceEntityType } from "../../types/types";
import IAttendanceService from "../interface/IAttendanceService";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";


export class AttendanceService implements IAttendanceService {
  constructor(
    private _attendanceRepository: IAttendanceRepository
  ) {}

  async addAttendance(dto: CreateAttendanceDTO[], schoolId: string, recordedBy: string): Promise<string> {
    const today = new Date().toISOString().split("T")[0]
    const attendanceExist = await this._attendanceRepository.findAttendanceByQuery({class: new mongoose.Types.ObjectId(dto[0].class as string), createdAt: {
        $gte: new Date(today + "T00:00:00.000Z"),
        $lt: new Date(today + "T23:59:59.999Z")
    }})

    console.log(attendanceExist, "attendance exist...")

    if(attendanceExist){
        throw new CustomError(Messages.ATTENDANCE_ALREADY_EXIST, HttpStatus.CONFLICT)
    }
      const attendanceData: AttendaceEntityType[] = dto.map((data) => {
        return {
            ...data,
            student: new mongoose.Types.ObjectId(data.student as string),
            class: new mongoose.Types.ObjectId(data.class as string),
            recordedBy: new mongoose.Types.ObjectId(recordedBy),
            schoolId: new mongoose.Types.ObjectId(schoolId)
        }
      })

      const response = await this._attendanceRepository.createAttendace(attendanceData)

      return  response
  }
}