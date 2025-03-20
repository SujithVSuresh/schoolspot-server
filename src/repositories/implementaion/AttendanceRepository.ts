import { AnnouncementEntityType, AttendaceEntityType } from "../../types/types";
import { BaseRepository } from "./BaseRepository";
import { IAttendanceRepository } from "../interface/IAttendanceRepository";
import Attendance from "../../models/Attendance";




class AttendanceRepository extends BaseRepository<AttendaceEntityType> implements IAttendanceRepository {
    constructor(){
        super(Attendance)
    }

    async createAttendace(data: AttendaceEntityType[]): Promise<string> {
        try {
            const response = await Attendance.insertMany(data);

            return String(response[0].class);
          } catch (error) {
            console.error("Error adding attendance", error);
            throw new Error("Error adding attendance");
          }
    }

    async findAttendanceByQuery(query: any): Promise<AttendaceEntityType | null> {
        try {
            const response = await Attendance.findOne(query);
            return response;
          } catch (error) {
            console.error("Error finding attendance", error);
            throw new Error("Error finding attendance");
          }
    }
}

export default new AttendanceRepository()