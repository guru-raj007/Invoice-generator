import { Invoice } from '../types';

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumberOnly(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0.00';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  transportCharges: number;
  labourCharges: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
}

export function calculateTotals(invoice: Invoice): InvoiceTotals {
  const subtotal = invoice.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const discount = Math.min(Number(invoice.discountAmount) || 0, subtotal);
  const transportCharges = Number(invoice.transportCharges) || 0;
  const labourCharges = Number(invoice.labourCharges) || 0;
  const taxableAmount = Math.max(0, subtotal - discount + transportCharges + labourCharges);

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (invoice.taxType === 'INTRA_STATE') {
    cgstRate = 9;
    sgstRate = 9;
    cgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
    sgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
  } else {
    igstRate = 18;
    igstAmount = Math.round((taxableAmount * 0.18) * 100) / 100;
  }

  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = Math.round((taxableAmount + totalTax) * 100) / 100;
  const advancePaid = Number(invoice.advancePaid) || 0;
  const balanceDue = Math.max(0, Math.round((grandTotal - advancePaid) * 100) / 100);

  return {
    subtotal,
    discount,
    transportCharges,
    labourCharges,
    taxableAmount,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalTax,
    grandTotal,
    advancePaid,
    balanceDue,
  };
}

// Indian numbering system converter (Crore, Lakh, Thousand, Hundred)
export function numberToWords(num: number): string {
  if (num === 0) return 'Rupees Zero Only';
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ',
    'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(num));
  const paise = Math.round((Math.abs(num) - n) * 100);

  function convertTwoDigits(val: number): string {
    if (val === 0) return '';
    if (val < 20) return a[val];
    return b[Math.floor(val / 10)] + (val % 10 !== 0 ? ' ' + a[val % 10] : ' ');
  }

  function convertThreeDigits(val: number): string {
    let str = '';
    if (Math.floor(val / 100) > 0) {
      str += a[Math.floor(val / 100)] + 'Hundred ';
    }
    const rem = val % 100;
    if (rem > 0) {
      str += convertTwoDigits(rem);
    }
    return str;
  }

  let words = '';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;

  if (crore > 0) {
    words += convertThreeDigits(crore) + 'Crore ';
  }
  if (lakh > 0) {
    words += convertThreeDigits(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    words += convertThreeDigits(thousand) + 'Thousand ';
  }
  if (hundred > 0) {
    words += convertThreeDigits(hundred);
  }

  let result = 'Indian Rupees ' + words.trim();
  if (paise > 0) {
    result += ' and ' + convertTwoDigits(paise).trim() + ' Paise';
  }
  result += ' Only';
  return result;
}
