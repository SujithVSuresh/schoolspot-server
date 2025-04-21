import { AnnouncementEntityType } from "../../types/types";

export interface IAnnouncementRepository {
    addAnnouncement(data: AnnouncementEntityType): Promise<AnnouncementEntityType>
    updateAnnouncement(id: string, data: AnnouncementEntityType): Promise<AnnouncementEntityType | null>
    getAnnouncements(schoolId: string): Promise<AnnouncementEntityType[]>
    findAnnouncements(schoolId?: string | null, classId?: string | null): Promise<AnnouncementEntityType[]>
}