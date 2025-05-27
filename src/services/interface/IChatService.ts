import { CreateConversationDTO, ConversationResponseDTO, CreateMessageDTO, ConversationListResponseDTO, MessageWithSenderResponseDTO, UpdateConversationDTO } from "../../dto/ChatDTO"

export interface IChatService{
    createConversation(data: CreateConversationDTO): Promise<ConversationResponseDTO>
    updateConversation(id: string, data: UpdateConversationDTO): Promise<ConversationResponseDTO>
    deleteConversation(id: string, userId: string): Promise<{ _id: string; }> 
    getConversations(subjectId?: string, userId?: string): Promise<ConversationListResponseDTO[]>
    createMessage(data: CreateMessageDTO, file: Express.Multer.File): Promise<MessageWithSenderResponseDTO>
    deleteMessage(messageId: string, userId: string): Promise<{_id: string}>
    getMessagesByConversation(conversationId: string): Promise<MessageWithSenderResponseDTO[]>
}

