import { StudentProfileType } from "../../types/types";
import { GetParamsType } from "../../types/types";
import { GetStudentsResponseType } from "../../types/types";
import { StudentProfileUserEntityType } from "../../types/types";

export interface IStudentRepository {
    createStudentProfile(data: StudentProfileType): Promise<StudentProfileType>;
    getAllStudents({page, limit, search, sortBy, sortOrder, status}: GetParamsType, schoolId: string): Promise<GetStudentsResponseType> 
    getStudentById(userId: string): Promise<StudentProfileUserEntityType | null>
    getStudentByQuery(query: any): Promise<StudentProfileType | null>
    getStudentsByQuery(query: any, schoolId: string): Promise<any>
    updateStudentProfile(profileId: string, data: StudentProfileType): Promise<StudentProfileType>
}

