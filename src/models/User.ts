import mongoose, { Schema } from "mongoose";
import { UserEntityType } from "../types/UserType"; // TypeScript type for the User model

// Define the User schema structure
const User = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
      unique: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["superadmin", "admin", "teacher", "student"], 
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "deleted", "blocked"], 
      default: "inactive",
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<UserEntityType>("User", User, "Users");
