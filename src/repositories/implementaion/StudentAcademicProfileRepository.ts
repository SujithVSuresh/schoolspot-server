import mongoose from "mongoose";
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
            from: "Classes",
            localField: "classId",
            foreignField: "_id",
            as: "classId",
          },
        },
        { $unwind: "$classId" },
      ]);

      return academicProfile[0];
    } catch (error) {
      console.error("Error finding academic profile", error);
      throw new Error("Error finding academic profile");
    }
  }

  async findAcademicProfilesByClassId(
    classId: string
  ): Promise<StudentAcademicProfileEntityType[]> {
    try {
      const academicProfile = await StudentAcademicProfile.aggregate([
        {
          $match: {
            classId: new mongoose.Types.ObjectId(classId),
          },
        },
        {
          $lookup: {
            from: "Students",
            localField: "studentId",
            foreignField: "_id",
            as: "studentId",
          },
        },
        { $unwind: "$studentId" },
      ]);

      return academicProfile;
    } catch (error) {
      console.error("Error finding academic profile", error);
      throw new Error("Error finding academic profile");
    }
  }

  async deleteAcademicProfile(id: string): Promise<boolean | null> {
    try {
      const response = await this.delete(id);
      return response;
    } catch (error) {
      console.error("Error deleting academic profile", error);
      throw new Error("Error deleting academic profile");
    }
  }

  async deleteAcademicProfilesByClass(classId: string): Promise<boolean | null> {
        try {
      const response = await StudentAcademicProfile.deleteMany({
        classId: new mongoose.Types.ObjectId(classId)
      })
      return response.deletedCount > 0 ? true : false;
    } catch (error) {
      console.error("Error deleting academic profile", error);
      throw new Error("Error deleting academic profile");
    }
  }
}

export default new StudentAcademicProfileRepository();
