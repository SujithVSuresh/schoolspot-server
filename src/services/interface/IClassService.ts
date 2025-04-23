import { AnnouncementResponseDTO, ClassResponseDTO, AnnouncementDTO, CreateClassDTO, ClassListResponseDTO, ClassByIdResponseDTO, AnnouncementPinnedResponseDTO } from "../../dto/ClassDTO"
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
    deleteAnnouncement(id: string): Promise<{_id: string}>
    findPinnedAnnouncements(userId: string): Promise<AnnouncementResponseDTO[]>
    findAnnouncementDetails(announcementId: string, userId: string): Promise<AnnouncementPinnedResponseDTO>
    updatePinnedStatus(announcementId: string, userId: string, status: "pin" | "unpin"): Promise<AnnouncementPinnedResponseDTO>
    findAnnouncements(schoolId?: string | null, classId?: string, userId?: string): Promise<AnnouncementResponseDTO[]>
}

export default IClassService