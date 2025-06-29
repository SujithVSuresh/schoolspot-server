import mongoose, { Schema } from "mongoose";
import { AttendanceEntityType } from "../types/AttendanceType";

const AttendanceSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "School",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AttendanceEntityType>(
  "Attendance",
  AttendanceSchema,
  "Attendances"
);
