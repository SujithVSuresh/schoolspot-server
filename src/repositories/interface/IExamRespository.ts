import { ExamEntityType } from "../../types/ExamType";


export interface IExamRepository {
    createExam(data: ExamEntityType): Promise<ExamEntityType>
    updateExam(examId: string, data: Partial<ExamEntityType>): Promise<ExamEntityType | null>
    deleteExam(examId: string): Promise<boolean>
    findExamsByClass(classId: string): Promise<ExamEntityType[]>
    findExamById(examId: string): Promise<ExamEntityType | null>
}