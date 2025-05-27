import mongoose from "mongoose";
import { UserEntityType } from "./types";

export type MessageType = "text" | "file"
export type MessageStatusType = "active" | "deleted";
export type ConversationStatusType = "active" | "deleted";

export interface ConversationEntityType {
    _id?: mongoose.Types.ObjectId | string;
    isGroup: boolean;
    participants: mongoose.Types.ObjectId[] | string[]; 
    name?: string;
    createdBy: mongoose.Types.ObjectId | string; 
    status?: ConversationStatusType;
    lastMessage?: mongoose.Types.ObjectId | MessageEntityType; 
    subjectId: mongoose.Types.ObjectId | string; 
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface MessageEntityType {
    _id?: mongoose.Types.ObjectId | string;
    conversationId: mongoose.Types.ObjectId | string | ConversationEntityType;
    senderId: mongoose.Types.ObjectId | UserEntityType | string;
    messageType: MessageType;
    content?: string;
    fileUrl?: string;
    status?: MessageStatusType
    readBy?: mongoose.Types.ObjectId[] | string[];
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface MessageWithUserEntityType {
    _id?: mongoose.Types.ObjectId | string;
    conversationId: mongoose.Types.ObjectId | string;
    senderId: UserEntityType
    messageType: MessageType;
    content?: string;
    fileUrl?: string;
    status?: MessageStatusType
    readBy?: mongoose.Types.ObjectId[] | string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
