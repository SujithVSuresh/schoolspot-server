import { Request, Response, NextFunction } from "express";
import { IExamService } from "../../services/interface/IExamService";
import { IExamController } from "../interface/IExamController";
import { CreateExamDTO, ExamTimetableDTO, UpdateExamDTO } from "../../dto/ExamDTO";
import HttpStatus from "../../constants/StatusConstants";


export class ExamController implements IExamController {
    constructor(
        private _examService: IExamService
    ){}

    async createExam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body
            const examData: CreateExamDTO = {
                name: data.name,
                classId: data.classId,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                examTimetable: data.examTimetable.map((timetable: ExamTimetableDTO) => {
                    return {
                        subject: timetable.subject,
                        date: timetable.date,
                        startTime: timetable.startTime,
                        endTime: timetable.endTime
                    }
                })
            }
            const response = await this._examService.createExam(examData)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async updateExam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {examId} = req.params

            const data = req.body

            const examData: UpdateExamDTO = {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                examTimetable: data.examTimetable.map((timetable: ExamTimetableDTO) => {
                    return {
                        subject: timetable.subject,
                        date: timetable.date,
                        startTime: timetable.startTime,
                        endTime: timetable.endTime
                    }
                })
            }

            const response = await this._examService.updateExam(examId, examData)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async deleteExam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {examId} = req.params

            const response = await this._examService.deleteExam(examId)

            res.status(HttpStatus.OK).json(response)
            
        }catch(err){
            next(err)
        }
    }

    async findExamsByClass(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {classId} = req.params

            const response = await this._examService.findExamsByClass(classId)

            res.status(HttpStatus.OK).json(response)
            
        }catch(err){
            next(err)
        }
    }

    async findExamById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {examId} = req.params

            const response = await this._examService.findExamById(examId)

            res.status(HttpStatus.OK).json(response)
            
        }catch(err){
            next(err)
        }
    }
}