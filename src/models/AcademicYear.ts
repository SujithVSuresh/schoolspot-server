import mongoose, { Schema } from "mongoose";
import { AcademicYearEntityType } from "../types/AcademicYearType";

const AcademicYearSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "School",
    },
    name: {
        type: String,
        enum: ['2023-24', '2024-25', '2025-26'],
        required: true
    },
    isActive: {
      type: Boolean,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);


export default mongoose.model<AcademicYearEntityType>(
  "AcademicYear",
  AcademicYearSchema,
  "AcademicYears"
);
