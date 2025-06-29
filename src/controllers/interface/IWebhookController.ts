import { NextFunction, Request, Response } from "express";


export interface IWebhookController {
   stripeWebhookHandler(req: Request, res: Response, next: NextFunction): Promise<void>
}