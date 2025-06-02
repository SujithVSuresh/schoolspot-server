import { CreateStudentAcademicProfileDTO, StudentAcademicProfileResponseDTO, StudentProfileResponseDTO } from "../../dto/StudentDTO";



export interface IStudentAcademicProfileService {
    createAcademicProfile(data: CreateStudentAcademicProfileDTO, admissionNo: string): Promise<StudentAcademicProfileResponseDTO>
    fetchStudentProfileByUserId(userId: string): Promise<StudentProfileResponseDTO>
}