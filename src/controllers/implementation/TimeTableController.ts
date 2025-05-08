import { Request, Response, NextFunction, response } from "express";
import { ITimeTableService } from "../../services/interface/ITimeTableService";
import { ITimeTableController } from "../interface/ITimeTableController";
import { CreateTimetableDTO, UpdateTimetableDTO } from "../../dto/TimetableDTO";
import HttpStatus from "../../constants/StatusConstants";



export class TimeTableController implements ITimeTableController {
    constructor(
       private _timetableService: ITimeTableService
    ){}

    async createTimetable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body

            const timetableData: CreateTimetableDTO = {
                classId: data.classId,
                timetable: data.timetable
            }
    
            const response = await this._timetableService.createTimetable(timetableData)
    
            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }

    }

    async updateTimetable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body

            const {id} = req.params

            const timetableData: UpdateTimetableDTO = {
                classId: data.classId,
                timetable: data.timetable
            } 

            const response = await this._timetableService.updateTimetable(id, timetableData)

            res.status(HttpStatus.NOT_FOUND).json(response)

        }catch(err){
            next(err)
        }
    }

    async deleteTimetable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {id} = req.params

            const response = await this._timetableService.deleteTimetable(id)

            res.status(HttpStatus.NOT_FOUND).json(response)

        }catch(err){
            next(err)
        }
    }

    async findTimetable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {id} = req.params

            const response = await this._timetableService.findTimetable(id)

            res.status(HttpStatus.OK).json(response)

        }catch(err){
           next(err) 
        }
    }
}

