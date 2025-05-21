import mongoose, { Schema } from "mongoose";
import { AdminProfileEntityType } from "../types/types";


const AdminSchema = new Schema({
    fullName: {
        type: String,
    },
    phoneNumber: {
        type: String,
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

export default mongoose.model<AdminProfileEntityType>('Admin', AdminSchema, 'Admins')
