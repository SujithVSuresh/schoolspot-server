import mongoose from "mongoose";
import { Request } from "express";
import { StudentProfileEntityType } from "./StudentType";
import { SchoolProfileEntityType } from "./SchoolProfileType";

export interface BaseUser {
  email: string;
  role: "superadmin" | "admin" | "teacher" | "student";
  status: "active" | "inactive" | "deleted" | "blocked";
  schoolId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  authProvider?: "google" | "email"
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


export interface PayloadType {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
  schoolId: string;
  subscribed?: boolean;
}

export interface CustomRequest extends Request {
  user?: PayloadType;
  academicYear?: string;
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




export interface TeacherProfileType {
  _id?: mongoose.Types.ObjectId;
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


export interface TeacherProfileUserEntityType extends TeacherProfileType {
  user: {
    _id: mongoose.Types.ObjectId;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  }
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

// ----------



export interface AnnouncementEntityType {
  _id?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  author: mongoose.Types.ObjectId | string;
  sendTo: mongoose.Types.ObjectId[]
  schoolId: mongoose.Types.ObjectId;
  pinned?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}



export interface AdminProfileEntityType {
    _id?: mongoose.Types.ObjectId | string
    fullName: string;
    phoneNumber: string;
    userId: mongoose.Types.ObjectId | string;
    schoolId?: mongoose.Types.ObjectId | string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AdminProfileUserEntityType {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
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


export interface AssignmentEntityType {
  _id?: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  link?: string;
  teacherId: mongoose.Types.ObjectId | string;
  classId: mongoose.Types.ObjectId | string;
  subjectId: mongoose.Types.ObjectId | string;
  schoolId: mongoose.Types.ObjectId | string;
  submissionType: "file" | "link" | "text";
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}



export interface AssignmentSubmissionEntityType {
  _id?: mongoose.Types.ObjectId | string;
  assignmentId: mongoose.Types.ObjectId | string | AssignmentEntityType;
  studentId: mongoose.Types.ObjectId | string;
  schoolId: mongoose.Types.ObjectId | string;
  description?: string;
  link?: string;
  fileUrl?: string;
  grade?: string;
  feedback?: string;
  status: "Pending" | "Submitted" | "Graded";
  createdAt?: Date;
  updatedAt?: Date;
  submittedAt?: Date | null
}


export interface AssignmentSubmissionStudentEntityType extends AssignmentSubmissionEntityType {
  student: {
    _id: string;
    fullName: string;
    class: string;
    section: string;
    roll: number;
  };
};

export type MaterialViewers = {
  _id: mongoose.Types.ObjectId | string;
  fullName: string
}

export interface StudyMaterialEntityType {
  _id?: mongoose.Types.ObjectId | string;
  teacherId: mongoose.Types.ObjectId | string;
  classId: mongoose.Types.ObjectId | string;
  subjectId: mongoose.Types.ObjectId | string;
  schoolId: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  link?: string;
  fileUrl?: string;
  viewers?: MaterialViewers[];
  updatedAt?: Date;
  createdAt?: Date
}



export interface SubjectWithClassEntityType {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  teacher: mongoose.Types.ObjectId | string;
  class: ClassEntityType;
  school: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}



export interface LeaveLetterEntityType {
  _id?: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId | string;
  classId: mongoose.Types.ObjectId | string;
  schoolId: mongoose.Types.ObjectId | string; 
  reason: string;
  fromDate: Date;
  toDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}



// -----------------------------------


export interface FeeBreakdownItemType {
  feeType: string;
  amount: number;
}

export interface InvoiceEntityType {
  _id?: mongoose.Types.ObjectId | string;
  title: string;
  student: mongoose.Types.ObjectId | string;
  class: mongoose.Types.ObjectId | string;
  school: mongoose.Types.ObjectId | string;
  invoiceNumber: string;
  dueDate: Date;
  feeBreakdown?: FeeBreakdownItemType[];
  totalAmount: number;
  status: 'Unpaid' | 'Paid';
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface InvoiceWithUserEntityType {
  _id?: mongoose.Types.ObjectId | string;
  title: string;
  student: StudentProfileEntityType;
  class: mongoose.Types.ObjectId | string;
  school: mongoose.Types.ObjectId | string;
  invoiceNumber: string;
  dueDate: Date;
  feeBreakdown?: FeeBreakdownItemType[];
  totalAmount: number;
  status: 'Unpaid' | 'Paid';
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface InvoiceDetailsEntityType {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  student: mongoose.Types.ObjectId | string;
  class: ClassEntityType
  school: SchoolProfileEntityType
  invoiceNumber: string;
  dueDate: Date;
  feeBreakdown: FeeBreakdownItemType[]
  totalAmount: number;
  status: 'Unpaid' | 'Paid'; 
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
  studentProfile: StudentProfileEntityType;
  user: UserEntityType;
}


// -----------------------------------------

export interface PaymentEntityType {
  _id?: mongoose.Types.ObjectId | string; 
  user: mongoose.Types.ObjectId | string; 
  paymentFor: 'Invoice' | 'Subscription';
  relatedId: mongoose.Types.ObjectId | string; 
  amountPaid: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Online' | 'Bank Transfer';
  transactionId?: string; 
  paymentDate?: Date;
  status?: 'Success' | 'Failed' | 'Pending';
  createdAt?: Date;
  updatedAt?: Date;
}