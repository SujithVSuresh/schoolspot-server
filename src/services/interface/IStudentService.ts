import { GetParamsType, GetStudentsResponseType, StudentUserProfileType, UserResponseType, UserType } from "../../types/types";



export interface IStudentService{
    addStudent(data: StudentUserProfileType, file: Express.Multer.File, schoolId: string): Promise<string>
    getStudents(data: GetParamsType, schoolId: string): Promise<GetStudentsResponseType>
}