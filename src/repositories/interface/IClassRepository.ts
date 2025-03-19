import { TeacherProfileType } from "../../types/types";
import { ClassEntityType, SubjectEntityType} from "../../types/types";
import mongoose from "mongoose";

export interface IClassRepository {
    createClass(data: ClassEntityType): Promise<ClassEntityType>;
    findClass(data: {name: string, section: string, school: mongoose.Types.ObjectId}): Promise<ClassEntityType | null>
    findAllClasses(schoolId: string): Promise<ClassEntityType[]> 
    findClassById(id: string): Promise<ClassEntityType | null>
    addSubject(data: SubjectEntityType, classId: string): Promise<SubjectEntityType | null>
    removeClass(subjectId: string, classId: string): Promise<string | null>
}