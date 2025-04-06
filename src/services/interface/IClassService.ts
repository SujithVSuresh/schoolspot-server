import { AnnouncementResponseDTO, ClassResponseDTO, AnnouncementDTO, CreateClassDTO, ClassListResponseDTO, ClassByIdResponseDTO } from "../../dto/ClassDTO"
import { AnnouncementEntityType } from "../../types/types"
import { SubjectDTO } from "../../dto/ClassDTO"

export interface IClassService{
    createClass(dto: CreateClassDTO): Promise<ClassResponseDTO>
    findAllClasses(schoolId: string): Promise<ClassResponseDTO[]>
    findClassById(classId: string, userId: string, userType: string): Promise<ClassByIdResponseDTO>
    findAllClassesByTeacherId(teacherId: string): Promise<ClassListResponseDTO[]>
    addSubject(data: SubjectDTO, classId: string): Promise<SubjectDTO>
    removeSubject(subjectId: string, classId: string): Promise<string>
    updateSubject(subjectId: string, classId: string, data: SubjectDTO): Promise<SubjectDTO> 
    addAnnouncement(data: AnnouncementDTO): Promise<AnnouncementResponseDTO>
    updateAnnouncement(id: string, data: AnnouncementDTO): Promise<AnnouncementResponseDTO | null>
    fetchAnnouncements(schoolId: string): Promise<AnnouncementEntityType[]>
}

export default IClassService