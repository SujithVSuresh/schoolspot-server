import mongoose, { Schema } from "mongoose";
import { AdminProfileType } from "../types/types";

const AnnouncementSchema = new Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    sendTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        }
    ]
}, {
    timestamps: true
})

export default mongoose.model<AdminProfileType>('Announcement', AnnouncementSchema, 'Announcements')
