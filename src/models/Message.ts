// {
//     _id: ObjectId,
//     conversationId: ObjectId, // reference to Conversations
//     senderId: ObjectId, // user ID
//     messageType: String, // "text", "image", "video", etc.
//     content: String, // actual text or media URL
//     createdAt: Date,
//     readBy: [ObjectId] // user IDs who have read this message
//   }

import mongoose, { Schema } from "mongoose";

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
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("Message", MessageSchema, "Messages");
