import { AnnouncementEntityType } from "../../types/types";

export interface IAnnouncementRepository {
    addAnnouncement(data: AnnouncementEntityType): Promise<AnnouncementEntityType>
    updateAnnouncement(id: string, data: AnnouncementEntityType): Promise<AnnouncementEntityType | null>
    findAnnouncements(schoolId?: string | null, classId?: string | null): Promise<AnnouncementEntityType[]>
    findPinnedAnnouncements(userId: string): Promise<AnnouncementEntityType[]>
    findAnnouncementById(announcementId: string): Promise<AnnouncementEntityType | null>
    findAnnouncementsByAuthor(userId: string): Promise<AnnouncementEntityType[] | null>
    pinAnnouncement(announcementId: string, userId: string): Promise<AnnouncementEntityType | null> 
    unpinAnnouncement(announcementId: string, userId: string): Promise<AnnouncementEntityType | null> 
    deleteAnnouncement(announcementId: string): Promise<boolean> 
}