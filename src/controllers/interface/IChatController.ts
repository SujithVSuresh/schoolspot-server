import { Request, Response, NextFunction } from "express"

export interface IChatController {
    createConversation(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchConversationsBySubjects(req: Request, res: Response, next: NextFunction): Promise<void>
    createMessage(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchMessagesByConversation(req: Request, res: Response, next: NextFunction): Promise<void>

}