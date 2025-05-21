import mongoose from "mongoose";


export interface UserEntityType {
      _id?: mongoose.Types.ObjectId | string;
      password?: string;
      email: string;
      role: "superadmin" | "admin" | "teacher" | "student";
      status: "active" | "inactive" | "deleted" | "blocked";
      schoolId: mongoose.Types.ObjectId | string;
      authProvider: "google" | "email"
      createdAt?: Date;
      updatedAt?: Date;
}