import mongoose from "mongoose";
import { Request } from "express";

export interface BaseUser {
  email: string;
  role: "superadmin" | "admin" | "teacher" | "student";
  status: "active" | "inactive" | "deleted" | "blocked";
  schoolId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserType extends BaseUser {
  _id?: mongoose.Types.ObjectId;
  password?: string;
}

export interface UserResponseType extends BaseUser {
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface BaseAdminProfileType {
  fullName?: string;
  phoneNumber?: string;
  role?: "principal" | "it_admin" | "vice_principal" | "other";
  userId: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminProfileType extends BaseAdminProfileType {
  _id?: mongoose.Types.ObjectId;
}

export interface AdminProfileResponseType extends BaseAdminProfileType {
  _id?: string;
}

export interface PayloadType {
  userId: string;
  role: string;
  iat: number;
  exp?: number;
  schoolId: string;
}

export interface CustomRequest extends Request {
  user?: PayloadType;
}

export interface StudentProfileType {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  class?: string;
  section?: string;
  classId?: mongoose.Types.ObjectId;
  profilePhoto?: string;
  gender: "male" | "female";
  dob: Date;
  roll: number;
  address: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  schoolId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
}

export interface StudentUserProfileType extends StudentProfileType {
  email: string;
  password?: string;
}

export interface GetParamsType {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  classfilter?: string[] | [];
  sortOrder?: "asc" | "desc";
  status?: "active" | "inactive" | "deleted" | "blocked" | "";
}

export interface GetTeacherParamsType {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: "active" | "inactive" | "deleted" | "blocked" | "";
}

export interface StudentDataResponseType {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  class: string;
  section: string;
  classId: mongoose.Types.ObjectId;
  roll: number;
  profilePhoto: string;
  schoolId?: mongoose.Types.ObjectId;
  user: {
    _id: mongoose.Types.ObjectId;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  };
}

export interface GetStudentsResponseType {
  totalStudents: number;
  totalPages: number;
  currentPage: number;
  students: StudentDataResponseType[];
}

export interface SchoolProfileBaseType {
  _id?: mongoose.Types.ObjectId;
  schoolName: string;
  email?: string;
  phoneNumber: string;
  regNumber: string;
  yearEstablished: number;
  principalName: string;
  websiteUrl: string;
  totalStudents: number;
  totalTeachers: number;
  board: string;
}

export interface SchoolProfileType extends SchoolProfileBaseType {
  address: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface SchoolProfileReqType extends SchoolProfileBaseType {
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface TeacherProfileType {
  fullName: string;
  phoneNumber: string;
  subjectSpecialized: string;
  qualification: string;
  experience: string;
  profilePhoto?: string;
  userId?: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeacherUserProfileType extends TeacherProfileType {
  email: string;
  password?: string;
}

export interface TeacherDataResponseType {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  subjectSpecialized: string;
  qualification: string;
  profilePhoto: string;
  schoolId?: mongoose.Types.ObjectId;
  user: {
    _id: mongoose.Types.ObjectId;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  };
}

export interface GetTeacherResponseType {
  totalTeachers: number;
  totalPages: number;
  currentPage: number;
  teachers: TeacherDataResponseType[];
}



// ---------------

export interface UserEntityType {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "teacher" | "student";
  status: "active" | "inactive" | "deleted" | "blocked";
  schoolId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentProfileEntityType {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  class: string;
  roll: number
  section: string;
  profilePhoto: string;
  gender: "male" | "female";
  dob: Date;
  address: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  schoolId?: mongoose.Types.ObjectId;
}

export type SubjectEntityType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  teacher: mongoose.Types.ObjectId | string;
};

export interface ClassEntityType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  section: string;
  teacher: mongoose.Types.ObjectId | string;
  school: mongoose.Types.ObjectId;
  strength?: number;
  subjects?: SubjectEntityType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentProfileUserEntityType extends StudentProfileEntityType {
  user: UserEntityType
}

export interface AnnouncementEntityType {
  _id?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  author: mongoose.Types.ObjectId | string;
  sendTo: mongoose.Types.ObjectId[]
  schoolId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttendaceEntityType {
  _id?: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  status: "Present" | "Absent";
  schoolId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;  
}


export interface AdminProfileUserEntityType {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  role: "principal" | "it_admin" | "vice_principal" | "other";
  userId?: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  user: {
    _id?: mongoose.Types.ObjectId;
    email: string;
    role: "superadmin" | "admin" | "teacher" | "student";
    status: "active" | "inactive" | "deleted" | "blocked";
    schoolId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  } 
}



