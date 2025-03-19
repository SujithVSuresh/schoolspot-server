import { AnnouncementEntityType } from "../../types/types";
import { BaseRepository } from "./BaseRepository";
import { IAnnouncementRepository } from "../interface/IAnnouncementRepository";
import Announcement from "../../models/Announcement";




class AnnouncementRepository extends BaseRepository<AnnouncementEntityType> implements IAnnouncementRepository {
    constructor(){
        super(Announcement)
    }
}