import { Types } from "mongoose";

export interface ChapterEntityType {
  _id?: Types.ObjectId | string;  
  title: string;
  number: number;
  description?: string;
  subject: Types.ObjectId | string;     
  classGrade: Types.ObjectId | string;   
  school: Types.ObjectId | string;      
  createdAt?: Date;
  updatedAt?: Date;
}