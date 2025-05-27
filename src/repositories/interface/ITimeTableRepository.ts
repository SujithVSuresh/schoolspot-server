import { TimeTableEntityType, DaySchedule } from "../../types/TimeTableType";


export interface ITimeTableRepository {
    createTimeTable(data: TimeTableEntityType): Promise<TimeTableEntityType>
    updateTimeTable(id: string, data: Partial<TimeTableEntityType>): Promise<TimeTableEntityType | null>
    deleteTimeTable(id: string): Promise<boolean>
    upsertTimetable(classId: string, timetableData: DaySchedule[]): Promise<TimeTableEntityType | null>
    findTimeTableByClassId(id: string): Promise<TimeTableEntityType | null>
    findTimeTableById(id: string): Promise<TimeTableEntityType | null>
}