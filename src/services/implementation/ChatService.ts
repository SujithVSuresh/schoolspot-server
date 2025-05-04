import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateConversationDTO, ConversationResponseDTO, ConversationListResponseDTO, CreateMessageDTO, MessageResponseDTO, MessageListResponseDTO } from "../../dto/ChatDTO";
import { IConversationRepository } from "../../repositories/interface/IConversationRepository";
import { IMessageRepository } from "../../repositories/interface/IMessageRepository";
import { ConversationEntityType, MessageEntityType } from "../../types/ChatType";
import { CustomError } from "../../utils/CustomError";
import { IChatService } from "../interface/IChatService";


export class ChatService implements IChatService {
    constructor(
       private _conversationRepository: IConversationRepository,
       private _messageRepository: IMessageRepository
    ){}

    async createConversation(data: CreateConversationDTO): Promise<ConversationResponseDTO> {

        const conversation = await this._conversationRepository.createConversation(data)

        return {
            _id: String(conversation._id),
            name: conversation.name,
            isGroup: conversation.isGroup,
            subjectId: String(conversation.subjectId),
            createdBy: String(conversation.createdBy),
            createdAt: conversation.createdAt as Date
        }
    }

    async getConversations(subjectId?: string, userId?: string): Promise<ConversationListResponseDTO[]> {

        if(!subjectId && !userId){
            throw new CustomError(Messages.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        const response = await this._conversationRepository.findConversationsBySubjectId(subjectId, userId)

        const conversations: ConversationListResponseDTO[] = response.map((conversation: any) => {
            return {
                _id: String(conversation._id),
                isGroup: conversation.isGroup,
                name: conversation.name,
                subjectId: String(conversation.subjectId),
                lastMessage: !conversation.lastMessage ? {} :  {
                    content: conversation.lastMessage.content,
                    messageType: conversation.lastMessage.messageType,
                    createdAt: conversation.lastMessage.createdAt
                },
                createdBy: String(conversation.createdBy),
                createdAt: conversation.createdAt
            }
        })

        return conversations
    }


    async createMessage(data: CreateMessageDTO): Promise<MessageResponseDTO> {

        const message = await this._messageRepository.createMessage(data)

        const updateLastMessage = await this._conversationRepository.updateConversation(String(message.conversationId), {
            lastMessage: message
        })

        if(!updateLastMessage){
            throw new CustomError(Messages.CONVERSATION_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(message._id),
            conversationId: String(message.conversationId),
            senderId: String(message.senderId),
            messageType: message.messageType,
            content: message.content,
            createdAt: message.createdAt as Date,
            updatedAt: message.updatedAt as Date
        }
    }

    async getMessagesByConversation(conversationId: string): Promise<MessageListResponseDTO[]> {
        const response = await this._messageRepository.findMessaagesByConversationId(conversationId)

        const messages: MessageListResponseDTO[] = response.map((message) => {
            return {
                _id: String(message._id),
                conversationId: String(message.conversationId),
                senderId: {
                    _id: String(message.senderId._id),
                    email: message.senderId.email,
                    role: message.senderId.role
                },
                messageType: message.messageType,
                content: message.content,
                createdAt: message.createdAt as Date,
                updatedAt: message.updatedAt as Date
            }
        })

        return messages
    }


}

export default ChatService