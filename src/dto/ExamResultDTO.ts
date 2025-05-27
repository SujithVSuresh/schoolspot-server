import { ExamResponseDTO } from "./ExamDTO";

export interface CreateExamResultDTO {
    examId: string;
    classId: string;
    subject: string;
    studentId: string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
  }

  export interface UpdateExamResultDTO {
    marksObtained: number;
    totalMarks: number;
    grade?: string;
  }

  export interface ExamResultResponseDTO {
    _id: string;
    examId: string;
    classId: string;
    subject: string;
    studentId: string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
  }

    export interface ExamResultWithExamResponseDTO {
    _id: string;
    examId: ExamResponseDTO;
    classId: string;
    subject: string;
    studentId: string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
    percentage?: number;
  }

  export interface ExamResultWithStudentResponseDTO {
    _id: string;
    examId: string;
    classId: string;
    subject: string;
    studentId: {
      _id: string;
      userId: string;
      fullName: string
    };
    marksObtained: number;
    totalMarks: number;
    grade?: string;
    percentage?: number;
  }