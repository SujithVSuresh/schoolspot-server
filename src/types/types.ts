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


export interface PayloadType {
    userId: string,
    role: string,
    iat: number
    exp?: number
}


export interface LoginResponseType {
    _id: string;
    email: string;
    role: "admin" | "student" | "teacher" | "superadmin";
    status: "active" | "inactive" | "deleted";
    accessToken: string | null;
    refreshToken?: string
    profilePicture?: string;
}
