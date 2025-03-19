import { ClassResponseDTO, CreateClassDTO } from "../../dto/ClassDTO"
import ClassRepository from "../../repositories/implementaion/ClassRepository"
import { SubjectEntityType } from "../../types/types"
import { SubjectDTO } from "../../dto/ClassDTO"

export interface IClassService{
    createClass(dto: CreateClassDTO): Promise<ClassResponseDTO>
    findAllClasses(schoolId: string): Promise<ClassResponseDTO[]>
    findClassById(id: string): Promise<ClassResponseDTO>
    addSubject(data: SubjectDTO, classId: string): Promise<SubjectDTO>
    removeSubject(subjectId: string, classId: string): Promise<string>
}

export default IClassService