import mongoose from "mongoose";
import { SubjectEntityType } from "../types/types";


export interface CreateClassDTO {
      name: string;
      section: string;
      strength: number
      teacher: mongoose.Types.ObjectId;
      school: mongoose.Types.ObjectId;
}

export interface ClassResponseDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      section: string;
      subjects?: SubjectEntityType[] | [];
      teacher?: mongoose.Types.ObjectId | string;
      strength?: number;
      createdAt?: Date;
}

// ---------------

export interface SubjectDTO {
      _id?: mongoose.Types.ObjectId;
      name: string;
      teacher: mongoose.Types.ObjectId | string;
}


// ---------------

export interface AnnouncementDTO {
      title: string;
      content: string;
      author: mongoose.Types.ObjectId;
      sendTo: mongoose.Types.ObjectId[];
      schoolId: mongoose.Types.ObjectId;
}



export interface AnnouncementResponseDTO {
      _id?: mongoose.Types.ObjectId;
      title: string;
      content: string;
      author: mongoose.Types.ObjectId | string; 
      creartedAt?: Date;
      updatedAt?: Date;
}