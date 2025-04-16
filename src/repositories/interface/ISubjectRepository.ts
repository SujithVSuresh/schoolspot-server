import { SubjectEntityType } from "../../types/types";


export interface ISubjectRepository {
    createSubject(data: SubjectEntityType): Promise<SubjectEntityType>;
    findSubjectById(subjectId: string): Promise<SubjectEntityType | null>;
    findSubjectsByClassId(classId: string): Promise<SubjectEntityType[]>;
    findSubject(query: any): Promise<SubjectEntityType | null>;
    updateSubject(subjectId: string, data: Partial<SubjectEntityType>): Promise<SubjectEntityType | null>;
}