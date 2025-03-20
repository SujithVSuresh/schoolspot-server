import { AnnouncementResponseDTO, ClassResponseDTO, AnnouncementDTO, CreateClassDTO } from "../../dto/ClassDTO"
import { SubjectDTO } from "../../dto/ClassDTO"

export interface IClassService{
    createClass(dto: CreateClassDTO): Promise<ClassResponseDTO>
    findAllClasses(schoolId: string): Promise<ClassResponseDTO[]>
    findClassById(id: string): Promise<ClassResponseDTO>
    addSubject(data: SubjectDTO, classId: string): Promise<SubjectDTO>
    removeSubject(subjectId: string, classId: string): Promise<string>
    updateSubject(subjectId: string, classId: string, data: SubjectDTO): Promise<SubjectDTO> 
    addAnnouncement(data: AnnouncementDTO): Promise<AnnouncementResponseDTO>
    updateAnnouncement(id: string, data: AnnouncementDTO): Promise<AnnouncementResponseDTO | null>
}

export default IClassService