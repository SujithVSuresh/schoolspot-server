import mongoose from "mongoose";

export interface StudentProfileEntityType {
  _id?: mongoose.Types.ObjectId | string;
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
  userId?: mongoose.Types.ObjectId | string;
  classId?: mongoose.Types.ObjectId | string;
  schoolId?: mongoose.Types.ObjectId | string;
}


export interface StudentProfileUserEntityType extends StudentProfileEntityType {
  user: {
    _id: mongoose.Types.ObjectId | string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  };
}
