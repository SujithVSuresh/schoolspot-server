import { NextFunction, Response } from "express";
import { CustomRequest } from "../../types/types";


export interface IPaymentController {
    getPaymentsByInvoiceId(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}