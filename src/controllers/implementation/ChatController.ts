import { Request, Response, NextFunction } from "express";
import { IChatService } from "../../services/interface/IChatService";
import { IChatController } from "../interface/IChatController";
import { CreateConversationDTO, CreateMessageDTO, UpdateConversationDTO } from "../../dto/ChatDTO";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest, PayloadType } from "../../types/types";


class ChatController implements IChatController {
    constructor(
       private _chatService: IChatService
    ){}

    async createConversation(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body
            const {userId} = req.user as PayloadType

            const conversation: CreateConversationDTO = {
                name: data.name,
                isGroup: data.isGroup,
                createdBy: userId,
                subjectId: data.subjectId,
                participants: [...data.participants, userId],
            }

            const response = await this._chatService.createConversation(conversation)

            res.status(HttpStatus.CREATED).json(response)
        }catch(err){
            next(err)
        }
    }

    async deleteConversation(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.user as PayloadType

            const {conversationId} = req.params

            const response = await this._chatService.deleteConversation(conversationId, userId)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }        
    }

    
    async updateConversation(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body
            const {userId} = req.user as PayloadType

            const {conversationId} = req.params

            const conversation: UpdateConversationDTO = {
                name: data.name,
                participants: [...data.participants, userId],
            }

            const response = await this._chatService.updateConversation(conversationId, conversation)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async fetchConversationsBySubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {subjectId} = req.params

            const response = await this._chatService.getConversations(subjectId, "")

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async fetchConversationsByParticipant(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.user as PayloadType

            const response = await this._chatService.getConversations("", userId)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async createMessage(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.user as PayloadType
            const data = req.body

            const message: CreateMessageDTO = {
                conversationId: data.conversationId,
                senderId: userId,
                messageType: data.messageType
            }

            if(data.content){
                message.content = data.content
            }

            const response = await this._chatService.createMessage(message, req.file as Express.Multer.File)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }


    async deleteMessage(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.user as PayloadType
            const {messageId} = req.params

            const response = await this._chatService.deleteMessage(messageId, userId)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async fetchMessagesByConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {conversationId} = req.params

            const response = await this._chatService.getMessagesByConversation(conversationId)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }
    
}

export default ChatController
