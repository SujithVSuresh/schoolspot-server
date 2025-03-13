import mongoose from "mongoose";
import { TeacherProfileType } from "../types/types";

const TeacherSchema = new mongoose.Schema(
  {
    fullName: {
         type: String, 
         required: true 
    },
    phoneNumber: {
         type: String, 
         required: true 
        },
    subjectSpecialized: { 
        type: String, 
        required: true 
    },
    qualification: { 
        type: String, 
        required: true 
    },
    experience: { 
        type: String, 
        required: true 
    },
    profilePhoto: { 
        type: String, 
        required: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
    }
  },
  { timestamps: true }
);

const TeacherProfile = mongoose.model<TeacherProfileType>("Teacher", TeacherSchema, "Teachers");

export default TeacherProfile;