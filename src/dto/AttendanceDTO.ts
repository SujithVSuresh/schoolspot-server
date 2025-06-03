import mongoose from "mongoose";


export interface CreateAttendanceDTO {
    student: string;
    class: string;
    status: "Present" | "Absent";
    recordedBy: string;
    schoolId: string;
    academicYear: string
}

export interface AttendaceResponseDTO {
  _id?: string;
  student?: {
    _id: string;
    name: string;
    roll: number;
  }
  status: "Present" | "Absent";
  createdAt?: Date;
  updatedAt?: Date;  
}


export interface AttendanceWithUserResponseDTO {
  _id?: string;
  student: string;
  studentProfile: {
    _id: string;
    fullName: string;
    profilePhoto: string;
  };
  academicProfile: {
    _id: string;
    roll: number
  };
  class: string;
  status?: "Present" | "Absent";
  recordedBy: string;
  schoolId: string;
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

