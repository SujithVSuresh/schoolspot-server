import mongoose, { Schema } from "mongoose";
import { MessageEntityType } from "../types/ChatType";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    }, 
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<MessageEntityType>("Message", MessageSchema, "Messages");
