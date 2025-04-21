import { AnnouncementResponseDTO, ClassResponseDTO, AnnouncementDTO, CreateClassDTO, ClassListResponseDTO, ClassByIdResponseDTO } from "../../dto/ClassDTO"
import { AnnouncementEntityType } from "../../types/types"

type userRole =  "superadmin" | "admin" | "teacher" | "student";


export interface IClassService{
    createClass(dto: CreateClassDTO): Promise<ClassResponseDTO>
    findAllClasses(schoolId: string): Promise<ClassResponseDTO[]>
    findClassById(classId: string, userId: string, userType: string): Promise<ClassByIdResponseDTO>
    findAllClassesByTeacherId(teacherId: string): Promise<ClassListResponseDTO[]>
    getClassIdsForUsers(userId: string, role: userRole, schoolId: string): Promise<{name: string, section: string, id: string}[]>
    
    addAnnouncement(data: AnnouncementDTO): Promise<AnnouncementResponseDTO>
    updateAnnouncement(id: string, data: AnnouncementDTO): Promise<AnnouncementResponseDTO | null>
    fetchAnnouncements(schoolId: string): Promise<AnnouncementEntityType[]>
    findAnnouncements(schoolId?: string, classId?: string): Promise<AnnouncementResponseDTO[]>
}

export default IClassService