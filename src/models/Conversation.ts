import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    isGroup: {
      type: Boolean,
      default: false,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    name: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<any>("Conversation", ConversationSchema, "Conversations");
