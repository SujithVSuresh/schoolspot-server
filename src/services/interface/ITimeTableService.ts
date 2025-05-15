import { CreateTimetableDTO, TimetableResponseDTO, UpdateTimetableDTO } from "../../dto/TimetableDTO"

export interface ITimeTableService {
    createTimetable(data: CreateTimetableDTO): Promise<TimetableResponseDTO>
    updateTimetable(id: string, data:UpdateTimetableDTO): Promise<TimetableResponseDTO>
    deleteTimetable(id: string): Promise<{_id: string}>
    findTimetableByClass(id: string): Promise<TimetableResponseDTO>
}