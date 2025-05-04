import { CreateConversationDTO, ConversationResponseDTO, CreateMessageDTO, ConversationListResponseDTO, MessageListResponseDTO } from "../../dto/ChatDTO"

export interface IChatService{
    createConversation(data: CreateConversationDTO): Promise<ConversationResponseDTO>
    getConversations(subjectId?: string, userId?: string): Promise<ConversationListResponseDTO[]>
    createMessage(data: CreateMessageDTO): Promise<CreateMessageDTO>
    getMessagesByConversation(conversationId: string): Promise<MessageListResponseDTO[]>
}