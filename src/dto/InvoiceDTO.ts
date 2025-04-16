


export interface CreateInvoiceDTO {
  title: string;
  class: string;
  school: string;
  dueDate: Date;
  feeBreakdown?: {
    feeType: string;
    amount: number;
  }[];
  totalAmount: number;
  remarks?: string;
}

export interface InvoiceResponseDTO {
    _id: string;
    title: string;
    student: string;
    class: string
    invoiceNumber: string;
    dueDate: Date;
    feeBreakdown?: {
      feeType: string;
      amount: number;
    }[];
    status: 'Unpaid' | 'Paid';
    totalAmount: number;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}