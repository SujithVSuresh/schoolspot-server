import { CreateStudentDTO, StudentPagenationResponseDTO, StudentResponseDTO, StudentSearchQueryDTO } from "../../dto/StudentDTO";


export interface IStudentService{
    addStudent(data: CreateStudentDTO, file: Express.Multer.File, schoolId: string, classId: string): Promise<{email: string, userId: string, classId: string}>
    getStudentsBySchool(data: StudentSearchQueryDTO, schoolId: string): Promise<StudentPagenationResponseDTO>
    getStudentById(userId: string): Promise<StudentResponseDTO> 
    getStudentsByQuery(query: any, schoolId: string): Promise<any>
    getStudentsByClassId(classId: string, schoolId: string): Promise<StudentResponseDTO[]> 
}