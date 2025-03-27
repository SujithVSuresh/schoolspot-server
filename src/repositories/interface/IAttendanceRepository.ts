import { AttendaceEntityType } from "../../types/types";
import { AttendaceResponseDTO } from "../../dto/AttendanceDTO";

export interface IAttendanceRepository {
    createAttendace(data: AttendaceEntityType[]): Promise<string>;
    findAttendanceByQuery(query: any): Promise<AttendaceEntityType | null>;
    findManyAttendanceByQuery(query: any): Promise<AttendaceResponseDTO[]> 
    updateAttendanceStatus(attendaceId: string, data: AttendaceEntityType): Promise<AttendaceEntityType | null> 
    }