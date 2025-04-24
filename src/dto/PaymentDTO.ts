

export interface CreatePaymentDTO {
  student: string; 
  paymentFor: 'Invoice' | 'Subscription';
  relatedId: string; 
  amountPaid: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Online' | 'Bank Transfer';
}

export interface PaymentResponseDTO {
      _id?: string; 
      student: string; 
      paymentFor: 'Invoice' | 'Subscription';
      relatedId: string; 
      amountPaid: number;
      paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Online' | 'Bank Transfer';
      transactionId?: string; 
      paymentDate?: Date;
      status?: 'Success' | 'Failed' | 'Pending';
      createdAt?: Date;
      updatedAt?: Date;
  }