import { BaseRepository } from "./BaseRepository";
import { LeaveLetterEntityType } from "../../types/types";
import { ILeaveLetterRepository } from "../interface/ILeaveLetterRepository";
import LeaveLetter from "../../models/LeaveLetter";
import mongoose from "mongoose";


class LeaveLetterRepository extends BaseRepository<LeaveLetterEntityType> implements ILeaveLetterRepository {
  constructor() {
    super(LeaveLetter);
  }

  async createLeaveLetter(data: LeaveLetterEntityType): Promise<LeaveLetterEntityType> {
    try {
      return await this.create({
        ...data,
        studentId: new mongoose.Types.ObjectId(data.studentId),
        classId: new mongoose.Types.ObjectId(data.classId),
        schoolId: new mongoose.Types.ObjectId(data.schoolId)
      });
    } catch (error) {
      console.error("Error creating leave letter", error);
      throw new Error("Error creating leave letter");
    }
  }

  async editLeaveLetter(id: string, data: Partial<LeaveLetterEntityType>): Promise<LeaveLetterEntityType | null> {
    try {
      return await this.update(id, data);
    } catch (error) {
      console.error("Error editing leave letter", error);
      throw new Error("Error editing leave letter");
    }
  }
  

  async deleteLeaveLetter(id: string): Promise<boolean | null> {
   try{
    const response = await this.delete(id);
    return response
   }catch(error){
    console.error("Error deleting leave letter", error);
    throw new Error("Error deleting leave letter");
   }    
  }

  async findLeaveLetters(query: any): Promise<LeaveLetterEntityType[]> {
    try {
      const response = await this.findByQuery(query);
      console.log(response, "klklkl")
      return response
    } catch (error) {
      console.error("Error finding leave letter", error);
      throw new Error("Error finding leave letter");
    }
  }

  async findLeaveLetterById(id: string): Promise<LeaveLetterEntityType | null> {
    try {
      const leaveLetter = await this.findById(id)

      return leaveLetter
    } catch (error) {
      console.error("Error finding leave letter", error);
      throw new Error("Error finding leave letter");
    }
  }
}

export default new LeaveLetterRepository();