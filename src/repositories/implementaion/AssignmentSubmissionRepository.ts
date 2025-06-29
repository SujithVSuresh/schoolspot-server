import AssignmentSubmission from "../../models/AssignmentSubmission";
import { BaseRepository } from "./BaseRepository";
import {
  AssignmentSubmissionEntityType,
  AssignmentSubmissionStudentEntityType,
} from "../../types/types";
import { IAssignmentSubmissionRepository } from "../interface/IAssignmentSubmissionRepository";
import mongoose from "mongoose";

class AssignmentSubmissionRepository
  extends BaseRepository<AssignmentSubmissionEntityType>
  implements IAssignmentSubmissionRepository
{
  constructor() {
    super(AssignmentSubmission);
  }

  async getAssignmentSubmissions(
    assignmentId: string
  ): Promise<AssignmentSubmissionStudentEntityType[]> {
    const assignmentSubmissions = await AssignmentSubmission.aggregate([
      {
        $match: {
          assignmentId: new mongoose.Types.ObjectId(assignmentId),
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "studentId",
          foreignField: "userId",
          as: "student",
        },
      },
      { $unwind: "$student" }
    ]);

    return assignmentSubmissions;
  }

  async getAssignmentSubmission(assignmentId: string, userId: string): Promise<AssignmentSubmissionStudentEntityType | null> {

    const assignmentSubmission = await AssignmentSubmission.aggregate([
      {
        $match: {
          assignmentId: new mongoose.Types.ObjectId(assignmentId),
          studentId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "studentId",
          foreignField: "userId",
          as: "student",
        },
      },
      { $unwind: "$student" }
    ]);

    return assignmentSubmission.length > 0 ? assignmentSubmission[0] : null;
  }


  async getAssignmentSubmissionById(submissionId: string): Promise<AssignmentSubmissionStudentEntityType | null> {

    const assignmentSubmission = await AssignmentSubmission.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(submissionId)
        }
      },
      {
        $lookup: {
          from: "Students",
          localField: "studentId",
          foreignField: "userId",
          as: "student",
        },
      },
      { $unwind: "$student" }
    ]);

    return assignmentSubmission.length > 0 ? assignmentSubmission[0] : null;
  }

  async addAssignmentSubmission(submissionId: string, data: any): Promise<AssignmentSubmissionEntityType  | null> {
    const assignmentSubmission = await this.update(submissionId, data)
    return assignmentSubmission;
  }

  async fetchPendingSubmissions(userId: string): Promise<AssignmentSubmissionEntityType[]> {
    console.log("Fetching pending submissions for user:", userId);
    const pendingSubmissions = await AssignmentSubmission.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(userId),
          status: "Pending"
        }
      },
      {
        $lookup: {
          from: "Assignments",
          localField: "assignmentId",
          foreignField: "_id",
          as: "assignmentId"
        },
      },
      { $unwind: "$assignmentId" }
    ])

    console.log("gagagagaga", pendingSubmissions);

    return pendingSubmissions
}
}

export default new AssignmentSubmissionRepository();
