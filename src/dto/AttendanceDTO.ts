import mongoose from "mongoose";


export interface CreateAttendanceDTO {
    student: mongoose.Schema.Types.ObjectId | string;
    class: mongoose.Schema.Types.ObjectId | string;
    status: "Present" | "Absent";
    recordedBy: mongoose.Schema.Types.ObjectId | string;
    schoolId: mongoose.Schema.Types.ObjectId | string;
}