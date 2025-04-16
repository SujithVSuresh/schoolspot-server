import { InvoiceEntityType } from "../../types/types";



export interface IInvoiceRepository {
    createInvoice(data: InvoiceEntityType[]): Promise<InvoiceEntityType[]>;
    findInvoicesByQuery(query: any): Promise<InvoiceEntityType[]>;
}