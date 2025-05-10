import mongoose from "mongoose";
import ExamResult from "../../models/ExamResult";
import { ExamResultEntityType } from "../../types/ExamType";
import { IExamResultRepository } from "../interface/IExamResultRepository";
import { BaseRepository } from "./BaseRepository";

class ExamResultRepository
  extends BaseRepository<ExamResultEntityType>
  implements IExamResultRepository
{
  constructor() {
    super(ExamResult);
  }

  async createExamResult(
    data: ExamResultEntityType
  ): Promise<ExamResultEntityType> {
    try {
      return await this.create(data);
    } catch (error) {
      console.error("Error creating exam result", error);
      throw new Error("Error creating exam result");
    }
  }

  async updateExamResult(
    id: string,
    data: Partial<ExamResultEntityType>
  ): Promise<ExamResultEntityType | null> {
    try {
      return await this.update(id, data);
    } catch (error) {
      console.error("Error updating exam result", error);
      throw new Error("Error updating exam result");
    }
  }

  async deleteExamResult(id: string): Promise<boolean> {
    try {
      return await this.delete(id);
    } catch (error) {
      console.error("Error updating exam result", error);
      throw new Error("Error updating exam result");
    }
  }

}

export default new ExamResultRepository();
