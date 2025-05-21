import mongoose, { Schema } from "mongoose";

const StudentEnrollmentSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
    rollNumber: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>(
  "StudentEnrollment",
  StudentEnrollmentSchema,
  "StudentEnrollments"
);
