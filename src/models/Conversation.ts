import mongoose, { Schema } from "mongoose";
import { ConversationEntityType } from "../types/ChatType";

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
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
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

export default mongoose.model<ConversationEntityType>("Conversation", ConversationSchema, "Conversations");
