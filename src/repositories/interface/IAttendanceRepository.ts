import { AttendanceEntityType, AttendanceWithUserEntityType } from "../../types/AttendanceType";


export interface IAttendanceRepository {
    createAttendace(data: AttendanceEntityType[]): Promise<AttendanceEntityType[]>;
    findAttendanceByQuery(query: any): Promise<AttendanceEntityType | null>;
    findAttendances(query: any): Promise<AttendanceWithUserEntityType[]> 
    findAttendanceCount(query: any): Promise<{present: number, absent: number, date: Date} | null> 
    updateAttendanceStatus(attendaceId: string, data: AttendanceEntityType): Promise<AttendanceEntityType | null> 
    }