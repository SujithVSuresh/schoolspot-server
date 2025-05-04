import mongoose from "mongoose";
import { UserEntityType } from "./types";


export interface ConversationEntityType {
    _id?: mongoose.Types.ObjectId | string;
    isGroup: boolean;
    participants: mongoose.Types.ObjectId[] | string[]; 
    name?: string;
    createdBy: mongoose.Types.ObjectId | string; 
    lastMessage?: mongoose.Types.ObjectId | MessageEntityType; 
    subjectId: mongoose.Types.ObjectId | string; 
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface MessageEntityType {
    _id?: mongoose.Types.ObjectId | string;
    conversationId: mongoose.Types.ObjectId | string;
    senderId: mongoose.Types.ObjectId | UserEntityType | string;
    messageType: "text" | "file";
    content: string;
    readBy?: mongoose.Types.ObjectId[] | string[];
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface MessageWithUserEntityType {
    _id?: mongoose.Types.ObjectId | string;
    conversationId: mongoose.Types.ObjectId | string;
    senderId: UserEntityType
    messageType: "text" | "file";
    content: string;
    readBy?: mongoose.Types.ObjectId[] | string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
