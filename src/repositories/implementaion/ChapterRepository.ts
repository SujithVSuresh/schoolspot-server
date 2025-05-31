import Chapter from "../../models/Chapter";
import { ChapterEntityType } from "../../types/ChapterType";
import { IChapterRepository } from "../interface/IChapterRepository";
import { BaseRepository } from "./BaseRepository";
import mongoose, { mongo } from "mongoose";


class ChapterRepository extends BaseRepository<ChapterEntityType> implements IChapterRepository {
    constructor(){
        super(Chapter)
    }

    async createChapter(data: ChapterEntityType): Promise<ChapterEntityType> {
            try {
              return await this.create({
                ...data,
                subject: new mongoose.Types.ObjectId(data.subject),
                classGrade: new mongoose.Types.ObjectId(data.classGrade),
                school: new mongoose.Types.ObjectId(data.school)
              });
            } catch (error) {
              console.error("Error creating class", error);
              throw new Error("Error creating class");
            }
    }

    async updateChapter(chapterId: string, data: Partial<ChapterEntityType>): Promise<ChapterEntityType | null> {
            try {
              return await this.update(chapterId, data)
            } catch (error) {
              console.error("Error updating class", error);
              throw new Error("Error updating class");
            }
    }

    async deleteChapter(chapterId: string): Promise<boolean | null> {
            try {
              return await this.delete(chapterId)
            } catch (error) {
              console.error("Error updating class", error);
              throw new Error("Error updating class");
            }
    }

    async findChaptersBySubject(subjectId: string): Promise<ChapterEntityType[]> {
            try {
              return await this.findByQuery({
                subject: new mongoose.Types.ObjectId(subjectId)
              })
            } catch (error) {
              console.error("Error updating class", error);
              throw new Error("Error updating class");
            }
    }

    async findChapterById(chapterId: string): Promise<ChapterEntityType | null> {
            try {
              return await this.findById(chapterId)
            } catch (error) {
              console.error("Error updating class", error);
              throw new Error("Error updating class");
            }
    }
}

export default new ChapterRepository()