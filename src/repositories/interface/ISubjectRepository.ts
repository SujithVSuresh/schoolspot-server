import { SubjectWithClassEntityType } from "../../types/types";
import { SubjectEntityType } from "../../types/SubjectType";


export interface ISubjectRepository {
    createSubject(data: SubjectEntityType): Promise<SubjectEntityType>;
    findSubjectById(subjectId: string): Promise<SubjectEntityType | null>;
    findSubjectsByClassId(classId: string, academicYear: string): Promise<SubjectEntityType[]>;
    findSubject(query: any): Promise<SubjectEntityType | null>;
    deleteSubject(subjectId: string): Promise<boolean | null>
    findClassesByTeacherIdUsingSubjects(teacherId: string): Promise<SubjectWithClassEntityType[]>
    updateSubject(subjectId: string, data: Partial<SubjectEntityType>): Promise<SubjectEntityType | null>;
}