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
  }8


  export interface ExamResultEntityType {
    _id?: mongoose.Types.ObjectId | string;
    examId: mongoose.Types.ObjectId | string | ExamEntityType;
    classId: mongoose.Types.ObjectId | string;
    subjectId: mongoose.Types.ObjectId | string;
    studentId: mongoose.Types.ObjectId | string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

