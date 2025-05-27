import { StudentProfileEntityType, StudentProfileUserEntityType } from "../../types/StudentType";
import { StudentSearchQueryDTO } from "../../dto/StudentDTO";


export interface IStudentRepository {
    createStudentProfile(data: StudentProfileEntityType): Promise<StudentProfileEntityType>;
    getStudentsBySchool({page, limit, search, sortBy, sortOrder, statusFilter}: StudentSearchQueryDTO, schoolId: string): Promise<StudentProfileUserEntityType[]> 
    findStudentsCountBySchool(schoolId: string): Promise<number>
    getStudentById(userId: string): Promise<StudentProfileUserEntityType | null>
    getStudent(query: any): Promise<StudentProfileEntityType | null>
    getStudents(query: any, schoolId: string): Promise<any>
    updateStudentProfile(profileId: string, data: Partial<StudentProfileEntityType>): Promise<StudentProfileEntityType>
    studentCountBySchool(schoolId: string): Promise<number>
}

