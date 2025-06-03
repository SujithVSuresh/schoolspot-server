import mongoose from "mongoose";


export interface ClassEntityType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  section: string;
  teacher: mongoose.Types.ObjectId | string;
  school: mongoose.Types.ObjectId | string;
  academicYear: mongoose.Types.ObjectId | string;  
  strength?: number;
  createdAt?: Date;
  updatedAt?: Date;
}