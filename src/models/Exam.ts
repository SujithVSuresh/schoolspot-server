import mongoose from "mongoose";
import { ExamEntityType } from "../types/ExamType";


const ExamSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    classId: {
        type: mongoose.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    examTimetable: [
      {
        subject: {
          type: String,
          required: true,
          trim: true,
        },
        date: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
          trim: true,
        },
        endTime: {
          type: String, 
          required: true,
          trim: true,
        }
      },
    ],
  },
  {
    timestamps: true,
  });
  
export default mongoose.model<ExamEntityType>('Exam', ExamSchema, "Exams")
