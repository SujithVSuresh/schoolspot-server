import { BaseRepository } from "./BaseRepository";
import Class from "../../models/Class";
import { ClassEntityType, SubjectEntityType } from "../../types/types";
import { IClassRepository } from "../interface/IClassRepository";
import mongoose from "mongoose";

class ClassRepository
  extends BaseRepository<ClassEntityType>
  implements IClassRepository
{
  constructor() {
    super(Class);
  }

  async createClass(data: ClassEntityType): Promise<ClassEntityType> {
    try {
      return await this.create(data);
    } catch (error) {
      console.error("Error creating class", error);
      throw new Error("Error creating class");
    }
  }

  async findClass(data: {
    name: string;
    section: string;
  }): Promise<ClassEntityType | null> {
    try {
      return await this.findOne(data);
    } catch (error) {
      console.error("Error finding class", error);
      throw new Error("Error finding class");
    }
  }

  async findAllClasses(schoolId: string): Promise<ClassEntityType[]> {
    try {
      return await this.findByQuery({
        school: new mongoose.Types.ObjectId(schoolId),
      });

    } catch (error) {
      console.error("Error finding classes", error);
      throw new Error("Error finding classes");
    }
  }


  async findClassByTeacherId(teacherId: string): Promise<ClassEntityType[]> {
    try{
      const response = Class.find({ 
        subjects: { $elemMatch: { 
          teacher: new mongoose.Types.ObjectId(teacherId) 
        } } });

        return response;

    } catch (error) {
      console.error("Error finding classes", error);
      throw new Error("Error finding classes");
    }
  }

  async findClassById(id: string): Promise<ClassEntityType | null> {
    try {
      const classData = await Class.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "Teachers",
            localField: "teacher",
            foreignField: "userId",
            as: "teacherData",
          },
        },
        {
          $lookup: {
            from: "Schools",
            localField: "school",
            foreignField: "_id",
            as: "school",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            section: 1,
            strength: 1,
            teacher: { $arrayElemAt: ["$teacherData.fullName", 0] },
            school: { $arrayElemAt: ["$school.schoolName", 0] },
          },
        },
      ]);
      console.log(classData[0])
      return classData[0];
    } catch (error) {
      console.error("Error finding classes", error);
      throw new Error("Error finding classes");
    }
  }

}


export default new ClassRepository();
