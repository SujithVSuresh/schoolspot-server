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
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" }
    ]);

    return assignmentSubmissions;
  }
}

export default new AssignmentSubmissionRepository();
