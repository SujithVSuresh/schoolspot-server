import { CreateTimetableDTO, TimetableResponseDTO, UpdateTimetableDTO } from "../../dto/TimetableDTO"

export interface ITimeTableService {
    upsertTimetable(data: CreateTimetableDTO): Promise<TimetableResponseDTO>
    deleteTimetable(id: string): Promise<{_id: string}>
    findTimetableByClass(id: string): Promise<TimetableResponseDTO>
}