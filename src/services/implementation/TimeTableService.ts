import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateTimetableDTO, TimetableResponseDTO, UpdateTimetableDTO } from "../../dto/TimetableDTO";
import { ITimeTableRepository } from "../../repositories/interface/ITimeTableRepository";
import { CustomError } from "../../utils/CustomError";
import { ITimeTableService } from "../interface/ITimeTableService";



export class TimeTableService implements ITimeTableService {
    constructor(
        _timetableRepository: ITimeTableRepository
    ){}

    async createTimetable(data: CreateTimetableDTO): Promise<TimetableResponseDTO> {
        const response = await this.createTimetable(data)
        
        return {
            _id: response._id,
            classId: response.classId,
            timetable: response.timetable
        }
    }

    async updateTimetable(id: string, data: UpdateTimetableDTO): Promise<TimetableResponseDTO> {
        const response = await this.updateTimetable(id, data)

        if(!response){
            throw new CustomError(Messages.TIMETABLE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: response._id,
            classId: response.classId,
            timetable: response.timetable
        }
    }

    async deleteTimetable(id: string): Promise<{ _id: string; }> {
        const response = await this.deleteTimetable(id)

        if(!response){
            throw new CustomError(Messages.TIMETABLE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: id
        }
    }

    async findTimetable(id: string): Promise<TimetableResponseDTO> {
        const response = await this.findTimetable(id)

        if(!response){
            throw new CustomError(Messages.TIMETABLE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(response._id),
            classId: String(response.classId),
            timetable: response.timetable
        }
    }
}