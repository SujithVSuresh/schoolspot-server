import mongoose from "mongoose";
import { SubjectEntityType } from "../types/types";
import { SubjectResponseDTO } from "./SubjectDTO";


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

export type attendanceCount = {
      presentCount: number;
      absentCount: number;
      date: Date;
}

export interface ClassByIdResponseDTO extends ClassResponseDTO {
      attendance?: attendanceCount;
      subject?: SubjectResponseDTO;
      school: string;
}


export interface ClassListResponseDTO {
      _id?: string;
      name: string;
      section: string;
      strength?: number;
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
      _id?: string;
      title: string;
      content: string;
      author: mongoose.Types.ObjectId | string; 
      createdAt?: Date;
      updatedAt?: Date;
}