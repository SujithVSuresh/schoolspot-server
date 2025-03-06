import { GetParamsType, GetStudentsResponseType, StudentUserProfileType, UserResponseType, UserType } from "../../types/types";



export interface IStudentService{
    addStudent(data: StudentUserProfileType, file: Express.Multer.File): Promise<string>
    getStudents(data: GetParamsType): Promise<GetStudentsResponseType>
}