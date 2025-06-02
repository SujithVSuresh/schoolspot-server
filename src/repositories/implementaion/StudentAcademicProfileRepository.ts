import mongoose, { mongo } from "mongoose";
import StudentAcademicProfile from "../../models/StudentAcademicProfile";
import { StudentAcademicProfileEntityType } from "../../types/StudentType";
import { IStudentAcademicProfileRepository } from "../interface/IStudentAcademicProfileRepository";
import { BaseRepository } from "./BaseRepository";

class StudentAcademicProfileRepository
  extends BaseRepository<StudentAcademicProfileEntityType>
  implements IStudentAcademicProfileRepository
{
  constructor() {
    super(StudentAcademicProfile);
  }

  async createAcademicProfile(
    data: StudentAcademicProfileEntityType
  ): Promise<StudentAcademicProfileEntityType> {
    try {
      return await this.create({
        ...data,
        studentId: new mongoose.Types.ObjectId(data.studentId as string),
        classId: new mongoose.Types.ObjectId(data.classId as string),
      });
    } catch (error) {
      console.error("Error creating academic profile", error);
      throw new Error("Error creating academic profile");
    }
  }

  async findAcademicProfile(
    query: any
  ): Promise<StudentAcademicProfileEntityType> {
    try {
      const academicProfile = await StudentAcademicProfile.aggregate([
        {
          $match: {
            ...query,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        { $unwind: "$userId" },
        {
          $lookup: {
            from: "Students",
            localField: "studentId",
            foreignField: "_id",
            as: "studentId",
          },
        },
        { $unwind: "$studentId" },
        {
          $lookup: {
            from: "Class",
            localField: "classId",
            foreignField: "_id",
            as: "classId",
          },
        },
        { $unwind: "$classId" }
      ]);

      return academicProfile[0]
    } catch (error) {
      console.error("Error finding academic profile", error);
      throw new Error("Error finding academic profile");
    }
  }
}

export default new StudentAcademicProfileRepository();
