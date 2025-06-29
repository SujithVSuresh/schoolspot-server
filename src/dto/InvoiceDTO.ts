


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

export interface InvoiceByClassResponseDTO {
  _id: string;
  title: string;
  student: {
    fullName: string;
    userId: string
  };
  class: string
  invoiceNumber: string;
  dueDate: Date;
  status: 'Unpaid' | 'Paid';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceDetailsResponseDTO {
  _id: string;
  title: string;
  student: {
    _id: string;
    fullName: string;
    email: string;
    contactNumber: string;
  };
  school: {
    _id: string;
    schoolName: string;
    address: {
      city: string;
      state: string;
    }
  };
  class: {
    _id: string;
    name: string;
    section: string;
  };
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