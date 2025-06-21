import { BaseRepository } from "./BaseRepository";
import Class from "../../models/Class";
import { IClassRepository } from "../interface/IClassRepository";
import mongoose from "mongoose";
import { ClassEntityType } from "../../types/ClassType";

class ClassRepository
  extends BaseRepository<ClassEntityType>
  implements IClassRepository
{
  constructor() {
    super(Class);
  }

  async createClass(data: ClassEntityType): Promise<ClassEntityType> {
    try {
      return await this.create({
        name: data.name,
        section: data.section,
        teacher: new mongoose.Types.ObjectId(data.teacher),
        school: new mongoose.Types.ObjectId(data.school),
        academicYear: new mongoose.Types.ObjectId(data.academicYear)
      });
    } catch (error) {
      console.error("Error creating class", error);
      throw new Error("Error creating class");
    }
  }

  async updateClass(classId: string, data: ClassEntityType): Promise<ClassEntityType | null> {
    try{
      return await this.update(classId, {
        ...data,
        teacher: new mongoose.Types.ObjectId(data.teacher)
      })
    }catch(error){
      console.error("Error updating class", error);
      throw new Error("Error updating class");
    }
  }

  async updateClassStrength(classId: string, value: 1 | -1): Promise<boolean> {
    try {
      const result = await Class.updateOne(
        { _id: new mongoose.Types.ObjectId(classId) },
        { $inc: { strength: value } },
      );
  
      return result.modifiedCount > 0;
      
    } catch (error) {
      console.error("Error updating class strength", error);
      throw new Error("Error updating class strength");
    }
  }
  

  async deleteClass(classId: string): Promise<boolean | null> {
    try{
      const response = await this.delete(classId)
      return response
    }catch(error){
      console.error("Error deleting class", error);
      throw new Error("Error deleting class");
    }
  }

  async findClass(data: {
    name: string;
    section: string;
    school: string;
    academicYear: string;
  }): Promise<ClassEntityType | null> {
    try {
      return await this.findOne({
        name: data.name,
        section: data.section,
        school: new mongoose.Types.ObjectId(data.school),
        academicYear: new mongoose.Types.ObjectId(data.academicYear)
      });
    } catch (error) {
      console.error("Error finding class", error);
      throw new Error("Error finding class");
    }
  }

  async findAllClasses(schoolId: string, academicYear: string): Promise<ClassEntityType[]> {
    try {
      const classes = await Class.aggregate([
        {
          $match: {
            school: new mongoose.Types.ObjectId(schoolId),
            academicYear: new mongoose.Types.ObjectId(academicYear)
          }
        },
        {
          $addFields: {
            nameAsNumber: { $toInt: "$name" }
          }
        },
        {
          $sort: { nameAsNumber: 1 }
        }
      ]);

      return classes

    } catch (error) {
      console.error("Error finding classes", error);
      throw new Error("Error finding classes");
    }
  }


  // async findClassByTeacherId(teacherId: string): Promise<ClassEntityType[]> {
  //   try{
  //     const response = await Class.find({ 
  //       subjects: { $elemMatch: { 
  //         teacher: new mongoose.Types.ObjectId(teacherId) 
  //       } } });

  //       console.log(response, "koooooo")

  //       return response;

  //   } catch (error) {
  //     console.error("Error finding classes", error);
  //     throw new Error("Error finding classes");
  //   }
  // }

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

  async findClassCountBySchoolId(schoolId: string): Promise<number> {
    try{
      const count = await this.countDocuments({
        school: new mongoose.Types.ObjectId(schoolId)
      });
      return count;
    }catch (error) {
      console.error("Error finding class count", error);
      throw new Error("Error finding class count");
    }
      
  }

}


export default new ClassRepository();
