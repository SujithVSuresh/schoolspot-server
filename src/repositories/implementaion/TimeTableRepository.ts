import TimeTable from "../../models/TimeTable";
import { TimeTableEntityType } from "../../types/TimeTableType";
import { ITimeTableRepository } from "../interface/ITimeTableRepository";
import { BaseRepository } from "./BaseRepository";



class TimeTableRepository extends BaseRepository<TimeTableEntityType> implements ITimeTableRepository {
    constructor(){
        super(TimeTable)
    }

    async createTimeTable(data: TimeTableEntityType): Promise<TimeTableEntityType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating timetable", error);
            throw new Error("Error creating timetable")
        }
    }

    async updateTimeTable(id: string, data: Partial<TimeTableEntityType>): Promise<TimeTableEntityType | null> {
        try{
            return await this.update(id, data)
        }catch(error){
            console.error("Error updating timetable", error);
            throw new Error("Error updating timetable")
        }
    }

    async deleteTimeTable(id: string): Promise<boolean> {
        try{
            return await this.delete(id)
        }catch(error){
            console.error("Error deleting timetable", error);
            throw new Error("Error deleting timetable")
        }
    }

    async findTimeTableById(id: string): Promise<TimeTableEntityType | null> {
        try{
            return await this.findById(id)
        }catch(error){
            console.error("Error deleting timetable", error);
            throw new Error("Error deleting timetable")
        }
    }
}

export default new TimeTableRepository()