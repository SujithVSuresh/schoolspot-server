import mongoose from "mongoose";

export interface BaseUser {
    email: string;
    role: "superadmin" | "admin" | "teacher" | "student";
    status: "active" | "inactive" | "deleted" | "blocked";
    createdAt?: Date;
    updatedAt?: Date;
}


export interface UserType extends BaseUser {
    _id?: mongoose.Types.ObjectId;
    password?: string;
}

export interface UserResponseType extends BaseUser {
    _id?: string;
    accessToken?: string;
    refreshToken?: string;
}

export interface BaseAdminProfileType {
    fullName: string;
    phoneNumber: string;
    role: "principal" | "it_admin" | "vice_principal" | "other";
    userId: mongoose.Types.ObjectId;
    schoolId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface AdminProfileType extends BaseAdminProfileType {
    _id?: mongoose.Types.ObjectId;

}

export interface AdminProfileResponseType extends BaseAdminProfileType {
    _id?: string;

}


export interface PayloadType {
    userId: string,
    role: string,
    iat: number
    exp?: number
}


export interface StudentProfileType {
    _id?: mongoose.Types.ObjectId;
    fullName: string;
    class: string;
    section: string;
    profilePhoto: string;
    gender: "male" | "female";
    dob: Date;
    address: string;
    fatherName: string;
    motherName: string;
    contactNumber: string;
    schoolId?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
}

export interface StudentUserProfileType extends StudentProfileType {
    email: string,
    password?: string
}

export interface GetParamsType {
    page?: number,
    limit?: number
}

