import { ConversationEntityType } from "../../types/ChatType"

export interface IConversationRepository {
    createConversation(data: ConversationEntityType): Promise<ConversationEntityType>
    deleteConversation(id: string): Promise<boolean | null>
    updateConversation(id: string, data: Partial<ConversationEntityType>): Promise<ConversationEntityType | null>
    findConversationsBySubjectId(subjectId?: string, userId?: string): Promise<ConversationEntityType[]>
    // findConversationsByParticipant(userId: string): Promise<ConversationEntityType[]>
}