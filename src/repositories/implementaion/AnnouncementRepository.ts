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

    async updateAnnouncement(id: string, data: AnnouncementEntityType): Promise<AnnouncementEntityType | null>{
      try {
        const response = await this.update(id, data);
        
        return response ? response : null; 
      } catch (error) {
        console.error("Error updating announcement", error);
        throw new Error("Error updating announcement");
      }
    }

    async getAnnouncements(schoolId: string): Promise<AnnouncementEntityType[]>{
      try {
        const response = await this.findByQuery({schoolId});
        
        return response; 
      } catch (error) {
        console.error("Error updating announcement", error);
        throw new Error("Error updating announcement");
      }
    }
}

export default new AnnouncementRepository()