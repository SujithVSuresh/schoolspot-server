import { AnnouncementEntityType } from "../../types/types";
import { BaseRepository } from "./BaseRepository";
import { IAnnouncementRepository } from "../interface/IAnnouncementRepository";
import Announcement from "../../models/Announcement";
import mongoose, { mongo } from "mongoose";

class AnnouncementRepository
  extends BaseRepository<AnnouncementEntityType>
  implements IAnnouncementRepository
{
  constructor() {
    super(Announcement);
  }

  async addAnnouncement(
    data: AnnouncementEntityType
  ): Promise<AnnouncementEntityType> {
    try {
      return await this.create(data);
    } catch (error) {
      console.error("Error creating announcement", error);
      throw new Error("Error creating announcement");
    }
  }

  async updateAnnouncement(
    id: string,
    data: AnnouncementEntityType
  ): Promise<AnnouncementEntityType | null> {
    try {
      const response = await this.update(id, data);

      return response ? response : null;
    } catch (error) {
      console.error("Error updating announcement", error);
      throw new Error("Error updating announcement");
    }
  }

  async findAnnouncementById(announcementId: string): Promise<AnnouncementEntityType | null>{
    try {
      const response = await this.findById(announcementId)      
      return response
    } catch (error) {
      console.error("Error fetching announcement", error);
      throw new Error("Error fetching announcement");
    }
  }


  
  async deleteAnnouncement(announcementId: string): Promise<boolean> {
    try{
      const response = await this.delete(announcementId)
      return response
    }catch(error){
      console.error("Error deleting announcement", error);
      throw new Error("Error deteting announcement"); 
    }
  }

  async pinAnnouncement(announcementId: string, userId: string): Promise<AnnouncementEntityType | null> {
    try{
      const response = await Announcement.findByIdAndUpdate(
        announcementId,
        {
          $addToSet: { pinned: new mongoose.Types.ObjectId(userId) }
        },
        { new: true } 
      );
      
      return response

    }catch(error){
      console.error("Error pinning announcement", error);
      throw new Error("Error pinning announcement"); 
    }
  }

  async unpinAnnouncement(announcementId: string, userId: string): Promise<AnnouncementEntityType | null> {
    try{
      const response = await Announcement.findByIdAndUpdate(
        announcementId,
        {
          $pull: { pinned: new mongoose.Types.ObjectId(userId) }
        },
        { new: true } 
      );
      
      return response

    }catch(error){
      console.error("Error pinning announcement", error);
      throw new Error("Error pinning announcement"); 
    }
  }


  async findAnnouncements(schoolId?: string | null, classId?: string | null): Promise<AnnouncementEntityType[]> {
    try {
      let query: any = {}

      if(schoolId){
        query.schoolId = new mongoose.Types.ObjectId(schoolId)
      }else if(classId){
        query.sendTo = new mongoose.Types.ObjectId(classId)
      }

      const response = await Announcement.find(
        {...query}
      ).sort({ createdAt: -1 });

      return response;
    } catch (error) {
      console.error("Error updating announcement", error);
      throw new Error("Error updating announcement");
    }
  }


  async findPinnedAnnouncements(userId: string): Promise<AnnouncementEntityType[]> {
    const response = await this.findByQuery({
      pinned: new mongoose.Types.ObjectId(userId)
    })
    return response
  }


}

export default new AnnouncementRepository();
