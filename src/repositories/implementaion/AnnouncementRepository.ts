import { AnnouncementEntityType } from "../../types/types";
import { BaseRepository } from "./BaseRepository";
import { IAnnouncementRepository } from "../interface/IAnnouncementRepository";
import Announcement from "../../models/Announcement";




class AnnouncementRepository extends BaseRepository<AnnouncementEntityType> implements IAnnouncementRepository {
    constructor(){
        super(Announcement)
    }
    

    async addAnnouncement(data: AnnouncementEntityType): Promise<AnnouncementEntityType>{
        try {
            return await this.create(data);
          } catch (error) {
            console.error("Error creating announcement", error);
            throw new Error("Error creating announcement");
          }
    }
}

export default new AnnouncementRepository()