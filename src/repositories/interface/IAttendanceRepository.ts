import { AttendaceEntityType } from "../../types/types";

export interface IAttendanceRepository {
    createAttendace(data: AttendaceEntityType[]): Promise<string>;
    findAttendanceByQuery(query: any): Promise<AttendaceEntityType | null>;
}