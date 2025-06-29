import mongoose from "mongoose";
import { TeacherProfileType } from "../../types/types";
import { GetParamsType } from "../../types/types";
import { GetTeacherResponseType } from "../../types/types";
import { TeacherProfileUserEntityType } from "../../types/types";

export interface ITeacherRepository {
    createTeacherProfile(data: TeacherProfileType): Promise<TeacherProfileType>;
    getAllTeachers({skip, limit, search}: {skip: number, limit: number, search: string}, schoolId: string): Promise<TeacherProfileUserEntityType[]> 
    teachersCount({ search }: { search: string }, schoolId: string): Promise<{totalItems: number}>
    getTeacherBySchool(schoolId: string): Promise<TeacherProfileType[]>
    findTeacherProfile(userId: string): Promise<TeacherProfileUserEntityType | null>
    updateTeacherProfile(profileId: string, data: Partial<TeacherProfileType>): Promise<TeacherProfileType>
    getTeacherCountBySchool(schoolId: string): Promise<number>
}