import mongoose from "mongoose";

export interface SubjectEntityType {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  teacher: mongoose.Types.ObjectId | string;
  class: mongoose.Types.ObjectId | string;
  school: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}