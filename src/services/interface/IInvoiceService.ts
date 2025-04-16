import { CreateInvoiceDTO, InvoiceResponseDTO } from "../../dto/InvoiceDTO";

export interface IInvoiceService {
    createInvoice(data: CreateInvoiceDTO): Promise<{classId: string}>;
    findInvoicesByClassId(classId: string): Promise<InvoiceResponseDTO[]>
    findInvoicesByStudentId(studentId: string): Promise<InvoiceResponseDTO[]>
}