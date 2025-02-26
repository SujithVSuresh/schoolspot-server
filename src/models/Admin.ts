import mongoose, { Schema } from "mongoose";
import { AdminProfileType } from "../types/types";

const AdminSchema = new Schema({
    fullName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ['principal', 'it_admin', 'vice_principal', 'other']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    timestamps: true
})

export default mongoose.model<AdminProfileType>('Admin', AdminSchema, 'Admins')
