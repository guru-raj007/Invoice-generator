import { CompanyDetails, ClientDetails, EventDetails, InvoiceItem, Invoice } from './types';

export const INDIAN_STATES: { code: string; name: string }[] = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '28', name: 'Andhra Pradesh' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh (New)' },
  { code: '38', name: 'Ladakh' },
];

export const SAC_CODES = [
  { code: '998596', name: 'Event Management & Organization Services (Standard)' },
  { code: '998597', name: 'Other Event Organization & Production Services' },
  { code: '998311', name: 'Photography & Videography / Drone Services' },
  { code: '999612', name: 'Sound, Lighting & Stage Production Services' },
  { code: '999613', name: 'Artists, Celebrity & Emcee Management Services' },
  { code: '996331', name: 'Event Hospitality & Catering Services' },
  { code: '998599', name: 'Event Logistics, Security & Manpower Services' },
];

export const DEFAULT_TERMS: string[] = [
  "Payment Terms: 50% advance on signing, 40% 7 days prior to event, 10% on event completion.",
  "Any extra requirements or overtime beyond the scheduled duration will be billed separately.",
  "Uninterrupted 3-phase power supply and venue access permissions must be provided by the client/venue.",
  "Cancellation charges: 50% if cancelled within 15 days; 100% if cancelled within 72 hours of the event.",
  "GST of 18% is applicable under SAC Code 998596 (CGST 9% + SGST 9% for Intra-state or IGST 18% for Inter-state).",
  "Subject to local jurisdiction only."
];

export const DEFAULT_COMPANY: CompanyDetails = {
  name: "MAHAPATHI EVENT ORGANIZERS",
  tagline: "Grand Weddings, Corporate Events, Concerts & Stage Productions",
  gstin: "33AAAAA0000A1Z5",
  pan: "AAAAA0000A",
  address: "Narasingapuram, Palani Mainroad",
  city: "Tiruppur District",
  state: "Tamil Nadu",
  stateCode: "33",
  pincode: "642203",
  phone: "+91 93639 39367, +91 93639 39368",
  email: "mahapathievents@gmail.com",
  website: "www.mahapathievents.com",
  bankName: "State Bank of India",
  accountNumber: "300012345678",
  ifscCode: "SBIN0001234",
  branch: "Tiruppur",
  upiId: "9363939367@upi",
  logoUrl: "./logo.png"
};

export const DEFAULT_CLIENT: ClientDetails = {
  name: "S. Karthikeyan",
  companyName: "Karthik Textile & Garments Ltd",
  gstin: "33AAACK1234E1Z9",
  pan: "AAACK1234E",
  address: "45 Avinashi Road, Near City Center",
  city: "Tiruppur",
  state: "Tamil Nadu",
  stateCode: "33",
  pincode: "641602",
  phone: "+91 98422 11223",
  email: "events@karthiktextiles.com"
};

export const DEFAULT_EVENT: EventDetails = {
  eventName: "Grand Wedding Reception & Musical Night",
  eventType: "Wedding & Musical Extravaganza",
  venueName: "Sri Sakthi Mahal & Convention Centre",
  venueAddress: "Palani Highway, Udumalpet, Tiruppur",
  startDate: "2026-12-20",
  endDate: "2026-12-20",
  guestCount: 650,
  pocName: "Mr. Karthikeyan / Event In-charge",
  pocPhone: "+91 98422 11223"
};

export const DEFAULT_ITEMS: InvoiceItem[] = [
  {
    id: "item-1",
    category: "Stage & Set Decor",
    description: "Main Stage Fabrication (40x24 ft) with Acrylic Ramp, 3D Backdrop & Floral Accent Podiums",
    sacCode: "998596",
    quantity: 1,
    unit: "Set",
    unitPrice: 125000,
    amount: 125000
  },
  {
    id: "item-2",
    category: "Audiovisual & Lighting",
    description: "High-Resolution P2.6 Indoor Curved LED Wall (30x12 ft) with Watchout Multi-Display Server",
    sacCode: "999612",
    quantity: 1,
    unit: "Setup",
    unitPrice: 110000,
    amount: 110000
  },
  {
    id: "item-3",
    category: "Sound Production",
    description: "JBL VTX Line Array System (8 Tops, 4 Subs), Wireless Shure Axient Mics & Soundcraft Digital Mixer",
    sacCode: "999612",
    quantity: 1,
    unit: "Day",
    unitPrice: 65000,
    amount: 65000
  },
  {
    id: "item-4",
    category: "Intelligent Lighting",
    description: "Sharpys (Beam 230), LED Wash Moving Heads, Profile Spotlights, Hazer & GrandMA Console Operator",
    sacCode: "999612",
    quantity: 1,
    unit: "Day",
    unitPrice: 55000,
    amount: 55000
  },
  {
    id: "item-5",
    category: "Artist & Entertainment",
    description: "Celebrity Emcee / Anchor Hosting + Live 4-Piece Instrumental Fusion Band for Gala Evening",
    sacCode: "999613",
    quantity: 1,
    unit: "Evening",
    unitPrice: 150000,
    amount: 150000
  },
  {
    id: "item-6",
    category: "Photography & Videography",
    description: "Cinematic Multi-Camera Setup (3 4K Sony FX3 Cameras, 1 Jib Crane, Live Webcasting & 1 Drone)",
    sacCode: "998311",
    quantity: 1,
    unit: "Day",
    unitPrice: 75000,
    amount: 75000
  },
  {
    id: "item-7",
    category: "Coordination & Management",
    description: "Comprehensive Event Planning, Technical Crew, Security, Hospitality & Floor Coordination Fee",
    sacCode: "998596",
    quantity: 1,
    unit: "Lumpsum",
    unitPrice: 85000,
    amount: 85000
  }
];

export const INITIAL_INVOICE: Invoice = {
  id: "inv-001",
  invoiceNumber: "EVT/2026/089",
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  documentType: "TAX_INVOICE",
  company: DEFAULT_COMPANY,
  client: DEFAULT_CLIENT,
  event: DEFAULT_EVENT,
  items: DEFAULT_ITEMS,
  taxType: "INTRA_STATE", // 9% CGST + 9% SGST
  discountAmount: 15000,
  transportCharges: 10000,
  labourCharges: 8000,
  advancePaid: 350000,
  paymentTerms: "50% Advance on Confirmation, 50% Prior to Event Setup",
  notes: "Thank you for choosing Mahapathi Event Organizers. All equipment, audio, lighting and stage decor will be installed prior to guest arrival.",
  termsAndConditions: DEFAULT_TERMS
};
