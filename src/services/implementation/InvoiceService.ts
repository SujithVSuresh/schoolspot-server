import { CreateInvoiceDTO, InvoiceResponseDTO } from "../../dto/InvoiceDTO";
import { IInvoiceService } from "../interface/IInvoiceService";
import { IInvoiceRepository } from "../../repositories/interface/IInvoiceRepository";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { InvoiceEntityType, StudentProfileUserEntityType } from "../../types/types";
import mongoose from "mongoose";



export class InvoiceService implements IInvoiceService {
    constructor(
        private _invoiceRepository: IInvoiceRepository,
        private _studentRepository: IStudentRepository
    ){}

    async createInvoice(data: CreateInvoiceDTO): Promise<{classId: string}> {
        // const invoice = await this._invoiceRepository.createInvoice(data)

        const students = await this._studentRepository.getStudentsByQuery({
            classId: new mongoose.Types.ObjectId(data.class)
        }, data.school)

        const studentInvoices: InvoiceEntityType[] = students.map((student: StudentProfileUserEntityType) => {
            return {
                student: student.user._id,
                title: data.title,
                class: data.class,
                school: data.school,
                invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
                dueDate: data.dueDate,
                feeBreakdown: data.feeBreakdown,
                totalAmount: data.totalAmount,
                status: "Unpaid",
                remarks: data.remarks
            }
        })

        const invoices: InvoiceEntityType[] = await this._invoiceRepository.createInvoice(studentInvoices)

        return {
            classId: String(invoices[0].class)
        }
    }

    async findInvoicesByClassId(classId: string): Promise<InvoiceResponseDTO[]> {
        const invoices: InvoiceEntityType[] = await this._invoiceRepository.findInvoicesByQuery({
            class: new mongoose.Types.ObjectId(classId)
        })

        const invoicesData: InvoiceResponseDTO[] = invoices.map((invoice: InvoiceEntityType) => {
            return {
                _id: String(invoice._id),
                student: String(invoice.student),
                title: invoice.title,
                class: String(invoice.class),
                invoiceNumber: invoice.invoiceNumber,
                dueDate: invoice.dueDate,
                feeBreakdown: invoice.feeBreakdown ? invoice.feeBreakdown : [],
                status: invoice.status,
                totalAmount: invoice.totalAmount,
                remarks: invoice.remarks ? invoice.remarks : "",
                createdAt: invoice.createdAt as Date,
                updatedAt: invoice.updatedAt as Date,
            }
        })

        return invoicesData
    }

    async findInvoicesByStudentId(studentId: string): Promise<InvoiceResponseDTO[]> {
        const invoices: InvoiceEntityType[] = await this._invoiceRepository.findInvoicesByQuery({
            student: new mongoose.Types.ObjectId(studentId)
        })

        const invoicesData: InvoiceResponseDTO[] = invoices.map((invoice: InvoiceEntityType) => {
            return {
                _id: String(invoice._id),
                title: invoice.title,
                student: String(invoice.student),
                class: String(invoice.class),
                invoiceNumber: invoice.invoiceNumber,
                dueDate: invoice.dueDate,
                feeBreakdown: invoice.feeBreakdown ? invoice.feeBreakdown : [],
                status: invoice.status,
                totalAmount: invoice.totalAmount,
                remarks: invoice.remarks ? invoice.remarks : "",
                createdAt: invoice.createdAt as Date,
                updatedAt: invoice.updatedAt as Date,
            }
        })

        return invoicesData
    }
}
