import mongoose from "mongoose";
import ExamResult from "../../models/ExamResult";
import { ExamResultEntityType } from "../../types/ExamType";
import { IExamResultRepository } from "../interface/IExamResultRepository";
import { BaseRepository } from "./BaseRepository";

class ExamResultRepository
  extends BaseRepository<ExamResultEntityType>
  implements IExamResultRepository
{
  constructor() {
    super(ExamResult);
  }

  async upsertExamResult(
    data: ExamResultEntityType[]
  ): Promise<any> {
    try {
      // return await ExamResult.insertMany(data);
      console.log(data, "gagagagaga")
      const bulkOps = data.map((item) => ({
      updateOne: {
        filter: {
          examId: item.examId,
          classId: item.classId,
          studentId: item.studentId,
          subject: item.subject,
        },
        update: {
          $set: {
            marksObtained: item.marksObtained,
            totalMarks: item.totalMarks,
            grade: item.grade,
          },
        },
        upsert: true, 
      },
    }));

    const result = await ExamResult.bulkWrite(bulkOps);
    return result;
    } catch (error) {
      console.error("Error creating exam result", error);
      throw new Error("Error creating exam result");
    }
  }


  async deleteExamResult(id: string): Promise<boolean> {
    try {
      return await this.delete(id);
    } catch (error) {
      console.error("Error updating exam result", error);
      throw new Error("Error updating exam result");
    }
  }

  async findExamResultsByStudent(
    examId: string,
    userId: string
  ): Promise<ExamResultEntityType[]> {
    try {
      console.log(examId, userId, "eeee")
      const examResults = await ExamResult.aggregate([
        {
          $match: {
            examId: new mongoose.Types.ObjectId(examId),
            studentId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "Exams",
            localField: "examId",
            foreignField: "_id",
            as: "examId",
          },
        },
        {
          $unwind: {
            path: "$examId",
          },
        }
      ]);

      console.log(examResults, "gagagagaga123")

      return examResults
    } catch (error) {
      console.error("Error fetching exam result", error);
      throw new Error("Error fetching exam result");
    }
  }

  async findExamResultsBySubjects(examId: string, subject: string): Promise<ExamResultEntityType[]> {
     try {
      console.log(examId, subject, "dadaa")
       const result = await ExamResult.aggregate([
        {
          $match: {
            examId: new mongoose.Types.ObjectId(examId),
            subject: subject
          },
        },
        {
          $lookup: {
            from: "Students",
            localField: "studentId",
            foreignField: "userId",
            as: "studentId",
          },
        },
        {
          $unwind: {
            path: "$studentId",
          },
        }
      ]);

      console.log(result, "lalala")

      return result
    } catch (error) {
      console.error("Error fetching exam results", error);
      throw new Error("Error fetching exam results");
    }
  }
}

export default new ExamResultRepository();
