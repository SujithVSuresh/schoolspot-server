import mongoose from "mongoose";
import { ExamResultEntityType } from "../types/ExamType";

const ExamResultSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    classId: {
      type: mongoose.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
    },
  },
  {
    timestamps: true,
});


export default mongoose.model<ExamResultEntityType>('ExamResult', ExamResultSchema, 'ExamResults')