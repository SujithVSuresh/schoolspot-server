import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
dotenv.config();
import { IInvoiceService } from "../../services/interface/IInvoiceService";
import { IInvoiceController } from "../interface/IInvoiceController";
import { CreateInvoiceDTO } from "../../dto/InvoiceDTO";
import { CustomRequest } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";
import stripe from "../../config/stripe";



export class InvoiceController implements IInvoiceController {
    constructor(
        private _invoiceService: IInvoiceService
    ){}

    async createInvoice(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const schoolId = req.user?.schoolId
            const invoiceData: CreateInvoiceDTO = {
                class: req.body.class,
                school: schoolId as string,
                dueDate: req.body.dueDate,
                title: req.body.title,
                feeBreakdown: req.body.feeBreakdown ? req.body.feeBreakdown : [],
                totalAmount: req.body.totalAmount,
                remarks: req.body.remarks ? req.body.remarks : "",
            }

            const newInvoice = await this._invoiceService.createInvoice(invoiceData)

            res.status(201).json(newInvoice)

        }catch(err){
            next(err)

        }
    }

    async findInvoicesByClassId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const classId = req.params.classId

            const invoices = await this._invoiceService.findInvoicesByClassId(classId)

            res.status(200).json(invoices)

        }catch(err){
            next(err)
        }
    }

    async findInvoicesByStudentId(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const studentId = req.user?.userId

            const invoices = await this._invoiceService.findInvoicesByStudentId(studentId as string)

            res.status(200).json(invoices)

        }catch(err){
            next(err)
        }
    }

    async createInvoiceSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {amount, invoiceId} = req.body

            const session = await this._invoiceService.createInvoiceSession(invoiceId, amount);

            res.status(HttpStatus.OK).json({ url: session.url });

        }catch(err){
            next(err)
        }
    }

    async stripeWebhookHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        const sig = req.headers['stripe-signature']!;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        let event;
        try{
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

            const response = this._invoiceService.handleStripeEvent(event)

            res.status(HttpStatus.OK).json({ invoiceId: response });

        }catch(err){
            next(err)
        }
    }

    async findInvoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {invoiceId} = req.params

        const response = await this._invoiceService.findInvoiceById(invoiceId)

        res.status(HttpStatus.OK).json(response)
    }
}