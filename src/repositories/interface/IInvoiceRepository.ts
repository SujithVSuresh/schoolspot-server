import { InvoiceDetailsEntityType, InvoiceWithUserEntityType, InvoiceEntityType } from "../../types/types";



export interface IInvoiceRepository {
    createInvoice(data: InvoiceEntityType[]): Promise<InvoiceEntityType[]>;
    deleteInvoice(invoiceId: string): Promise<boolean | null>
    updateInvoiceStatus(invoiceId: string, status: "Paid" | "Unpaid"): Promise<InvoiceEntityType | null>
    findInvoicesByQuery(query: any): Promise<InvoiceEntityType[]>;
    findInvoicesByStudentId(studentId: string, classId: string): Promise<InvoiceEntityType[]>;
    findInvoicesByClassId(classId: string): Promise<InvoiceWithUserEntityType[]>
    findInvoiceById(invoiceId: string): Promise<InvoiceDetailsEntityType | null>
    findInvoiceByNumber(invoiceNumber: string): Promise<InvoiceEntityType | null>
}