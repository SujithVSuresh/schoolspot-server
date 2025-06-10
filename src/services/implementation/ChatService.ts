import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateConversationDTO, ConversationResponseDTO, ConversationListResponseDTO, CreateMessageDTO, MessageWithSenderResponseDTO, UpdateConversationDTO } from "../../dto/ChatDTO";
import { IConversationRepository } from "../../repositories/interface/IConversationRepository";
import { IMessageRepository } from "../../repositories/interface/IMessageRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { ConversationEntityType, ConversationStatusType } from "../../types/ChatType";
import { CustomError } from "../../utils/CustomError";
import { IChatService } from "../interface/IChatService";
import { INotificationService } from "../interface/INotificationService";
import { MessageStatusType } from "../../types/ChatType";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse } from "cloudinary";


export class ChatService implements IChatService {
    constructor(
       private _conversationRepository: IConversationRepository,
       private _messageRepository: IMessageRepository,
       private _userRepository: IUserRepository,
       private _notificationService: INotificationService
    ){}

    async createConversation(data: CreateConversationDTO): Promise<ConversationResponseDTO> {

        const conversation = await this._conversationRepository.createConversation(data)

        return {
            _id: String(conversation._id),
            name: conversation.name,
            isGroup: conversation.isGroup,
            status: conversation.status as ConversationStatusType,
            subjectId: String(conversation.subjectId),
            createdBy: String(conversation.createdBy),
            createdAt: conversation.createdAt as Date,
            participants: conversation.participants.map((item) => item.toString())
        }
    }


    async updateConversation(id: string, data: UpdateConversationDTO): Promise<ConversationResponseDTO> {
        const conversation = await this._conversationRepository.updateConversation(id, data)

        if(!conversation){
            throw new CustomError(Messages.CONVERSATION_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(conversation._id),
            name: conversation.name,
            isGroup: conversation.isGroup,
            status: conversation.status as ConversationStatusType,
            subjectId: String(conversation.subjectId),
            createdBy: String(conversation.createdBy),
            createdAt: conversation.createdAt as Date,
            participants: conversation.participants.map((item) => item.toString())

        }
    }

    async deleteConversation(id: string, userId: string): Promise<{ _id: string; }> {

        const conversation = await this._conversationRepository.findConversationById(id)

        if(!conversation){
            throw new CustomError(Messages.CONVERSATION_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if(String(conversation.createdBy) != userId){
            throw new CustomError(Messages.CANNOT_DELETE_CONVERSATION, HttpStatus.UNAUTHORIZED)
        }

        const response = await this._conversationRepository.deleteConversation(id)

        return {
            _id: String(response?._id) as string
        }
    }

    async getConversations(subjectId?: string, userId?: string): Promise<ConversationListResponseDTO[]> {

        if(!subjectId && !userId){
            throw new CustomError(Messages.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        const response = await this._conversationRepository.findConversations(subjectId, userId)

        const conversations: ConversationListResponseDTO[] = response.map((conversation: any) => {
            return {
                _id: String(conversation._id),
                isGroup: conversation.isGroup,
                name: conversation.name,
                participants: conversation.participants.map((userId: any) => String(userId)),
                subjectId: String(conversation.subjectId),
                status: conversation.status,
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


    async createMessage(data: CreateMessageDTO, file: Express.Multer.File): Promise<MessageWithSenderResponseDTO> {


        if(!data.content && !file){
            throw new CustomError(Messages.INVALID_MESSAGE_DATA, HttpStatus.BAD_REQUEST)
        }

           let fileUrl
        
            if (file) {
              console.log("Uploading file to Cloudinary...");
        
              const originalName = file.originalname;
              const fileNameWithoutExt = originalName.split(".").slice(0, -1).join(".");
        
              const uploadResult: UploadApiResponse = await new Promise(
                (resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream(
                    {
                      folder: "chat",
                      resource_type: "raw",
                      public_id: `${fileNameWithoutExt}_${Date.now()}.pdf`
                    },
                    (error, result) => {
                      if (error) {
                        console.error("Cloudinary error:", error);
                        reject(error);
                      } else if (result) {
                        console.log("Upload succeeded, result:", result);
                        resolve(result);
                      } else {
                        reject(new Error("Cloudinary upload failed"));
                      }
                    }
                  );
                  stream.end(file.buffer);
                }
              );
        
              fileUrl = uploadResult.secure_url;
            }
        
            if (fileUrl) {
              data.fileUrl = fileUrl;
            }

            console.log(fileUrl, "file url")
            console.log(data, "message data")

        const message = await this._messageRepository.createMessage(data)

        console.log(message, "message created")

        const updateLastMessage = await this._conversationRepository.updateConversation(String(message.conversationId), {
            lastMessage: message
        })

        if(!updateLastMessage){
            throw new CustomError(Messages.CONVERSATION_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const user = await this._userRepository.findUserById(String(message.senderId))

        if(!user){
            throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        // await this._notificationService.sendNotification({
        //     userId: updateLastMessage.participants
        //         .filter(id => String(id) !== String(user._id))
        //         .map(id => String(id)),
        //     notificationType: "message",
        //     message: message.content
        // })

        return {
            _id: String(message._id),
            conversationId: String(message.conversationId),
            senderId: {
                _id: String(user._id),
                email: user.email,
                role: user.role
            },
            status: message.status as MessageStatusType,
            messageType: message.messageType,
            content: message.content,
            fileUrl: message.fileUrl,
            createdAt: message.createdAt as Date,
            updatedAt: message.updatedAt as Date
        }
    }

    async getMessagesByConversation(conversationId: string): Promise<MessageWithSenderResponseDTO[]> {
        const response = await this._messageRepository.findMessaagesByConversationId(conversationId)

        const messages: MessageWithSenderResponseDTO[] = response.map((message) => {
            return {
                _id: String(message._id),
                conversationId: String(message.conversationId),
                senderId: {
                    _id: String(message.senderId._id),
                    email: message.senderId.email,
                    role: message.senderId.role
                },
                status: message.status as MessageStatusType,
                messageType: message.messageType,
                content: message.content,
                fileUrl: message.fileUrl,
                createdAt: message.createdAt as Date,
                updatedAt: message.updatedAt as Date
            }
        })

        return messages
    }


    async deleteMessage(messageId: string, userId: string): Promise<{ _id: string; }> {

        const message = await this._messageRepository.findMessageById(messageId)

        const conversation = message?.conversationId as ConversationEntityType;

        if(String(message?.senderId) !== userId && String(conversation.createdBy) !== userId){
            throw new CustomError(Messages.CANNOT_DELETE_MESSAGE, HttpStatus.UNAUTHORIZED)
        }

        console.log("ga")

        const deleteMessage = await this._messageRepository.deleteMessage(messageId)

        if(!deleteMessage){
            throw new CustomError(Messages.MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(deleteMessage._id)
        }
    }


}

export default ChatService