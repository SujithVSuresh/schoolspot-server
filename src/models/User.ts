import mongoose, {Schema} from "mongoose";
import { UserType } from "../types/types";


const User = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
        unique: false
    },
    role: {
        type: String,
        required: true,
        enum: ['superadmin', 'admin', 'teacher', 'student']
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'deleted', 'blocked'],
        default: 'inactive'
    }
}, {
    timestamps: true
})

export default mongoose.model<UserType>('User', User, "Users")

