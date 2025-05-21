import { CreateInvoiceDTO, InvoiceByClassResponseDTO, InvoiceDetailsResponseDTO, InvoiceResponseDTO } from "../../dto/InvoiceDTO";
import Stripe from "stripe";

export interface IInvoiceService {
    createInvoice(data: CreateInvoiceDTO, studentIds: string[]): Promise<{classId: string}>;
    findInvoicesByClassId(classId: string): Promise<InvoiceByClassResponseDTO[]>
    findInvoicesByStudentId(studentId: string): Promise<InvoiceResponseDTO[]>
    createInvoiceSession(invoiceId: string, amount: number): Promise<Stripe.Checkout.Session>
    handleStripeEvent(event: Stripe.Event): Promise<string>
    findInvoiceById(invoiceId: string): Promise<InvoiceDetailsResponseDTO>
    deleteInvoice(invoiceId: string): Promise<{_id: string}>
}