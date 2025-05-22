import { ExamResultResponseDTO, CreateExamResultDTO, UpdateExamResultDTO, ExamResultWithExamResponseDTO } from "../../dto/ExamResultDTO"


export interface IExamResultService {
    createExamResult(data: CreateExamResultDTO): Promise<ExamResultResponseDTO>
    updateExamResult(id: string, data: UpdateExamResultDTO): Promise<ExamResultResponseDTO>
    deleteExamResult(id: string): Promise<{_id: string}>
    findExamResultsByStudent(examId: string, userId: string): Promise<ExamResultWithExamResponseDTO[]>
}