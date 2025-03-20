import { CreateAttendanceDTO } from "../../dto/AttendanceDTO"

export interface IAttendanceService{
    addAttendance(dto: CreateAttendanceDTO[], schoolId: string, recordedBy: string): Promise<string>
}

export default IAttendanceService