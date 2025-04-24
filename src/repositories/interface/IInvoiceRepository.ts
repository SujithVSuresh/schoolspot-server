import { InvoiceDetailsEntityType, InvoiceEntityType } from "../../types/types";



export interface IInvoiceRepository {
    createInvoice(data: InvoiceEntityType[]): Promise<InvoiceEntityType[]>;
    updateInvoiceStatus(invoiceId: string, status: "Paid" | "Unpaid"): Promise<InvoiceEntityType | null>
    findInvoicesByQuery(query: any): Promise<InvoiceEntityType[]>;
    findInvoicesByStudentId(studentId: string): Promise<InvoiceEntityType[]>;
    findInvoiceById(invoiceId: string): Promise<InvoiceDetailsEntityType | null>
    findInvoiceByNumber(invoiceNumber: string): Promise<InvoiceEntityType | null>
}