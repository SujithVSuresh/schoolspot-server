import { Request, Response, NextFunction } from "express";

export interface IInvoiceController {
    createInvoice(req: Request, res: Response, next: NextFunction): Promise<void>;
    findInvoicesByClassId(req: Request, res: Response, next: NextFunction): Promise<void>;
    findInvoicesByStudentId(req: Request, res: Response, next: NextFunction): Promise<void>;
    createInvoiceSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    stripeWebhookHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    findInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
