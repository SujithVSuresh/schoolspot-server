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
          $project: {
            _id: 1,
            name: 1,
            section: 1,
            strength: 1,
            subjects: 1,
            teacher: { $arrayElemAt: ["$teacherData.fullName", 0] },
          },
        },
      ]);
      return classData[0];
    } catch (error) {
      console.error("Error finding classes", error);
      throw new Error("Error finding classes");
    }
  }

  async addSubject(
    data: SubjectEntityType,
    classId: string
  ): Promise<SubjectEntityType | null> {
    try {
      const response = await Class.findOneAndUpdate(
        { _id: classId },
        { $push: { subjects: data } },
        { new: true, fields: { subjects: 1 } }
      );

      const addedSubject = response?.subjects
        ? response?.subjects[response.subjects.length - 1]
        : null;

      return addedSubject;
    } catch (error) {
      console.error("Error adding subject", error);
      throw new Error("Error adding subject");
    }
  }

  async removeSubject(
    subjectId: string,
    classId: string
  ): Promise<string | null> {
    try {
      const response = await Class.findOneAndUpdate(
        { _id: classId },
        { $pull: { subjects: { _id: subjectId } } },
        { new: true }
      );

      return response ? String(response?._id) : null;
    } catch (error) {
      console.error("Error removing subject", error);
      throw new Error("Error removing subject");
    }
  }

  async updateSubject(subjectId: string, classId: string, data:SubjectEntityType): Promise<SubjectEntityType | null> {
    try{
      const response = await Class.findOneAndUpdate(
        { _id: classId, "subjects._id": subjectId },
        { $set: { "subjects.$.name":  data.name, "subjects.$.teacher":  data.teacher} },
        { new: true, fields: { subjects: 1 } }
      );


      const addedSubject = response?.subjects ? {
        ...data,
        _id: new mongoose.Types.ObjectId(subjectId)
      }  : null;

      return addedSubject;

    }catch(error){
      console.error("Error updating subject", error);
      throw new Error("Error updating subject");
  
    }
  }


  async findSubjectByName(subjectName: string, classId: string): Promise<SubjectEntityType | null> {
    try{
      const response = await Class.findOne(
        { _id: classId, "subjects.name": subjectName },
        { "subjects.$": 1 }
      );

      return response?.subjects ? response?.subjects[0] : null;

    }catch(error){
      console.error("Error finding subject", error);
      throw new Error("Error finding subject");
    }
  }

}


export default new ClassRepository();
