import { GetParamsType, GetStudentsResponseType, StudentUserProfileType, UserResponseType, UserType } from "../../types/types";
import { StudentResponseDTO } from "../../dto/StudentDTO";


export interface IStudentService{
    addStudent(data: StudentUserProfileType, file: Express.Multer.File, schoolId: string): Promise<string>
    getStudents(data: GetParamsType, schoolId: string): Promise<GetStudentsResponseType>
    getStudentById(userId: string): Promise<StudentResponseDTO> 
}