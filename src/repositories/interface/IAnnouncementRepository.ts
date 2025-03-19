import { AnnouncementEntityType } from "../../types/types";

export interface IAnnouncementRepository {
    addAnnouncement(data: AnnouncementEntityType): Promise<AnnouncementEntityType>
}