import { BaseRepository } from "./BaseRepository";
import { GetTeacherParamsType, GetTeacherResponseType, TeacherProfileType } from "../../types/types";
import { IStudentRepository } from "../interface/IStudentRepository";
import { GetParamsType } from "../../types/types";
import { GetStudentsResponseType } from "../../types/types";
import { ITeacherRepository } from "../interface/ITeacherRepository";
import Teacher from '../../models/Teacher'
import mongoose from "mongoose";


class TeacherRepository extends BaseRepository<TeacherProfileType> implements ITeacherRepository {
    constructor(){
        super(Teacher)
    }

    async createTeacherProfile(data: TeacherProfileType): Promise<TeacherProfileType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user")
        }
    }

    async getAllTeachers({page, limit, search, sortBy, sortOrder, status}: GetTeacherParamsType, schoolId: string): Promise<GetTeacherResponseType> {
        try{
      
            const skip = (page as number - 1) * (limit as number);

            const matchQuery: any = {}

            matchQuery.schoolId = new mongoose.Types.ObjectId(schoolId)

            if(search){
                matchQuery.fullName = {$regex: search, $options: "i"}
            }

            if(status){
                matchQuery["userDetails.status"] = status; 
            }
            
            console.log(matchQuery, "this is the matcch query....")

            const totalTeachers = await Teacher.countDocuments(matchQuery);

            const teachers = await Teacher.aggregate([
                {
                    $lookup: {
                        from: "Users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    },
                },
                { $unwind: "$userDetails" },
                {
                    $match: matchQuery
                },
                {
                    $project: {
                      _id: 1,
                      fullName: 1,
                      subjectSpecialized: 1,
                      qualification: 1,
                      profilePhoto: 1,
                      schoolId: 1,
                      createdAt: 1,
                      user: {
                        _id: "$userDetails._id",
                        email: "$userDetails.email",
                        status: "$userDetails.status",
                      }
                    }
                },
                { $sort: { [sortBy as string]: sortOrder === "asc" ? 1 : -1 } },
                { $skip: skip },
                { $limit: limit as number }
            ])

            return {
                teachers,
                totalTeachers,
                totalPages: Math.ceil(totalTeachers / (limit as number)),
                currentPage: page as number,
            }

        }catch(error){
            console.error("Error fetching student data", error);
            throw new Error("Error creating user")
        }
    }

}
    

export default new TeacherRepository()