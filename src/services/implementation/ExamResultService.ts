import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateExamResultDTO, ExamResultResponseDTO, ExamResultWithExamResponseDTO, ExamResultWithStudentResponseDTO, UpdateExamResultDTO } from "../../dto/ExamResultDTO";
import { IExamResultRepository } from "../../repositories/interface/IExamResultRepository";
import { ExamEntityType, ExamResultEntityType } from "../../types/ExamType";
import { CustomError } from "../../utils/CustomError";
import { IExamResultService } from "../interface/IExamResultService";



export class ExamResultService implements IExamResultService {
    constructor(
       private _examResultRepository: IExamResultRepository
    ){}

    async upsertExamResult(data: CreateExamResultDTO[]): Promise<{inserted: number, updated: number}> {
        const response = await this._examResultRepository.upsertExamResult(data)
        return {
            inserted: response.upsertedCount,
            updated: response.modifiedCount
        };

    }

    async deleteExamResult(id: string): Promise<{ _id: string; }> {
        const response = await this._examResultRepository.deleteExamResult(id)

        if(!response){
            throw new CustomError(Messages.EXAMRESULT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: id
        }
    }

    async findExamResultsByStudent(examId: string, userId: string): Promise<ExamResultWithExamResponseDTO[]> {
        const response = await this._examResultRepository.findExamResultsByStudent(examId, userId)

        const examResults: ExamResultWithExamResponseDTO[] = response.map((item: ExamResultEntityType) => {

            const exam = item.examId as ExamEntityType;

            return {
                _id: String(item._id),
                examId: {
                    _id: String(exam._id),
                    name: exam.name,
                    description: exam.description,
                    startDate: exam.startDate,
                    endDate: exam.endDate
                } ,
                classId: String(item.classId),
                subject: item.subject,
                studentId: String(item.studentId),
                marksObtained: item.marksObtained,
                totalMarks: item.totalMarks,
                grade: item.grade
            }
        })

        return examResults
    }


    async findExamResultsBySubject(examId: string, subject: string): Promise<ExamResultWithStudentResponseDTO[]> {
        console.log(examId, subject, "vavava123")
        const response = await this._examResultRepository.findExamResultsBySubjects(examId, subject)

         const examResults: ExamResultWithStudentResponseDTO[] = response.map((item: ExamResultEntityType) => {

            const student = item.studentId as {
                _id: string;
                userId: string;
                fullName: string
            };

            return {
                _id: String(item._id),
                examId: String(item.examId),
                classId: String(item.classId),
                subject: item.subject,
                studentId: {
                    _id: student._id,
                    userId: student.userId,
                    fullName: student.fullName
                },
                marksObtained: item.marksObtained,
                totalMarks: item.totalMarks,
                grade: item.grade
            }
        })

        return examResults
    }

}