import mongoose from "mongoose";
import { UserEntityType } from "./types";
import { ClassEntityType } from "./ClassType";


export interface StudentAcademicProfileEntityType {
  _id?: mongoose.Types.ObjectId | string;
  studentId: mongoose.Types.ObjectId | string | StudentEntityType;
  userId: mongoose.Types.ObjectId | string | UserEntityType;
  academicYear: mongoose.Types.ObjectId | string;  
  roll: number;
  classId: mongoose.Types.ObjectId | string | ClassEntityType; 
  createdAt?: Date;
  updatedAt?: Date;
}


export interface StudentEntityType {
  _id?: mongoose.Types.ObjectId | string;
  fullName: string;
  profilePhoto: string;
  gender: "male" | "female";
  dob: Date;
  address: string;
  fatherName: string;
  motherName: string;
  parentContactNumber: string;
  parentEmailAddress: string;
  admissionNo: string;
  userId: mongoose.Types.ObjectId | string | UserEntityType;
  schoolId: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

