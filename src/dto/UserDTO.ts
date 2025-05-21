import mongoose from "mongoose";

export interface CreateUserDTO {
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "teacher" | "student";
  status: "active" | "inactive" | "deleted" | "blocked";
  schoolId: mongoose.Types.ObjectId | string;
  authProvider: "google" | "email";
}

export interface UserResponseDTO {
  _id?: string;
  email: string;
  role: "superadmin" | "admin" | "teacher" | "student";
  status: "active" | "inactive" | "deleted" | "blocked";
  schoolId: string;
  authProvider: "google" | "email";
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
