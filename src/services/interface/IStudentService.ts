import { GetParamsType, StudentUserProfileType, UserResponseType, UserType } from "../../types/types";



export interface IStudentService{
    addStudent(data: StudentUserProfileType): Promise<string>
    getStudents(data: GetParamsType): Promise<any>
}