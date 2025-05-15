import { ConversationEntityType } from "../../types/ChatType"

export interface IConversationRepository {
    createConversation(data: ConversationEntityType): Promise<ConversationEntityType>
    findConversationById(id: string): Promise<ConversationEntityType | null>
    deleteConversation(id: string): Promise<ConversationEntityType | null>
    updateConversation(id: string, data: Partial<ConversationEntityType>): Promise<ConversationEntityType | null>
    findConversations(subjectId?: string, userId?: string): Promise<ConversationEntityType[]>
}