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
            subjectId: String(response.subjectId),
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
            subjectId: String(response.subjectId),
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

}