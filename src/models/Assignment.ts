import mongoose, { Schema } from "mongoose";
import { AssignmentEntityType } from "../types/types";

const AssignmentSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      link: {
        type: String,
      },
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
      dueDate: {
        type: Date,
        required: true,
      },
      submissionType: {
        type: String,
        enum: ["file", "link", "text"],
        required: true,
      }
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<AssignmentEntityType>('Assignment', AssignmentSchema, 'Assignments')
