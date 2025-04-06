import { BaseRepository } from "./BaseRepository";
import { StudyMaterialEntityType } from "../../types/types";
import { IStudyMaterialRepository } from "../interface/IStudyMaterialRepository";
import StudyMaterial from "../../models/StudyMaterial";



class StudyMaterialRepository extends BaseRepository<StudyMaterialEntityType> implements IStudyMaterialRepository{
  constructor() {
    super(StudyMaterial);
  }

async createStudyMaterial(data: StudyMaterialEntityType): Promise<StudyMaterialEntityType> {
    try {
        const response = await this.create(data);
        return response;
    } catch (error) {
        console.error("Error creating study material", error);
        throw new Error("Error creating study material");
    }
  }
}

export default new StudyMaterialRepository()