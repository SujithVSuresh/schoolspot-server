import mongoose from "mongoose";
import {
  CreateAttendanceDTO,
  CreateLeaveLetterDTO,
  EditLeaveLetterDTO,
  LeaveLetterResponseDTO,
} from "../../dto/AttendanceDTO";
import { IAttendanceRepository } from "../../repositories/interface/IAttendanceRepository";
import { AttendaceEntityType } from "../../types/types";
import IAttendanceService from "../interface/IAttendanceService";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { AttendaceResponseDTO } from "../../dto/AttendanceDTO";
import { generateMonthRange } from "../../utils/DateFormatter";
import { ILeaveLetterRepository } from "../../repositories/interface/ILeaveLetterRepository";
import { INotificationService } from "../interface/INotificationService";

export class AttendanceService implements IAttendanceService {
  constructor(
    private _attendanceRepository: IAttendanceRepository,
    private _leaveLetterRepository: ILeaveLetterRepository,
    private _notificationService: INotificationService
  ) {}

  async addAttendance(
    dto: CreateAttendanceDTO[],
    schoolId: string,
    recordedBy: string
  ): Promise<{ classId: string; presentCount: number; absentCount: number }> {
    const today = new Date().toISOString().split("T")[0];
    const attendanceExist =
      await this._attendanceRepository.findAttendanceByQuery({
        class: new mongoose.Types.ObjectId(dto[0].class as string),
        createdAt: {
          $gte: new Date(today + "T00:00:00.000Z"),
          $lt: new Date(today + "T23:59:59.999Z"),
        },
      });

    if (attendanceExist) {
      throw new CustomError(
        Messages.ATTENDANCE_ALREADY_EXIST,
        HttpStatus.CONFLICT
      );
    }
    const attendanceData: AttendaceEntityType[] = dto.map((data) => {
      return {
        ...data,
        student: new mongoose.Types.ObjectId(data.student as string),
        class: new mongoose.Types.ObjectId(data.class as string),
        recordedBy: new mongoose.Types.ObjectId(recordedBy),
        schoolId: new mongoose.Types.ObjectId(schoolId),
      };
    });

    const response = await this._attendanceRepository.createAttendace(
      attendanceData
    );

    const absentStudents = response
      .filter((item) => item.status == "Absent")
      .map((item) => String(item.student));

    if (absentStudents.length > 0) {
      await this._notificationService.sendNotification({
        userId: absentStudents,
        notificationType: "attendance",
        message: "Absent",
      });
    }

    const presentStudents = response
      .filter((item) => item.status == "Present")
      .map((item) => String(item.student));
      
    if (presentStudents.length > 0) {
      await this._notificationService.sendNotification({
        userId: presentStudents,
        notificationType: "attendance",
        message: "Present",
      });
    }

    // const attendanceCount = response.reduce(
    //   (acc, curr) => {
    //     if (curr.status == "Present") {
    //       acc.presentCount += 1;
    //     } else if (curr.status == "Absent") {
    //       acc.absentCount += 1;
    //     }

    //     return acc;
    //   },
    //   { presentCount: 0, absentCount: 0 }
    // );

    return {
      presentCount: presentStudents.length,
      absentCount: absentStudents.length,
      classId: String(response[0].class),
    };
  }

  async getAttendanceByClass(classId: string, date: string): Promise<any> {
    return await this._attendanceRepository.findAttendances({
      class: new mongoose.Types.ObjectId(classId),
      createdAt: {
        $gte: new Date(date + "T00:00:00.000Z"),
        $lt: new Date(date + "T23:59:59.999Z"),
      },
    });
  }

  async updateAttendanceStatus(
    attendanceId: string,
    status: "Present" | "Absent"
  ): Promise<AttendaceResponseDTO> {
    const attendanceExist =
      await this._attendanceRepository.findAttendanceByQuery({
        _id: new mongoose.Types.ObjectId(attendanceId),
      });

    if (!attendanceExist) {
      throw new CustomError(
        Messages.ATTENDANCE_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const response = await this._attendanceRepository.updateAttendanceStatus(
      attendanceId,
      {
        class: attendanceExist.class,
        schoolId: attendanceExist.schoolId,
        status: status,
        student: attendanceExist.student,
      }
    );

    if (!response) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      _id: response._id,
      status: response.status,
    };
  }

  async getAttendanceByMonth(
    userId: string,
    date: string
  ): Promise<AttendaceResponseDTO[]> {
    const { startOfMonth, endOfMonth } = generateMonthRange(new Date(date));

    const attendanceData = await this._attendanceRepository.findAttendances({
      student: new mongoose.Types.ObjectId(userId),
      createdAt: {
        $gt: startOfMonth,
        $lte: endOfMonth,
      },
    });

    if (!attendanceData) {
      throw new CustomError(
        Messages.ATTENDANCE_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return attendanceData.map((data) => ({
      _id: data._id,
      status: data.status,
      createdAt: data.createdAt,
    }));
  }

  async createLeaveLetter(
    dto: CreateLeaveLetterDTO
  ): Promise<LeaveLetterResponseDTO> {
    const leaveLetter = await this._leaveLetterRepository.createLeaveLetter(
      dto
    );
    if (!leaveLetter) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      _id: String(leaveLetter._id),
      reason: leaveLetter.reason,
      fromDate: leaveLetter.fromDate,
      toDate: leaveLetter.toDate,
      createdAt: leaveLetter.createdAt,
      status: leaveLetter.status,
    };
  }

  async editLeaveLetter(
    id: string,
    dto: EditLeaveLetterDTO
  ): Promise<LeaveLetterResponseDTO> {
    const leaveLetter = await this._leaveLetterRepository.editLeaveLetter(
      id,
      dto
    );

    if (!leaveLetter) {
      throw new CustomError(
        Messages.LEAVELETTER_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      _id: String(leaveLetter._id),
      reason: leaveLetter.reason,
      fromDate: leaveLetter.fromDate,
      toDate: leaveLetter.toDate,
      status: leaveLetter.status,
      createdAt: leaveLetter.createdAt,
      updatedAt: leaveLetter.updatedAt,
      studentId: String(leaveLetter.studentId),
    };
  }

  async deleteleaveLetter(id: string): Promise<{ _id: string }> {
    const leaveLetter = await this._leaveLetterRepository.deleteLeaveLetter(id);

    if (!leaveLetter) {
      throw new CustomError(
        Messages.LEAVELETTER_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      _id: id,
    };
  }

  async getLeaveLetterByMonth(
    userId: string,
    date: string
  ): Promise<LeaveLetterResponseDTO[]> {
    const { startOfMonth, endOfMonth } = generateMonthRange(new Date(date));

    const attendanceData = await this._leaveLetterRepository.findLeaveLetters({
      studentId: new mongoose.Types.ObjectId(userId),
      createdAt: {
        $gt: startOfMonth,
        $lte: endOfMonth,
      },
    });

    const attendance: LeaveLetterResponseDTO[] = attendanceData.map((data) => {
      return {
        _id: String(data._id),
        reason: data.reason,
        fromDate: data.fromDate,
        toDate: data.toDate,
        createdAt: data.createdAt,
        status: data.status,
      };
    });

    return attendance;
  }
}
