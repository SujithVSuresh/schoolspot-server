import { Request, Response, NextFunction } from "express";

export interface IInvoiceController {
    createInvoice(req: Request, res: Response, next: NextFunction): Promise<void>;
    findInvoicesByClassId(req: Request, res: Response, next: NextFunction): Promise<void>;
    findInvoicesByStudentId(req: Request, res: Response, next: NextFunction): Promise<void>;
}