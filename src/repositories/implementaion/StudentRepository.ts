import { BaseRepository } from "./BaseRepository";
import { StudentProfileUserEntityType } from "../../types/StudentType";
import { IStudentRepository } from "../interface/IStudentRepository";
import Student from "../../models/Student";
import { GetParamsType } from "../../types/types";
import mongoose from "mongoose";
import { StudentSearchQueryDTO } from "../../dto/StudentDTO";
import { StudentProfileEntityType } from "../../types/StudentType";
class StudentRepository
  extends BaseRepository<StudentProfileEntityType>
  implements IStudentRepository
{
  constructor() {
    super(Student);
  }

  async createStudentProfile(
    data: StudentProfileEntityType
  ): Promise<StudentProfileEntityType> {
    try {
      return await this.create({
        classId: new mongoose.Types.ObjectId(data.classId),
        userId: new mongoose.Types.ObjectId(data.userId),
        schoolId: new mongoose.Types.ObjectId(data.schoolId),
        ...data,
      });
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error("Error creating user");
    }
  }




  async getStudentsBySchool(
    {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      statusFilter,
      classFilter,
    }: StudentSearchQueryDTO,
    schoolId: string
  ): Promise<StudentProfileUserEntityType[]> {
    try {
      const skip = ((page as number) - 1) * (limit as number);

      const matchQuery: any = {};

      if (search) {
        matchQuery.fullName = { $regex: search, $options: "i" };
      }

      if (statusFilter) {
        matchQuery["user.status"] = statusFilter;
      }

      if (classFilter && classFilter.length != 0) {
        matchQuery.class = { $in: [...classFilter] };
      }

      const students = await Student.aggregate([
        {
          $match: {
            schoolId: new mongoose.Types.ObjectId(schoolId),
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $match: matchQuery,
        },
        {
          $addFields: {
            classField: { $toInt: "$class" },
          },
        },
        {
          $sort: {
            classField: -1,
          },
        },
        { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
        { $skip: skip },
        { $limit: limit as number },
      ]);

      return students;
    } catch (error) {
      console.error("Error fetching student data", error);
      throw new Error("Error fetching student data");
    }
  }

  async findStudentsCountBySchool(schoolId: string): Promise<number> {
    try {
      return await Student.countDocuments({
        schoolId: new mongoose.Types.ObjectId(schoolId),
      });
    } catch (error) {
      console.error("Error fetching students cound", error);
      throw new Error("Error fetching students count");
    }
  }

  async getStudentById(
    userId: string
  ): Promise<StudentProfileUserEntityType | null> {
    try {
      const student = await Student.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
      ]);
      console.log(student, "this stuuuuuu 123")

      return {
        ...student[0],
        user: {
          ...student[0].user[0],
        },
      };
    } catch (error) {
      console.error("Error fetching student data", error);
      throw new Error("Error creating user");
    }
  }

  async getStudents(query: any, schoolId: string): Promise<any> {
    let matchQuery = {
      schoolId: new mongoose.Types.ObjectId(),
    };

    if (query && Object.keys(query).length > 0) {
      matchQuery = {
        ...matchQuery,
        ...query,
      };
    }

    const students = await Student.aggregate([
      {
        $match: {
          ...query,
          schoolId: new mongoose.Types.ObjectId(schoolId),
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          fullName: 1,
          class: 1,
          roll: 1,
          section: 1,
          classId: 1,
          profilePhoto: 1,
          schoolId: 1,
          createdAt: 1,
          user: {
            _id: "$userDetails._id",
            email: "$userDetails.email",
            status: "$userDetails.status",
          },
        },
      },
      {
        $sort: {
          roll: 1,
        },
      },
    ]);

    return students;
  }

  async getStudent(query: any): Promise<StudentProfileEntityType | null> {
    try {
      const student = await this.findByQuery({ ...query });

      return student[0];
    } catch (error) {
      console.error("Error fetching student data", error);
      throw new Error("Error creating user");
    }
  }

  async updateStudentProfile(
    profileId: string,
    data: StudentProfileEntityType
  ): Promise<StudentProfileEntityType> {
    try {
      const updateStudent = await this.update(profileId, data);

      return updateStudent as StudentProfileEntityType;
    } catch (err) {
      console.error("Error fetching student data", err);
      throw new Error("Error creating user");
    }
  }

  async studentCountBySchool(schoolId: string): Promise<number> {
    try {
      return await this.countDocuments({
        schoolId: new mongoose.Types.ObjectId(schoolId),
      });
    } catch (error) {
      console.error("Error fetching student count", error);
      throw new Error("Error fetching student count");
    }
  }
}

export default new StudentRepository();
