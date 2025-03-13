import { GetParamsType, GetTeacherResponseType, TeacherUserProfileType, UserResponseType, UserType } from "../../types/types";



export interface ITeacherService{
    addTeacher(data: TeacherUserProfileType, file: Express.Multer.File, schoolId: string): Promise<string>
    getTeachers(data: GetParamsType, schoolId: string): Promise<GetTeacherResponseType>
}