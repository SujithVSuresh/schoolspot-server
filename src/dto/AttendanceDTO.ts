import mongoose from "mongoose";


export interface CreateAttendanceDTO {
    student: mongoose.Schema.Types.ObjectId | string;
    class: mongoose.Schema.Types.ObjectId | string;
    status: "Present" | "Absent";
    recordedBy: mongoose.Schema.Types.ObjectId | string;
    schoolId: mongoose.Schema.Types.ObjectId | string;
}

export interface AttendaceResponseDTO {
  _id?: mongoose.Types.ObjectId;
  student?: {
    _id: mongoose.Types.ObjectId;
    name: string;
    roll: number;
  }
  status: "Present" | "Absent";
  createdAt?: Date;
  updatedAt?: Date;  
}


export interface CreateLeaveLetterDTO {
  studentId: string;
  classId: string;
  schoolId: string;
  reason: string;
  fromDate: Date;
  toDate: Date;
  status: "pending" | "approved" | "rejected";
}

export interface EditLeaveLetterDTO {
  reason: string;
  fromDate: Date;
  toDate: Date;
}


export interface LeaveLetterResponseDTO {
  _id: string
  reason: string;
  fromDate: Date;
  toDate: Date;
  status: "pending" | "approved" | "rejected";
  studentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

