import { ExamResultEntityType } from "../../types/ExamType";



export interface IExamResultRepository {
    createExamResult(data: ExamResultEntityType): Promise<ExamResultEntityType>
    updateExamResult(id: string, data: Partial<ExamResultEntityType>): Promise<ExamResultEntityType | null>
    deleteExamResult(id: string): Promise<boolean>
}