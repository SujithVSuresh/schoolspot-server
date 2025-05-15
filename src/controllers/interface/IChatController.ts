import { Request, Response, NextFunction } from "express"

export interface IChatController {
    createConversation(req: Request, res: Response, next: NextFunction): Promise<void>
    updateConversation(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchConversationsBySubjects(req: Request, res: Response, next: NextFunction): Promise<void>
    createMessage(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchMessagesByConversation(req: Request, res: Response, next: NextFunction): Promise<void>

}