import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateExamDTO, ExamResponseDTO, ExamWithTimeTableDTO, UpdateExamDTO } from "../../dto/ExamDTO";
import { IExamRepository } from "../../repositories/interface/IExamRespository";
import { CustomError } from "../../utils/CustomError";
import { IExamService } from "../interface/IExamService";


export class ExamService implements IExamService {
    constructor(
      private _examRepository: IExamRepository
    ){}

    async createExam(data: CreateExamDTO): Promise<ExamResponseDTO> {
        const response = await this._examRepository.createExam(data)

        return {
            _id: String(response._id),
            name: response.name,
            description: response.description,
            startDate: response.startDate,
            endDate: response.endDate
        }
    }

    async updateExam(examId: string, data: UpdateExamDTO): Promise<ExamResponseDTO> {
        const response = await this._examRepository.updateExam(examId, data)

        if(!response){
            throw new CustomError(Messages.EXAM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(response._id),
            name: response.name,
            description: response.description,
            startDate: response.startDate, 
            endDate: response.endDate
        }
    }

    async deleteExam(examId: string): Promise<{ _id: string; }> {
        const response = await this._examRepository.deleteExam(examId)

        if(!response){
            throw new CustomError(Messages.EXAM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: examId
        }
    }

    async findExamsByClass(classId: string): Promise<ExamResponseDTO[]> {
        const response = await this._examRepository.findExamsByClass(classId)

        const exams: ExamResponseDTO[] = response.map((exam) => {
            return {
                _id: String(exam._id),
                name: exam.name,
                description: exam.description,
                startDate: exam.startDate,
                endDate: exam.endDate
            }
        })

        return exams
    }

    async findExamById(examId: string): Promise<ExamWithTimeTableDTO> {
        const response = await this._examRepository.findExamById(examId)

        if(!response){
            throw new CustomError(Messages.EXAM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(response._id),
            name: response.name,
            description: response.description,
            startDate: response.startDate,
            endDate: response.endDate,
            examTimetable: response.examTimetable
        }
    }
}