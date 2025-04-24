import { CreatePaymentDTO, PaymentResponseDTO } from "../../dto/PaymentDTO"

export interface IPaymentService {
    findPaymentsByInvoiceId(invoiceId: string): Promise<PaymentResponseDTO[]>
}