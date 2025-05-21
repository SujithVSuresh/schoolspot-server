import mongoose, { Schema } from "mongoose";
import { StudyMaterialEntityType } from "../types/types";

const StudyMaterialSchema = new Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "School",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<StudyMaterialEntityType>(
  "StudyMaterial",
  StudyMaterialSchema,
  "StudyMaterials"
);
