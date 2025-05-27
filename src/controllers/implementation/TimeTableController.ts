import { Request, Response, NextFunction, response } from "express";
import { ITimeTableService } from "../../services/interface/ITimeTableService";
import { ITimeTableController } from "../interface/ITimeTableController";
import { CreateTimetableDTO, UpdateTimetableDTO } from "../../dto/TimetableDTO";
import HttpStatus from "../../constants/StatusConstants";



export class TimeTableController implements ITimeTableController {
    constructor(
       private _timetableService: ITimeTableService
    ){}

    async upsertTimetable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body

            const { classId } = req.params

            const timetableData: CreateTimetableDTO = {
                classId: classId,
                timetable: data.timetable
            }
    
            const response = await this._timetableService.upsertTimetable(timetableData)
    
            res.status(HttpStatus.OK).json(response)
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

    async findTimetableByClass(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {classId} = req.params

            const response = await this._timetableService.findTimetableByClass(classId)

            res.status(HttpStatus.OK).json(response)

        }catch(err){
           next(err) 
        }
    }
}

