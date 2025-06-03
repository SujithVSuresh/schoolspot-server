import { ClassEntityType } from "../../types/ClassType";

export interface IClassRepository {
    createClass(data: ClassEntityType): Promise<ClassEntityType>;
    // updateClass(classId: string, data: ClassEntityType): Promise<ClassEntityType | null>;
    deleteClass(classId: string): Promise<boolean | null>
    findClass(data: {name: string, section: string, school: string}): Promise<ClassEntityType | null>
    findAllClasses(schoolId: string, academicYear: string): Promise<ClassEntityType[]> 
    updateClassStrength(classId: string, value: 1 | -1): Promise<boolean>
    findClassById(id: string): Promise<ClassEntityType | null>
    findClassCountBySchoolId(schoolId: string): Promise<number>
}