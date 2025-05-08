import mongoose from "mongoose";

interface ExamTimetableEntry {
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
  }
  
  export interface ExamEntityType {
    _id?: string;
    name: string;
    classId: mongoose.Types.ObjectId | string;
    description?: string;
    startDate: Date;
    endDate: Date;
    examTimetable: ExamTimetableEntry[];
    createdAt?: Date;
    updatedAt?: Date;
  }