import { ExamResponseDTO } from "./ExamDTO";

export interface CreateExamResultDTO {
    examId: string;
    classId: string;
    subjectId: string;
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
    subjectId: string;
    studentId: string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
  }

    export interface ExamResultWithExamResponseDTO {
    _id: string;
    examId: ExamResponseDTO;
    classId: string;
    subjectId: string;
    studentId: string;
    marksObtained: number;
    totalMarks: number;
    grade?: string;
  }