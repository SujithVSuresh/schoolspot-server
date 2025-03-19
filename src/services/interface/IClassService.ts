import { ClassResponseDTO, CreateClassDTO } from "../../dto/ClassDTO"
import ClassRepository from "../../repositories/implementaion/ClassRepository"


export interface IClassService{
    createClass(dto: CreateClassDTO): Promise<ClassResponseDTO>
    findAllClasses(schoolId: string): Promise<ClassResponseDTO[]>
    findClassById(id: string): Promise<ClassResponseDTO>
}

export default IClassService