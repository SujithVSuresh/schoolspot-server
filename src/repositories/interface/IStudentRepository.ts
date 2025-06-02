// import { StudentProfileEntityType, StudentProfileUserEntityType } from "../../types/StudentType";
import { StudentSearchQueryDTO } from "../../dto/StudentDTO";
import { StudentEntityType } from "../../types/StudentType";


export interface IStudentRepository {
    createStudentProfile(data: StudentEntityType): Promise<StudentEntityType>;
    getStudentsBySchool({page, limit, search, sortBy, sortOrder, statusFilter}: StudentSearchQueryDTO, schoolId: string): Promise<StudentEntityType[]> 
    findStudentsCountBySchool(schoolId: string): Promise<number>
    getStudentById(userId: string): Promise<StudentEntityType | null>
    getStudent(query: any): Promise<StudentEntityType | null>
    getStudents(query: any, schoolId: string): Promise<any>
    updateStudentProfile(profileId: string, data: Partial<StudentEntityType>): Promise<StudentEntityType>
    studentCountBySchool(schoolId: string): Promise<number>
}

