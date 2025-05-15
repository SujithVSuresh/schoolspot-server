import { NextFunction, Response } from "express";
import { IPaymentService } from "../../services/interface/IPaymentService";
import { IPaymentController } from "../interface/IPaymentController";
import { CreatePaymentDTO } from "../../dto/PaymentDTO";
import { CustomRequest } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";


export class PaymentController implements IPaymentController{
    constructor(
        private _paymentService: IPaymentService
    ){}

    async getPaymentsByInvoiceId(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {invoiceId} = req.params

            const response = await this._paymentService.findPaymentsByInvoiceId(invoiceId as string)

            res.status(HttpStatus.CREATED).json(response)
        }catch(err){
            next(err)
        }
    }
}