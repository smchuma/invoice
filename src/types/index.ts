export interface LineItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerTIN?: string;
  customerVRN?: string;
  lineItems: LineItem[];
  paymentMethod: string;
  subtotal: number;
  vatEnabled: boolean;
  vatAmount: number;
  total: number;
  terms?: string;
  notes?: string;
  createdAt: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  poBox: string;
  phone1: string;
  phone2: string;
  email: string;
  website: string;
  logoUrl?: string;
  defaultTerms: string;
  primaryColor: string;
  nextInvoiceNumber: number;
}

export type PaymentMethod = 'Cash' | 'M-Pesa' | 'Mixx by Yas' | 'Bank Transfer' | 'Cheque';

export type AppView = 'form' | 'list' | 'settings' | 'view';
