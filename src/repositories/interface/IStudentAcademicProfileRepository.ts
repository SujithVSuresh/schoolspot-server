import { StudentAcademicProfileEntityType } from "../../types/StudentType";


export interface IStudentAcademicProfileRepository {
    createAcademicProfile(data: StudentAcademicProfileEntityType): Promise<StudentAcademicProfileEntityType>
    findAcademicProfile(query: any): Promise<StudentAcademicProfileEntityType>
    findAcademicProfilesByClassId(classId: string, academicYear?: string): Promise<StudentAcademicProfileEntityType[]>
}