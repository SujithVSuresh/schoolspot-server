import { Request, Response, NextFunction } from "express";
import { IInvoiceService } from "../../services/interface/IInvoiceService";
import { IInvoiceController } from "../interface/IInvoiceController";
import { CreateInvoiceDTO } from "../../dto/InvoiceDTO";
import { CustomRequest } from "../../types/types";



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
}