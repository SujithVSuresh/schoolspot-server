import { CreateSubjectDTO, SubjectResponseDTO, UpdateSubjectDTO } from "../../dto/SubjectDTO";



export interface ISubjectService{
    createSubject(data: CreateSubjectDTO): Promise<SubjectResponseDTO>
    findSubjectsByClass(classId: string, academicYear: string): Promise<SubjectResponseDTO[]> 
    deleteSubject(subjectId: string): Promise<{_id: string}>
    findSubjectById(subjectId: string): Promise<SubjectResponseDTO>
    updateSubject(subjectId: string, classId: string,  data: UpdateSubjectDTO): Promise<SubjectResponseDTO> 
}