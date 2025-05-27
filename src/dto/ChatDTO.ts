import { MessageType, MessageStatusType, ConversationStatusType } from "../types/ChatType";


export interface CreateConversationDTO {
    isGroup: boolean;
    participants: string[]; 
    name?: string;
    subjectId: string;
    createdBy: string; 
}


export interface UpdateConversationDTO {
    participants: string[]; 
    name: string;
}


export interface ConversationResponseDTO {
    _id: string
    isGroup: boolean;
    name?: string;
    status: ConversationStatusType;
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
    status: ConversationStatusType;
    lastMessage: {
        content: string;
        messageType: MessageType,
        createdAt: Date;
    } | {};
    createdBy: string; 
    createdAt: Date;
}

 

  export interface CreateMessageDTO {
    conversationId: string;
    senderId: string;
    messageType: MessageType;
    content?: string;
    fileUrl?: string;
  }

  export interface MessageResponseDTO {
    _id: string;
    conversationId: string;
    senderId: string;
    messageType: MessageType;
    content?: string;
    fileUrl?: string;
    status: MessageStatusType
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
    messageType: MessageType;
    content?: string;
    fileUrl?: string;
    status: MessageStatusType;
    createdAt: Date;
    updatedAt: Date;
  }



