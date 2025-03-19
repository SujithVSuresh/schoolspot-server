import mongoose from "mongoose";


export interface TeacherBySchoolResponseDTO {
  fullName: string;
  userId?: mongoose.Types.ObjectId;
}
