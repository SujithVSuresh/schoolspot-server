import { SubjectEntityType, SubjectWithClassEntityType } from "../../types/types";
import { ISubjectRepository } from "../interface/ISubjectRepository";
import { BaseRepository } from "./BaseRepository";
import Subject from "../../models/Subject"; 
import mongoose from "mongoose";

class SubjectRepository extends BaseRepository<SubjectEntityType> implements ISubjectRepository {
    constructor(){
        super(Subject)
    }

    async createSubject(data: SubjectEntityType): Promise<SubjectEntityType> {
        try{
            const response =  await this.create(data)
            console.log(response, "response from subject repo")
            return response

        }catch(error){
            console.error("Error creating subject", error);
            throw new Error("Error creating subject")
        }
    }



    async findSubjectById(subjectId: string): Promise<SubjectEntityType | null> {
        try{
            const subject = await this.findById(subjectId)
            console.log("kakaka", subject)
            return subject

        }catch(error){
            console.error("Error finding subject", error);
            throw new Error("Error finding subject")
        }
    }

    async findClassesByTeacherIdUsingSubjects(teacherId: string): Promise<SubjectWithClassEntityType[]> {
        try{
            const subject = await Subject.aggregate([
                {
                    $match: {
                        teacher: new mongoose.Types.ObjectId(teacherId)
                    }
                },
                {
                    $lookup: {
                        from: "Classes",
                        localField: "class",
                        foreignField: "_id",
                        as: "class"
                    }
                },
                {
                    $unwind: "$class"
                },
            ])

            return subject

        }catch(error){
            console.error("Error finding subject", error);
            throw new Error("Error finding subject")
        }
    }

    async findSubject(query: any): Promise<SubjectEntityType | null> {
        try{
            const subject = await this.findByQuery({
               ...query
            })

            return subject[0]

        }catch(error){
            console.error("Error finding subject", error);
            throw new Error("Error finding subject")
        }
    }

    async findSubjectsByClassId(classId: string): Promise<SubjectEntityType[]> {
        try{
            const subjects = await Subject.aggregate([
                {
                    $match: {
                        class: new mongoose.Types.ObjectId(classId)
                    }
                },
                {
                    $lookup: {
                        from: "Teachers",
                        localField: "teacher",
                        foreignField: "userId",
                        as: "teacher"
                    }
                },
                {
                    $unwind: "$teacher"
                },
                {
                    $project: {
                        name: 1,
                        teacher:"$teacher.fullName",
                        class: 1,
                        school: 1,
                        _id: 1
                    }
                }
            ])

            return subjects

        }catch(error){
            console.error("Error finding subjects", error);
            throw new Error("Error finding subjects")
        }
    }

    async updateSubject(subjectId: string, data: Partial<SubjectEntityType>): Promise<SubjectEntityType | null> {
        try{
            const result =  await this.update(subjectId, data)
            return result
        } catch(error){
            console.error("Error updating subject", error);
            throw new Error("Error updating subject")
        }
    }

    async deleteSubject(subjectId: string): Promise<boolean | null> {
        try{
            const result = await this.delete(subjectId)
            return result
        }catch(error){
            console.error("Error updating subject", error);
            throw new Error("Error updating subject")
        }
    }

    
}

export default new SubjectRepository();