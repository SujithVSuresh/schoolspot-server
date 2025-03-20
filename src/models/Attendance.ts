import mongoose, { Schema } from "mongoose";
import { AttendaceEntityType } from "../types/types";


const AttendanceSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Class"
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Present'
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "School"
    }

}, {
    timestamps: true
})

export default mongoose.model<AttendaceEntityType>('Attendance', AttendanceSchema, 'Attendances')
