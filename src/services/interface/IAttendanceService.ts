import { AttendaceResponseDTO, CreateAttendanceDTO } from "../../dto/AttendanceDTO"

export interface IAttendanceService{
    addAttendance(dto: CreateAttendanceDTO[], schoolId: string, recordedBy: string): Promise<string>
    getAttendanceByClass(classId: string, date: string): Promise<any>
    updateAttendanceStatus(attendanceId: string, status: "Present" | "Absent"): Promise<AttendaceResponseDTO> 
    }
export default IAttendanceService