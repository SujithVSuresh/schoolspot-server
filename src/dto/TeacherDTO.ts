import mongoose from "mongoose";


export interface TeacherBySchoolResponseDTO {
  fullName: string;
  userId?: mongoose.Types.ObjectId;
}


export interface TeacherProfileResponseDTO {
  _id: string;
  fullName: string;
  phoneNumber: string;
  subjectSpecialized: string;
  qualification: string;
  experience: string;
  profilePhoto: string;
  schoolId?: string;
  user: {
    _id: string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  }
}


export interface TeacherListResponseDTO {
  _id: string;
  fullName: string;
  phoneNumber: string;
  subjectSpecialized: string;
  qualification: string;
  experience: string;
  profilePhoto: string;
  schoolId?: string;
  user: {
    _id: string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  }
}


export interface UpdateTeacherDTO {
  fullName: string;
  phoneNumber: string;
  subjectSpecialized: string;
  qualification: string;
  experience: string;
  profilePhoto?: string;
  email: string;
}