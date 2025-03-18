import { GetTeacherParamsType, GetTeacherResponseType, TeacherUserProfileType, UserResponseType, UserType } from "../../types/types";



export interface ITeacherService{
    addTeacher(data: TeacherUserProfileType, file: Express.Multer.File, schoolId: string): Promise<string>
    getTeachers(data: GetTeacherParamsType, schoolId: string): Promise<GetTeacherResponseType>
}