import mongoose from "mongoose";
import { StudentAcademicProfileType } from "../types/StudentType";

const StudentAcademicProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentBaseProfile",
      required: true
    },
    academicYear: { type: String, required: true },
    class: { type: String, required: true },
    roll: { type: Number, required: true },
    section: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Class"
    }
  },
  { timestamps: true }
);

const StudentAcademicProfile = mongoose.model<StudentAcademicProfileType>("StudentAcademicProfile", StudentAcademicProfileSchema, "StudentAcademicProfiles");

export default StudentAcademicProfile;
