import { BaseRepository } from "./BaseRepository";
import { StudentEntityType } from "../../types/StudentType";
import { IStudentRepository } from "../interface/IStudentRepository";
import Student from "../../models/Student";
import mongoose from "mongoose";
import { StudentSearchQueryDTO } from "../../dto/StudentDTO";


class StudentRepository
  extends BaseRepository<StudentEntityType>
  implements IStudentRepository
{
  constructor() {
    super(Student);
  }

  async createStudentProfile(
    data: StudentEntityType
  ): Promise<StudentEntityType> {
    try {
      return await this.create({
        ...data,
        userId: new mongoose.Types.ObjectId(data.userId as string),
        schoolId: new mongoose.Types.ObjectId(data.schoolId),
      });
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error("Error creating user");
    }
  }


    async getStudent(query: any): Promise<StudentEntityType | null> {
    try {
      const student = await this.findByQuery({ ...query });

      return student[0];
    } catch (error) {
      console.error("Error fetching student data", error);
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
    }: StudentSearchQueryDTO,
    schoolId: string
  ): Promise<StudentEntityType[]> {
    try {
      const skip = ((page as number) - 1) * (limit as number);

      const matchQuery: any = {};

      if (search) {
        matchQuery.fullName = { $regex: search, $options: "i" };
      }

      if (statusFilter) {
        matchQuery["userId.status"] = statusFilter;
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
            as: "userId",
          },
        },
        { $unwind: "$userId" },
        {
          $match: matchQuery,
        },
        // {
        //   $addFields: {
        //     classField: { $toInt: "$class" },
        //   },
        // },
        // {
        //   $sort: {
        //     classField: -1,
        //   },
        // },
        { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
        { $skip: skip },
        { $limit: limit as number },
      ]);

      console.log("gagaga", students)

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

  async getStudentById(userId: string): Promise<StudentEntityType | null> {
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
            as: "userId",
          },
        },
      ]);

      return {
        ...student[0],
        userId: {
          ...student[0].userId[0],
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



  async updateStudentProfile(
    profileId: string,
    data: StudentEntityType
  ): Promise<StudentEntityType> {
    try {
      const updateStudent = await this.update(profileId, data);

      return updateStudent as StudentEntityType;
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
