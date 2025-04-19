import { BaseRepository } from "./BaseRepository";
import { StudyMaterialEntityType } from "../../types/types";
import { IStudyMaterialRepository } from "../interface/IStudyMaterialRepository";
import StudyMaterial from "../../models/StudyMaterial";
import mongoose from "mongoose";



class StudyMaterialRepository extends BaseRepository<StudyMaterialEntityType> implements IStudyMaterialRepository{
  constructor() {
    super(StudyMaterial);
  }

async createStudyMaterial(data: StudyMaterialEntityType): Promise<StudyMaterialEntityType> {
    try {
        const response = await this.create({
          ...data,
          
        });
        return response;
    } catch (error) {
        console.error("Error creating study material", error);
        throw new Error("Error creating study material");
    }
  }

async updateStudyMaterial(data: Partial<StudyMaterialEntityType>, id: string): Promise<StudyMaterialEntityType | null> {
  try{
    const response = await this.update(id, data)
    return response


  }catch (error) {
        console.error("Error updating study material", error);
        throw new Error("Error updating study material");
    }
}

async deleteStudyMaterial(id: string): Promise<boolean> {
  try{
    return await this.delete(id)

  }catch(error){
    console.error("Error deleting study material", error);
    throw new Error("Error deleting study material");
  }
}

async getStudyMaterials(subjectId: string): Promise<StudyMaterialEntityType[]> {
    try {
        const response = await this.findByQuery({subjectId});
        return response;
    } catch (error) {
        console.error("Error creating study material", error);
        throw new Error("Error creating study material");
    }
}

async getStudyMaterialById(id: string): Promise<StudyMaterialEntityType | null>{
  try{

  const response = await StudyMaterial.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: "Students", 
        localField: "viewers",
        foreignField: "userId",
        as: "viewers"
      }
    }
  ]);
  return response[0] || null;
} catch (error) {
  console.error("Error creating study material", error);
  throw new Error("Error creating study material");
}
}

async addStudyMaterialViewer(studyMaterialId: string, studentId: string): Promise<string | null> {
    try{
      const response = await StudyMaterial.findByIdAndUpdate(
        studyMaterialId,
        { $addToSet: { viewers: studentId } },
        { new: true }
      );

      return String(response?._id) ?? null;

    }catch(error){
      console.error("Error adding study material viewer", error);
      throw new Error("Error adding study material viewer");
    }

}

}



export default new StudyMaterialRepository()