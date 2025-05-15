import { MessageEntityType, MessageWithUserEntityType } from "../../types/ChatType"

export interface IMessageRepository {
    createMessage(data: MessageEntityType): Promise<MessageEntityType>
    findMessaagesByConversationId(conversationId: string): Promise<MessageWithUserEntityType[]>
    deleteMessage(messageId: string): Promise<MessageEntityType | null>
    findMessageById(messageId: string): Promise<MessageEntityType | null>
}

