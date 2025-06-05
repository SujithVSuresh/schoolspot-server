import mongoose from "mongoose";
import { StudentAcademicProfileEntityType } from "../types/StudentType";

const StudentAcademicProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roll: { type: Number, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
  },
  { timestamps: true }
);

const StudentAcademicProfile = mongoose.model<StudentAcademicProfileEntityType>(
  "StudentAcademicProfile",
  StudentAcademicProfileSchema,
  "StudentAcademicProfiles"
);

export default StudentAcademicProfile;
