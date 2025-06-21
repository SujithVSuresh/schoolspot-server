import { CreateStudentAcademicProfileDTO, StudentAcademicProfileResponseDTO, StudentAcademicProfileWithClassResponseDTO, StudentAcademicProfileWithProfileResponseDTO } from "../../dto/StudentDTO";



export interface IStudentAcademicProfileService {
    createAcademicProfile(data: CreateStudentAcademicProfileDTO, admissionNo: string, schoolId: string): Promise<StudentAcademicProfileResponseDTO>
    fetchStudentProfileByUserId(userId: string): Promise<StudentAcademicProfileWithClassResponseDTO>
    fetchAcademicProfilesByClassId(classId: string): Promise<StudentAcademicProfileWithProfileResponseDTO[]>
}