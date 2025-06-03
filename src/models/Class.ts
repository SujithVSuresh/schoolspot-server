import mongoose, { Schema } from "mongoose";
import { ClassEntityType } from "../types/ClassType";

const ClassSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "School",
    },
    strength: {
      type: Number,
      default: 0,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ClassEntityType>("Class", ClassSchema, "Classes");
