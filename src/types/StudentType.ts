import mongoose from "mongoose";


export interface StudentAcademicProfileType {
  _id?: mongoose.Types.ObjectId | string;
  studentId: mongoose.Types.ObjectId | string;
  academicYear: string;  
  class: string;
  roll: number;
  section: string;
  classId: mongoose.Types.ObjectId | string;  
  createdAt?: Date;
  updatedAt?: Date;
}


// export interface StudentProfileEntityType {
//   _id?: mongoose.Types.ObjectId | string;
//   fullName: string;
//   class: string;
//   roll: number
//   section: string;
//   profilePhoto: string;
//   gender: "male" | "female";
//   dob: Date;
//   address: string;
//   fatherName: string;
//   motherName: string;
//   contactNumber: string;
//   userId?: mongoose.Types.ObjectId | string;
//   classId?: mongoose.Types.ObjectId | string;
//   schoolId?: mongoose.Types.ObjectId | string;
// }


// export interface StudentProfileUserEntityType extends StudentProfileEntityType {
//   user: {
//     _id: mongoose.Types.ObjectId | string;
//     email: string;
//     status: "active" | "inactive" | "deleted" | "blocked";
//   };
// }


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
  userId: mongoose.Types.ObjectId | string;
  schoolId: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

