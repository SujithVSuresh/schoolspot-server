import { InvoiceEntityType } from "../../types/types";



export interface IInvoiceRepository {
    createInvoice(data: InvoiceEntityType[]): Promise<InvoiceEntityType[]>;
    findInvoicesByQuery(query: any): Promise<InvoiceEntityType[]>;
    findInvoicesByStudentId(studentId: string): Promise<InvoiceEntityType[]>;
}