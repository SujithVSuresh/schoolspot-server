import mongoose from "mongoose";
import { StudentAcademicProfileEntityType, StudentEntityType } from "./StudentType";


export interface AttendanceEntityType {
  _id?: mongoose.Types.ObjectId | string;
  student: mongoose.Types.ObjectId | string;
  class: mongoose.Types.ObjectId | string;
  status?: "Present" | "Absent";
  recordedBy: mongoose.Types.ObjectId | string;
  schoolId: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;  
}


export interface AttendanceWithUserEntityType {
  _id?: mongoose.Types.ObjectId | string;
  student: mongoose.Types.ObjectId | string;
  studentProfile: StudentEntityType;
  academicProfile: StudentAcademicProfileEntityType;
  class: mongoose.Types.ObjectId | string;
  status?: "Present" | "Absent";
  recordedBy: mongoose.Types.ObjectId | string;
  schoolId: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;  
}
