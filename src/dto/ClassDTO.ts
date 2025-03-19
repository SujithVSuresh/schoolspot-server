import mongoose from "mongoose";


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
      strength?: number;
      createdAt?: Date;
}