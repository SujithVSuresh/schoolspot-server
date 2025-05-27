import { CreateExamResultDTO, ExamResultWithStudentResponseDTO, ExamResultWithExamResponseDTO } from "../../dto/ExamResultDTO"


export interface IExamResultService {
    upsertExamResult(data: CreateExamResultDTO[]): Promise<{inserted: number, updated: number}>
    deleteExamResult(id: string): Promise<{_id: string}>
    findExamResultsByStudent(examId: string, userId: string): Promise<ExamResultWithExamResponseDTO[]>
    findExamResultsBySubject(examId: string, subject: string): Promise<ExamResultWithStudentResponseDTO[]>
}