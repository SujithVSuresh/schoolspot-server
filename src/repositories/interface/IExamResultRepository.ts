import { ExamResultEntityType } from "../../types/ExamType";



export interface IExamResultRepository {
    upsertExamResult(data: ExamResultEntityType[]): Promise<any>
    deleteExamResult(id: string): Promise<boolean>
    findExamResultsByStudent(examId: string, userId: string): Promise<ExamResultEntityType[]>
    findExamResultsBySubjects(examId: string, subject: string): Promise<ExamResultEntityType[]>
}