import { ExamEntityType } from "../../types/ExamType";
import { IExamRepository } from "../interface/IExamRespository";
import { BaseRepository } from "./BaseRepository";
import Exam from "../../models/Exam";


class ExamRepository extends BaseRepository<ExamEntityType> implements IExamRepository {
    constructor(){
        super(Exam)
    }

    async createExam(data: ExamEntityType): Promise<ExamEntityType> {
        try{
            return this.create(data)

        } catch (error) {
            console.error("Error creating exam", error);
            throw new Error("Error creating exam");
          }
        
    }

    async updateExam(examId: string, data: Partial<ExamEntityType>): Promise<ExamEntityType | null> {
        try{
            return this.update(examId, data)

        }catch(error){
            console.error("Error updating exam", error);
            throw new Error("Error updating exam");
        }
    }

    async deleteExam(examId: string): Promise<boolean> {
        try{
            return this.delete(examId)
        }catch(error){
            console.error("Error deleting exam", error);
            throw new Error("Error deleting exam");
        }
    }

    async findExamsByClass(classId: string): Promise<ExamEntityType[]> {
        try{
            return this.findByQuery({classId})
        }catch(error){
            console.error("Error finding exams", error);
            throw new Error("Error finding exams");
        }
    }

    async findExamById(examId: string): Promise<ExamEntityType | null>{
        try{
            return this.findById(examId)
        }catch(error){
            console.error("Error finding exam", error);
            throw new Error("Error finding exam");
        }
    }
}


export default new ExamRepository()