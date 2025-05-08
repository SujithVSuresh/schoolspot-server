import { CreateConversationDTO, ConversationResponseDTO, CreateMessageDTO, ConversationListResponseDTO, MessageWithSenderResponseDTO } from "../../dto/ChatDTO"

export interface IChatService{
    createConversation(data: CreateConversationDTO): Promise<ConversationResponseDTO>
    getConversations(subjectId?: string, userId?: string): Promise<ConversationListResponseDTO[]>
    createMessage(data: CreateMessageDTO): Promise<MessageWithSenderResponseDTO>
    getMessagesByConversation(conversationId: string): Promise<MessageWithSenderResponseDTO[]>
}

