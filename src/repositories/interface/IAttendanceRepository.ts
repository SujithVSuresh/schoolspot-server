import { AttendaceEntityType } from "../../types/types";
import { AttendaceResponseDTO } from "../../dto/AttendanceDTO";

export interface IAttendanceRepository {
    createAttendace(data: AttendaceEntityType[]): Promise<AttendaceEntityType[]>;
    findAttendanceByQuery(query: any): Promise<AttendaceEntityType | null>;
    findManyAttendanceByQuery(query: any): Promise<AttendaceResponseDTO[]> 
    findAttendanceCount(query: any): Promise<{present: number, absent: number, date: Date} | null> 
    updateAttendanceStatus(attendaceId: string, data: AttendaceEntityType): Promise<AttendaceEntityType | null> 
    }