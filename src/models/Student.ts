import mongoose from "mongoose";
import { StudentEntityType } from "../types/StudentType";

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
         type: String, 
         required: true 
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
    parentContactNumber: { 
        type: String, 
        required: true
    },
    parentEmailAddress: { 
        type: String, 
        required: true
    },
    admissionNo: {
        type: String,
        requried: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    }
  },
  { timestamps: true }
);

const Student = mongoose.model<StudentEntityType>("Student", StudentSchema, "Students");

export default Student;
