import { GetParamsType, GetStudentsResponseType, StudentUserProfileType, UserResponseType, UserType } from "../../types/types";
import { StudentResponseDTO } from "../../dto/StudentDTO";


export interface IStudentService{
    addStudent(data: StudentUserProfileType, file: Express.Multer.File, schoolId: string, classId: string): Promise<{email: string, userId: string, classId: string}>
    getStudents(data: GetParamsType, schoolId: string): Promise<GetStudentsResponseType>
    getStudentById(userId: string): Promise<StudentResponseDTO> 
    getStudentsByQuery(query: any, schoolId: string): Promise<any>
    getStudentsByClassId(classId: string, schoolId: string): Promise<StudentResponseDTO[]> 
}