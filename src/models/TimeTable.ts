import mongoose from "mongoose";
import { TimeTableEntityType } from "../types/TimeTableType";

const ClassTimetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    timetable: [
      {
        day: {
          type: String,
          required: true,
        },
        periods: [
          {
            subject: {
              type: String,
              required: true,
              trim: true,
            },
            startTime: {
              type: String,
              required: true,
              trim: true,
            },
            endTime: {
              type: String,
              required: true,
              trim: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<TimeTableEntityType>("ClassTimetable", ClassTimetableSchema, "ClassTimetables");
