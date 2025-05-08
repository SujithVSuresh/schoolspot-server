import { TimeTableEntityType } from "../../types/TimeTableType";


export interface ITimeTableRepository {
    createTimeTable(data: TimeTableEntityType): Promise<TimeTableEntityType>
    updateTimeTable(id: string, data: Partial<TimeTableEntityType>): Promise<TimeTableEntityType | null>
    deleteTimeTable(id: string): Promise<boolean>
    findTimeTableById(id: string): Promise<TimeTableEntityType | null>
}