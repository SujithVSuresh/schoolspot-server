import mongoose from "mongoose";
import { TeacherProfileType } from "../../types/types";
import { GetParamsType } from "../../types/types";
import { GetStudentsResponseType } from "../../types/types";
import { GetTeacherResponseType } from "../../types/types";

export interface ITeacherRepository {
    createTeacherProfile(data: TeacherProfileType): Promise<TeacherProfileType>;
    getAllTeachers({page, limit, search, sortBy, sortOrder, status}: GetParamsType, schoolId: string): Promise<GetTeacherResponseType> 
    getTeacherBySchool(schoolId: string): Promise<TeacherProfileType[]>
}