import { BaseRepository } from "./BaseRepository";
import { StudentProfileType, StudentUserProfileType } from "../../types/types";
import { IStudentRepository } from "../interface/IStudentRepository";
import Student from "../../models/Student";
import { GetParamsType } from "../../types/types";



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

    async getAllStudents({page, limit}: GetParamsType): Promise<any> {
        try{
            const pageNumber = page || 1; 
            const pageSize = limit || 10;  
            const skip = (pageNumber - 1) * pageSize;


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
                    $project: {
                      _id: 1,
                      fullName: 1,
                      class: 1,
                      section: 1,
                      profilePhoto: 1,
                      gender: 1,
                      dob: 1,
                      address: 1,
                      fatherName: 1,
                      motherName: 1,
                      contactNumber: 1,
                      schoolId: 1,
                      createdAt: 1,
                      updatedAt: 1,
                      user: {
                        _id: "$userDetails._id",
                        email: "$userDetails.email",
                        role: "$userDetails.role",
                        status: "$userDetails.status",
                        createdAt: "$userDetails.createdAt",
                        updatedAt: "$userDetails.updatedAt"
                      }
                    }
                },
                { $skip: skip },
                { $limit: pageSize }
            ])

            console.log(students, "lalala")

            return students

        }catch(error){
            console.error("Error fetching student data", error);
            throw new Error("Error creating user")
        }
    }

}
    

export default new StudentRepository()