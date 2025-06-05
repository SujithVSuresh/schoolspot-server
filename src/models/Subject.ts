import mongoose, { Schema } from "mongoose";
import { SubjectEntityType } from "../types/SubjectType";

const SubjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "School",
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<SubjectEntityType>(
  "Subject",
  SubjectSchema,
  "Subjects"
);
