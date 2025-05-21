import mongoose from "mongoose";


export interface AcademicYearEntityType {
  _id?: mongoose.Types.ObjectId | string;     
  schoolId: mongoose.Types.ObjectId | string; 
  name: "2023-24" | "2024-25" | "2025-26";  
  isActive: boolean;        
  createdAt?: Date;     
  updatedAt?: Date;
}