import mongoose, {Schema} from "mongoose";


const ChapterSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    gradeLevel: {
        type: String,
        required: true
    },
    section: [
        {
            title: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})


export default mongoose.model<any>('Chapter', ChapterSchema, 'Chapters')
