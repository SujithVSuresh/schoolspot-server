import { AnnouncementEntityType } from "../../types/types";

export interface IAnnouncementRepository {
    addAnnouncement(data: AnnouncementEntityType): Promise<AnnouncementEntityType>
    updateAnnouncement(id: string, data: AnnouncementEntityType): Promise<AnnouncementEntityType | null>
    findAnnouncements(schoolId?: string | null, classId?: string | null): Promise<AnnouncementEntityType[]>
    findAnnouncementById(announcementId: string): Promise<AnnouncementEntityType | null>
    deleteAnnouncement(announcementId: string): Promise<boolean> 

}