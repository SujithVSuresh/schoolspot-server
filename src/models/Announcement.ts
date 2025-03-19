import mongoose, { Schema } from "mongoose";
import { AnnouncementEntityType } from "../types/types";

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
    ],
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }

}, {
    timestamps: true
})

export default mongoose.model<AnnouncementEntityType>('Announcement', AnnouncementSchema, 'Announcements')
