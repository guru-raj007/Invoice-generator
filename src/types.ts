export interface CompanyDetails {
  name: string;
  tagline: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId: string;
  logoUrl?: string;
}

export interface ClientDetails {
  name: string;
  companyName: string;
  gstin: string;
  pan?: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  phone: string;
  email: string;
}

export interface EventDetails {
  eventName: string;
  eventType: string; // Wedding, Corporate Gala, Live Concert, Product Launch, Birthday, Conference
  venueName: string;
  venueAddress: string;
  startDate: string;
  endDate: string;
  guestCount?: number;
  pocName?: string;
  pocPhone?: string;
}

export interface InvoiceItem {
  id: string;
  category: string;
  description: string;
  sacCode: string;
  quantity: number;
  unit: string; // Days, Units, Hours, Set, Lumpsum
  unitPrice: number;
  amount: number;
}

export type TaxType = 'INTRA_STATE' | 'INTER_STATE';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  documentType: 'TAX_INVOICE' | 'QUOTATION' | 'PROFORMA';
  company: CompanyDetails;
  client: ClientDetails;
  event: EventDetails;
  items: InvoiceItem[];
  taxType: TaxType; // INTRA_STATE: 9% CGST + 9% SGST, INTER_STATE: 18% IGST
  discountAmount: number;
  transportCharges: number;
  labourCharges: number;
  advancePaid: number;
  paymentTerms: string;
  notes: string;
  termsAndConditions: string[];
}
