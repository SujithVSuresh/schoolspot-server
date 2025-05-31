import mongoose from 'mongoose';
import { ChapterEntityType } from '../types/ChapterType';

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  classGrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  }
}, {
    timestamps: true
});

export default mongoose.model<ChapterEntityType>('Chapter', ChapterSchema, 'Chapters');
