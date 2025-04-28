import { TeacherProfileType } from "../../types/types";
import { ClassEntityType, SubjectEntityType} from "../../types/types";
import mongoose from "mongoose";

export interface IClassRepository {
    createClass(data: ClassEntityType): Promise<ClassEntityType>;
    updateClass(classId: string, data: ClassEntityType): Promise<ClassEntityType | null>;
    deleteClass(classId: string): Promise<boolean | null>
    findClass(data: {name: string, section: string, school: string}): Promise<ClassEntityType | null>
    findAllClasses(schoolId: string): Promise<ClassEntityType[]> 
    updateClassStrength(classId: string, value: 1 | -1): Promise<boolean>
    findClassById(id: string): Promise<ClassEntityType | null>
    // findClassByTeacherId(teacherId: string): Promise<ClassEntityType[]> 
}