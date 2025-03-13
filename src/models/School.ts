import mongoose, {Schema} from "mongoose";
import { SchoolProfileType } from "../types/types";

const SchoolProfileSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    email: {type: String},
    phoneNumber: { type: String, required: true },
    regNumber: { type: String, required: true },
    yearEstablished: { type: Number, required: true },
    principalName: { type: String, required: true },
    websiteUrl: { type: String },
    totalStudents: { type: Number, default: 0 },
    totalTeachers: { type: Number, default: 0 },
    board: { type: String, required: true },
    address: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
}, { timestamps: true });

const SchoolProfile = mongoose.model<SchoolProfileType>("School", SchoolProfileSchema, "Schools");
export default SchoolProfile