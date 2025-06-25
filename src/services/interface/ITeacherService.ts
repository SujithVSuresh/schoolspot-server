import { TeacherBySchoolResponseDTO, TeacherProfileResponseDTO, TeachersWithPagenationResponseDTO, UpdateTeacherDTO } from "../../dto/TeacherDTO";
import { GetTeacherParamsType, GetTeacherResponseType, TeacherUserProfileType, UserResponseType, UserType } from "../../types/types";



export interface ITeacherService{
    addTeacher(data: TeacherUserProfileType, file: Express.Multer.File, schoolId: string): Promise<string>
    getTeachers(
        data: GetTeacherParamsType,
        schoolId: string
      ): Promise<TeachersWithPagenationResponseDTO>
    getTeacherBySchool(schoolId: string): Promise<TeacherBySchoolResponseDTO[]>
    getTeacherProfile(userId: string): Promise<TeacherProfileResponseDTO>
    updateTeacher(userId: string, data: UpdateTeacherDTO, file: Express.Multer.File,): Promise<{email: string; userId: string}>
}