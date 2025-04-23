import { AttendaceResponseDTO, CreateAttendanceDTO, CreateLeaveLetterDTO, LeaveLetterResponseDTO } from "../../dto/AttendanceDTO"

export interface IAttendanceService{
    addAttendance(dto: CreateAttendanceDTO[], schoolId: string, recordedBy: string): Promise<{classId: string, presentCount: number, absentCount: number}>
    getAttendanceByClass(classId: string, date: string): Promise<any>
    updateAttendanceStatus(attendanceId: string, status: "Present" | "Absent"): Promise<AttendaceResponseDTO> 
    getAttendanceByMonth(studentId: string, date: string): Promise<AttendaceResponseDTO[]> 

    createLeaveLetter(dto: CreateLeaveLetterDTO): Promise<LeaveLetterResponseDTO>
    getLeaveLetterByMonth(userId: string, date: string): Promise<LeaveLetterResponseDTO[]>
}
export default IAttendanceService