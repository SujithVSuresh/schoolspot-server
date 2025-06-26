import { AttendaceResponseDTO, AttendanceWithUserResponseDTO, CreateAttendanceDTO, CreateLeaveLetterDTO, EditLeaveLetterDTO, LeaveLetterResponseDTO } from "../../dto/AttendanceDTO"

export interface IAttendanceService{
    addAttendance(dto: CreateAttendanceDTO[], schoolId: string, recordedBy: string): Promise<{classId: string, presentCount: number, absentCount: number}>
    getAttendanceByClass(classId: string, date: string, academicYear: string): Promise<AttendanceWithUserResponseDTO[]>
    updateAttendanceStatus(attendanceId: string, status: "Present" | "Absent"): Promise<AttendaceResponseDTO> 
    getAttendanceByMonth(studentId: string, date: string, classId: string): Promise<AttendaceResponseDTO[]> 
    getAttendanceOverview(studentId: string, classId: string): Promise<any>
    
    createLeaveLetter(dto: CreateLeaveLetterDTO): Promise<LeaveLetterResponseDTO>
    editLeaveLetter(id: string, dto: EditLeaveLetterDTO): Promise<LeaveLetterResponseDTO>
    deleteleaveLetter(id: string): Promise<{_id: string}>
    getLeaveLetterByMonth(userId: string, date: string): Promise<LeaveLetterResponseDTO[]>
}
export default IAttendanceService