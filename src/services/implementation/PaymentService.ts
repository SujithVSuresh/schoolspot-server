import { CreatePaymentDTO, PaymentResponseDTO } from "../../dto/PaymentDTO";
import { IPaymentRepository } from "../../repositories/interface/IPaymentRepository";
import { IPaymentService } from "../interface/IPaymentService";



export class PaymentService implements IPaymentService {
    constructor(
        private paymentRepository: IPaymentRepository
    ){}

    async findPaymentsByInvoiceId(invoiceId: string): Promise<PaymentResponseDTO[]> {
        const payments = await this.paymentRepository.fetchPaymentsByInvoiceId(invoiceId)

        const data: PaymentResponseDTO[] = payments.map((payment) => {
            return {
                _id: String(payment._id),
                student: String(payment.student),
                paymentFor: payment.paymentFor,
                relatedId: String(payment.relatedId),
                amountPaid: payment.amountPaid,
                paymentMethod: payment.paymentMethod,
                transactionId: payment.transactionId,
                paymentDate: payment.paymentDate,
                status: payment.status,
                createdAt: payment.createdAt
                
            }
        })

        return data
    }
}