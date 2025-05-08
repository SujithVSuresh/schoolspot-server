import { CreateExamDTO, ExamResponseDTO, ExamWithTimeTableDTO, UpdateExamDTO } from "../../dto/ExamDTO";


export interface IExamService {
    createExam(data: CreateExamDTO): Promise<ExamResponseDTO>
    updateExam(examId: string, data: UpdateExamDTO): Promise<ExamResponseDTO>
    deleteExam(examId: string): Promise<{_id: string}>
    findExamsByClass(classId: string): Promise<ExamResponseDTO[]>
    findExamById(examId: string): Promise<ExamWithTimeTableDTO>
}