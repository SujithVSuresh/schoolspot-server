import { StudentProfileType } from "../../types/types";
import { GetParamsType } from "../../types/types";
import { GetStudentsResponseType } from "../../types/types";

export interface IStudentRepository {
    createStudentProfile(data: StudentProfileType): Promise<StudentProfileType>;
    getAllStudents({page, limit, search, sortBy, sortOrder, status}: GetParamsType, schoolId: string): Promise<GetStudentsResponseType> 
}

