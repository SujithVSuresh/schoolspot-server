import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateExamResultDTO, ExamResultResponseDTO, ExamResultWithExamResponseDTO, UpdateExamResultDTO } from "../../dto/ExamResultDTO";
import { IExamResultRepository } from "../../repositories/interface/IExamResultRepository";
import { ExamEntityType, ExamResultEntityType } from "../../types/ExamType";
import { CustomError } from "../../utils/CustomError";
import { IExamResultService } from "../interface/IExamResultService";



export class ExamResultService implements IExamResultService {
    constructor(
       private _examResultRepository: IExamResultRepository
    ){}

    async createExamResult(data: CreateExamResultDTO): Promise<ExamResultResponseDTO> {
        const response = await this._examResultRepository.createExamResult(data)

        return {
            _id: String(response._id),
            classId: String(response.classId),
            examId: String(response.examId),
            studentId: String(response.studentId),
            subject: String(response.subject),
            marksObtained: response.marksObtained,
            totalMarks: response.totalMarks,
            grade: response?.grade ?? ""
        }
    }

    async updateExamResult(id: string, data: UpdateExamResultDTO): Promise<ExamResultResponseDTO> {
        const response = await this._examResultRepository.updateExamResult(id, data)

        if(!response){
            throw new CustomError(Messages.EXAMRESULT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(response._id),
            classId: String(response.classId),
            examId: String(response.examId),
            studentId: String(response.studentId),
            subject: response.subject,
            marksObtained: response.marksObtained,
            totalMarks: response.totalMarks,
            grade: response?.grade ?? ""
        }
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

}