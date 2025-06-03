import { CreateStudentAcademicProfileDTO, StudentAcademicProfileResponseDTO, StudentAcademicProfileWithClassResponseDTO, StudentAcademicProfileWithProfileResponseDTO } from "../../dto/StudentDTO";



export interface IStudentAcademicProfileService {
    createAcademicProfile(data: CreateStudentAcademicProfileDTO, admissionNo: string, schoolId: string): Promise<StudentAcademicProfileResponseDTO>
    fetchStudentProfileByUserId(userId: string, academicYear: string): Promise<StudentAcademicProfileWithClassResponseDTO>
    fetchAcademicProfilesByClassId(classId: string, academicYear: string): Promise<StudentAcademicProfileWithProfileResponseDTO[]>
}