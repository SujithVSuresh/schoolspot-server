import mongoose, {Schema} from "mongoose";

const ClassSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    section: {
        type: String
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    strength: {
        type: Number,
        default: 0
    },
    subjects: [
        {
            name: {
                type: String
            },
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]

}, {
    timestamps: true
})


export default mongoose.model('Class', ClassSchema, 'Classes')
