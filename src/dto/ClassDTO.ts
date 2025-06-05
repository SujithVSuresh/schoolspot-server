import mongoose from "mongoose";
import { SubjectResponseDTO } from "./SubjectDTO";
import { SubjectEntityType } from "../types/SubjectType";


export interface CreateClassDTO {
      name: string;
      section: string;
      teacher: string;
      school: string;
      academicYear: string;
}

export interface UpdateClassDTO {
      name: string;
      section: string;
      teacher: string;
      schoolId: string;
}

export interface ClassResponseDTO {
      _id?: string;
      name: string;
      section: string;
      subjects?: SubjectEntityType[] | [];
      teacher?: string;
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
      author: string; 
      sendTo?: mongoose.Types.ObjectId[] | string[]
      createdAt?: Date;
      updatedAt?: Date;
}


export interface AnnouncementDetailsResponseDTO extends AnnouncementResponseDTO {
      isPinned: boolean
}