import mongoose from "mongoose";

export interface UserType {
    _id?: mongoose.Types.ObjectId;
    email: string;
    password?: string;
    role: "superadmin" | "admin" | "teacher" | "student";
    status: "active" | "inactive" | "deleted";
    createdAt?: Date;
    updatedAt?: Date;
}
