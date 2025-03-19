import { BaseRepository } from "./BaseRepository";
import Class from "../../models/Class";
import { ClassEntityType } from "../../types/types";
import { IClassRepository } from "../interface/IClassRepository";
import { query } from "express";
import mongoose from "mongoose";



class ClassRepository extends BaseRepository<ClassEntityType> implements IClassRepository {
    constructor(){
        super(Class)
    }

    async createClass(data: ClassEntityType): Promise<ClassEntityType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating class", error);
            throw new Error("Error creating class")
        }
    }

    async findClass(data: {name: string, section: string}): Promise<ClassEntityType | null>{
        try{
            return await this.findOne(data)
        }catch(error){
            console.error("Error finding class", error);
            throw new Error("Error finding class")
        }
    }

    async findAllClasses(schoolId: string): Promise<ClassEntityType[]> {
        try{
            return await this.findByQuery({school: new mongoose.Types.ObjectId(schoolId)})
        }catch(error){
            console.error("Error finding classes", error);
            throw new Error("Error finding classes")
        }
    }

    async findClassById(id: string): Promise<ClassEntityType> {
        try{

        }catch(error){

        }
    }

    



    // async getAllTeachers({page, limit, search, sortBy, sortOrder, status}: GetParamsType, schoolId: string): Promise<GetTeacherResponseType> {
    //     try{
    //         console.log(schoolId, "ssstriii")
      
    //         const skip = (page as number - 1) * (limit as number);

    //         const matchQuery: any = {}

    //         matchQuery.schoolId = new mongoose.Types.ObjectId(schoolId)

    //         if(search){
    //             matchQuery.fullName = {$regex: search, $options: "i"}
    //         }

    //         if(status){
    //             matchQuery["userDetails.status"] = status; 
    //         }
            
    //         console.log(matchQuery, "this is the matcch query....")

    //         const totalTeachers = await Teacher.countDocuments(matchQuery);

    //         const teachers = await Teacher.aggregate([
    //             {
    //                 $lookup: {
    //                     from: "Users",
    //                     localField: "userId",
    //                     foreignField: "_id",
    //                     as: "userDetails"
    //                 },
    //             },
    //             { $unwind: "$userDetails" },
    //             {
    //                 $match: matchQuery
    //             },
    //             {
    //                 $project: {
    //                   _id: 1,
    //                   fullName: 1,
    //                   subjectSpecialized: 1,
    //                   qualification: 1,
    //                   profilePhoto: 1,
    //                   schoolId: 1,
    //                   createdAt: 1,
    //                   user: {
    //                     _id: "$userDetails._id",
    //                     email: "$userDetails.email",
    //                     status: "$userDetails.status",
    //                   }
    //                 }
    //             },
    //             { $sort: { [sortBy as string]: sortOrder === "asc" ? 1 : -1 } },
    //             { $skip: skip },
    //             { $limit: limit as number }
    //         ])


    //         return {
    //             teachers,
    //             totalTeachers,
    //             totalPages: Math.ceil(totalTeachers / (limit as number)),
    //             currentPage: page as number,
    //         }

    //     }catch(error){
    //         console.error("Error fetching student data", error);
    //         throw new Error("Error creating user")
    //     }
    // }

}
    

export default new ClassRepository()