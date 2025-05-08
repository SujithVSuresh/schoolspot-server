import mongoose from "mongoose";

export interface CreateConversationDTO {
    isGroup: boolean;
    participants: string[]; 
    name?: string;
    subjectId: string;
    createdBy: string; 
}


export interface ConversationResponseDTO {
    _id: string
    isGroup: boolean;
    name?: string;
    subjectId: string;
    createdBy: string; 
    createdAt: Date;
}

export interface ConversationListResponseDTO {
    _id: string
    isGroup: boolean;
    participants?: string[];
    name?: string;
    subjectId: string;
    lastMessage: {
        content: string;
        messageType: "text" | "file",
        createdAt: Date;
    } | {};
    createdBy: string; 
    createdAt: Date;
}


  export interface CreateMessageDTO {
    conversationId: string;
    senderId: string;
    messageType: "text" | "file";
    content: string;
  }

  export interface MessageResponseDTO {
    _id: string;
    conversationId: string;
    senderId: string;
    messageType: "text" | "file";
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface MessageWithSenderResponseDTO {
    _id: string;
    conversationId: string;
    senderId: {
        _id: string;
        email: string;
        role: 'superadmin' | 'admin' | 'teacher' | 'student';
    };
    messageType: "text" | "file";
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }



