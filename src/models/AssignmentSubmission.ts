import mongoose, {Schema} from "mongoose";
import { AssignmentSubmissionEntityType } from "../types/types";

const AssignmentSubmissionSchema = new Schema(
    {
      assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Assignment",
      },
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "School",
      },
      description: {
        type: String
      },
      link: {
        type: String
      },
      fileUrl: {
        type: String,
      },
      grade: {
        type: String,
      },
      feedback: {
        type: String,
      },
      status: {
        type: String,
        enum: ["Pending", "Submitted", "Graded"],
        default: "Pending",
      },
    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model<AssignmentSubmissionEntityType>('AssignmentSubmission', AssignmentSubmissionSchema, 'AssignmentSubmissions')