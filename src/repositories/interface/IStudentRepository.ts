import { StudentProfileType } from "../../types/types";

interface GetParamsType {
    page: number,
    limit: number
}

export interface IStudentRepository {
    createStudentProfile(data: StudentProfileType): Promise<StudentProfileType>;
    getAllStudents({page, limit}: GetParamsType): Promise<null> 
}

