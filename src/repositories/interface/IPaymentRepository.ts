import { PaymentEntityType } from "../../types/types"

export interface IPaymentRepository {
    createPayment(data: PaymentEntityType): Promise<PaymentEntityType>
    fetchPaymentsByInvoiceId(invoiceId: string): Promise<PaymentEntityType[]>
}