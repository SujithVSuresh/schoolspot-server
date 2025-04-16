import mongoose, { Schema } from "mongoose";
import { ClassEntityType } from "../types/types";
import { LeaveLetterEntityType } from "../types/types";

const LeaveLetterSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
      schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
      },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<LeaveLetterEntityType>(
  "LeaveLetter",
  LeaveLetterSchema,
  "LeaveLetters"
);
