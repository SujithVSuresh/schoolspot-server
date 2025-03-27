import mongoose from "mongoose";
import { StudentProfileType } from "../types/types";

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
         type: String, 
         required: true 
    },
    class: {
         type: String, 
         required: true 
        },
    roll: {
        type: Number,
        required: true
    },
    section: { 
        type: String, 
        required: true 
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Class"
    },
    profilePhoto: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ["male", "female"], 
        required: true 
    },
    dob: { 
        type: Date, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    fatherName: { 
        type: String, 
        required: true 
    },
    motherName: { 
        type: String, 
        required: true 
    },
    contactNumber: { 
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

const StudentProfile = mongoose.model<StudentProfileType>("Student", StudentSchema, "Students");

export default StudentProfile;
