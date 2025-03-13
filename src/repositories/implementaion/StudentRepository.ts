import { BaseRepository } from "./BaseRepository";
import { StudentProfileType, StudentUserProfileType } from "../../types/types";
import { IStudentRepository } from "../interface/IStudentRepository";
import Student from "../../models/Student";
import { GetParamsType } from "../../types/types";
import { GetStudentsResponseType } from "../../types/types";
import mongoose from "mongoose";


class StudentRepository extends BaseRepository<StudentProfileType> implements IStudentRepository {
    constructor(){
        super(Student)
    }

    async createStudentProfile(data: StudentProfileType): Promise<StudentProfileType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user")
        }
    }

    async getAllStudents({page, limit, search, sortBy, sortOrder, status}: GetParamsType, schoolId: string): Promise<GetStudentsResponseType> {
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

            const totalStudents = await Student.countDocuments(matchQuery);

            const students = await Student.aggregate([
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
                      class: 1,
                      section: 1,
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
                students,
                totalStudents,
                totalPages: Math.ceil(totalStudents / (limit as number)),
                currentPage: page as number,
            }

        }catch(error){
            console.error("Error fetching student data", error);
            throw new Error("Error creating user")
        }
    }

}
    

export default new StudentRepository()