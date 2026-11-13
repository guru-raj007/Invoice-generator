import React, { forwardRef } from 'react';
import { Invoice } from '../types';
import { calculateTotals, formatCurrency, formatNumberOnly, numberToWords } from '../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceA4ViewProps {
  invoice: Invoice;
}

export const InvoiceA4View = forwardRef<HTMLDivElement, InvoiceA4ViewProps>(({ invoice }, ref) => {
  const totals = calculateTotals(invoice);

  // Generate UPI payment intent URI
  const upiUri = invoice.company.upiId
    ? `upi://pay?pa=${encodeURIComponent(invoice.company.upiId)}&pn=${encodeURIComponent(invoice.company.name)}&am=${totals.balanceDue}&cu=INR&tn=${encodeURIComponent(`Inv ${invoice.invoiceNumber} - ${invoice.event.eventName}`)}`
    : '';

  const isQuotation = invoice.documentType === 'QUOTATION';
  const isProforma = invoice.documentType === 'PROFORMA';
  const documentTitle = isQuotation ? 'EVENT QUOTATION / ESTIMATE' : isProforma ? 'PROFORMA INVOICE' : 'TAX INVOICE';

  return (
    <div
      ref={ref}
      id="invoice-print-area"
      className="a4-screen-canvas a4-page-sheet bg-white text-slate-800 text-[11px] leading-[1.35] select-text"
      style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif"
      }}
    >
      {/* 1. TOP HEADER & BRANDING */}
      <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-3 mb-2.5">
        <div className="max-w-[64%]">
          <div className="flex items-center gap-3 mb-1.5">
            {invoice.company.logoUrl ? (
              <img
                src={invoice.company.logoUrl}
                alt={invoice.company.name}
                className="h-14 w-auto max-w-[70px] object-contain shrink-0 rounded"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm print:shadow-none">
                MD
              </div>
            )}
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
                {invoice.company.name}
              </h1>
              {invoice.company.tagline && (
                <p className="text-[10px] text-indigo-700 font-bold tracking-wide">
                  {invoice.company.tagline}
                </p>
              )}
            </div>
          </div>
          <p className="text-[10.5px] text-slate-700 font-medium leading-relaxed">
            {invoice.company.address}, {invoice.company.city}, {invoice.company.state} - {invoice.company.pincode}
          </p>
          <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-700 mt-0.5">
            <span><strong>Contact:</strong> {invoice.company.phone}</span>
            <span><strong>Email:</strong> {invoice.company.email}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 text-[10.5px] font-semibold text-slate-800 mt-1 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-100 print:border-slate-300">
            <span>GSTIN: <span className="font-mono text-indigo-900">{invoice.company.gstin}</span></span>
            <span>PAN: <span className="font-mono">{invoice.company.pan}</span></span>
            <span>State: {invoice.company.state} (Code: {invoice.company.stateCode})</span>
          </div>
        </div>

        {/* Invoice Meta Badges */}
        <div className="text-right flex flex-col items-end">
          <div className={`inline-block px-3 py-1 rounded text-xs font-black tracking-wider uppercase mb-1.5 ${
            isQuotation 
              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
              : isProforma 
              ? 'bg-sky-100 text-sky-900 border border-sky-300' 
              : 'bg-indigo-600 text-white shadow-sm print:shadow-none'
          }`}>
            {documentTitle}
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded p-2 text-right min-w-[190px]">
            <div className="grid grid-cols-2 gap-x-2 text-[10px] mb-0.5">
              <span className="text-slate-500 font-medium">Invoice No:</span>
              <span className="font-bold text-slate-900 font-mono text-[11px]">{invoice.invoiceNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 text-[10px] mb-0.5">
              <span className="text-slate-500 font-medium">Invoice Date:</span>
              <span className="font-semibold text-slate-800">{invoice.invoiceDate}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 text-[10px] mb-0.5">
              <span className="text-slate-500 font-medium">Due Date:</span>
              <span className="font-semibold text-rose-700">{invoice.dueDate}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 text-[10px] pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Place of Supply:</span>
              <span className="font-semibold text-slate-800">{invoice.client.state} ({invoice.client.stateCode})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BILLED TO & EVENT PARTICULARS (2 Columns) */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5 text-[10.5px]">
        {/* Client Box */}
        <div className="border border-slate-200 rounded p-2 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="text-[9.5px] font-bold text-indigo-700 tracking-wider uppercase mb-0.5">
              BILLED TO / CLIENT DETAILS
            </div>
            <div className="font-bold text-slate-900 text-[11.5px] leading-tight">
              {invoice.client.companyName || invoice.client.name}
            </div>
            {invoice.client.companyName && invoice.client.name && (
              <div className="text-[10px] text-slate-600 font-medium">Attn: {invoice.client.name}</div>
            )}
            <div className="text-[10px] text-slate-600 mt-0.5">
              {invoice.client.address}, {invoice.client.city}, {invoice.client.state} - {invoice.client.pincode}
            </div>
            <div className="text-[10px] text-slate-600">
              Phone: {invoice.client.phone} | Email: {invoice.client.email}
            </div>
          </div>
          <div className="mt-1.5 pt-1 border-t border-slate-200 flex justify-between items-center text-[10px]">
            <div>
              <span className="font-semibold text-slate-700">Client GSTIN: </span>
              <span className="font-mono font-bold text-slate-900">{invoice.client.gstin || 'Unregistered / Consumer'}</span>
            </div>
            <span className="text-slate-500">State: {invoice.client.stateCode}</span>
          </div>
        </div>

        {/* Event Particulars Box */}
        <div className="border border-indigo-100 bg-indigo-50/30 rounded p-2 flex flex-col justify-between">
          <div>
            <div className="text-[9.5px] font-bold text-indigo-700 tracking-wider uppercase mb-0.5 flex justify-between">
              <span>EVENT PRODUCTION DETAILS</span>
              <span className="font-semibold normal-case text-indigo-600">{invoice.event.eventType}</span>
            </div>
            <div className="font-bold text-indigo-950 text-[11.5px] leading-tight">
              {invoice.event.eventName}
            </div>
            <div className="text-[10px] text-slate-700 mt-0.5">
              <strong>Venue:</strong> {invoice.event.venueName}, {invoice.event.venueAddress}
            </div>
            <div className="text-[10px] text-slate-700 flex gap-x-4 mt-0.5">
              <span><strong>Event Date:</strong> {invoice.event.startDate} {invoice.event.endDate !== invoice.event.startDate ? `to ${invoice.event.endDate}` : ''}</span>
              {invoice.event.guestCount ? <span><strong>Pax:</strong> {invoice.event.guestCount} Guests</span> : null}
            </div>
          </div>
          {invoice.event.pocName && (
            <div className="mt-1 pt-1 border-t border-indigo-100/80 text-[10px] text-slate-600 flex justify-between">
              <span><strong>Event Coordinator:</strong> {invoice.event.pocName}</span>
              {invoice.event.pocPhone && <span>{invoice.event.pocPhone}</span>}
            </div>
          )}
        </div>
      </div>

      {/* 3. ITEM SERVICE SCHEDULE TABLE */}
      <div className="mb-2.5 flex-1">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-800 text-white text-[9.5px] uppercase font-bold tracking-wider">
              <th className="py-1 px-1.5 text-center w-7 border-r border-slate-700">#</th>
              <th className="py-1 px-2 border-r border-slate-700">Service Category & Deliverable Description</th>
              <th className="py-1 px-1.5 text-center w-16 border-r border-slate-700">SAC</th>
              <th className="py-1 px-1.5 text-center w-10 border-r border-slate-700">Qty</th>
              <th className="py-1 px-1.5 text-center w-14 border-r border-slate-700">Unit</th>
              <th className="py-1 px-2 text-right w-20 border-r border-slate-700">Rate (₹)</th>
              <th className="py-1 px-2 text-right w-24">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[10px]">
            {invoice.items.map((item, index) => (
              <tr key={item.id || index} className={index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                <td className="py-1 px-1.5 text-center text-slate-500 font-mono border-r border-slate-200">
                  {index + 1}
                </td>
                <td className="py-1 px-2 border-r border-slate-200">
                  <span className="font-bold text-slate-900 block leading-tight text-[10.5px]">
                    {item.category}
                  </span>
                  <span className="text-slate-600 text-[9.5px] block leading-snug whitespace-pre-wrap">
                    {item.description}
                  </span>
                </td>
                <td className="py-1 px-1.5 text-center font-mono font-medium text-slate-700 border-r border-slate-200">
                  {item.sacCode || '998596'}
                </td>
                <td className="py-1 px-1.5 text-center font-medium text-slate-800 border-r border-slate-200">
                  {item.quantity}
                </td>
                <td className="py-1 px-1.5 text-center text-slate-600 border-r border-slate-200 text-[9.5px]">
                  {item.unit || 'Nos'}
                </td>
                <td className="py-1 px-2 text-right font-mono text-slate-700 border-r border-slate-200">
                  {formatNumberOnly(item.unitPrice)}
                </td>
                <td className="py-1 px-2 text-right font-mono font-bold text-slate-900">
                  {formatNumberOnly(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. TOTALS, TAX BREAKDOWN & PAYMENT DETAILS (Keep on same page) */}
      <div className="page-break-avoid border-t-2 border-slate-300 pt-2 mb-2">
        <div className="grid grid-cols-12 gap-3">
          {/* Left Column: Words, Bank Details, Dynamic UPI QR */}
          <div className="col-span-7 flex flex-col justify-between space-y-2">
            {/* Amount In Words */}
            <div className="bg-slate-50 border border-slate-200 rounded p-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Amount In Words:
              </span>
              <p className="text-[10px] font-semibold text-slate-900 italic leading-snug">
                {numberToWords(totals.grandTotal)}
              </p>
            </div>

            {/* Bank Particulars & Dynamic UPI QR Code */}
            <div className="border border-slate-200 rounded p-2 bg-indigo-50/20 flex gap-2.5 items-center">
              <div className="flex-1 text-[9.5px]">
                <div className="font-bold text-indigo-900 uppercase tracking-wider text-[9px] mb-0.5">
                  Direct Bank Remittance / NEFT / RTGS
                </div>
                <div className="grid grid-cols-3 gap-x-1 leading-snug">
                  <span className="text-slate-500">Bank Name:</span>
                  <span className="col-span-2 font-semibold text-slate-800">{invoice.company.bankName}</span>
                  <span className="text-slate-500">Account No:</span>
                  <span className="col-span-2 font-mono font-bold text-slate-900">{invoice.company.accountNumber}</span>
                  <span className="text-slate-500">IFSC Code:</span>
                  <span className="col-span-2 font-mono font-bold text-slate-900">{invoice.company.ifscCode}</span>
                  <span className="text-slate-500">Branch:</span>
                  <span className="col-span-2 text-slate-800">{invoice.company.branch}</span>
                  <span className="text-slate-500">UPI ID / VPA:</span>
                  <span className="col-span-2 font-mono font-semibold text-indigo-700">{invoice.company.upiId}</span>
                </div>
              </div>

              {/* UPI QR Code */}
              {invoice.company.upiId && totals.balanceDue > 0 && (
                <div className="shrink-0 text-center bg-white p-1 rounded border border-indigo-100 shadow-sm print:shadow-none">
                  <QRCodeSVG value={upiUri} size={62} level="M" />
                  <span className="text-[8px] font-bold text-indigo-800 block mt-0.5">Scan to Pay</span>
                </div>
              )}
            </div>

            {/* Terms and Notes Snippet */}
            <div className="text-[8.5px] text-slate-500 leading-tight">
              <span className="font-bold text-slate-700 uppercase">Key Terms: </span>
              {invoice.termsAndConditions.slice(0, 3).join(' ')}
            </div>
          </div>

          {/* Right Column: Calculations & 18% GST Grid */}
          <div className="col-span-5 bg-slate-50 border border-slate-200 rounded p-2 text-[10.5px]">
            <div className="space-y-1 divide-y divide-slate-200">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-mono font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between py-0.5 text-emerald-700">
                  <span>Special Discount:</span>
                  <span className="font-mono font-medium">- {formatCurrency(totals.discount)}</span>
                </div>
              )}

              {totals.transportCharges > 0 && (
                <div className="flex justify-between py-0.5 text-slate-700">
                  <span>Transport Charges:</span>
                  <span className="font-mono font-medium">+ {formatCurrency(totals.transportCharges)}</span>
                </div>
              )}

              {totals.labourCharges > 0 && (
                <div className="flex justify-between py-0.5 text-slate-700">
                  <span>Labour Charges:</span>
                  <span className="font-mono font-medium">+ {formatCurrency(totals.labourCharges)}</span>
                </div>
              )}

              <div className="flex justify-between py-0.5 font-semibold text-slate-800">
                <span>Taxable Value:</span>
                <span className="font-mono">{formatCurrency(totals.taxableAmount)}</span>
              </div>

              {/* GST Calculations (Strictly 18%) */}
              {invoice.taxType === 'INTRA_STATE' ? (
                <>
                  <div className="flex justify-between py-0.5 text-slate-700">
                    <span>Central GST (CGST @ 9%):</span>
                    <span className="font-mono font-medium">{formatCurrency(totals.cgstAmount)}</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-700">
                    <span>State GST (SGST @ 9%):</span>
                    <span className="font-mono font-medium">{formatCurrency(totals.sgstAmount)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-0.5 text-slate-700">
                  <span>Integrated GST (IGST @ 18%):</span>
                  <span className="font-mono font-medium">{formatCurrency(totals.igstAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 bg-indigo-50/70 -mx-2 px-2 rounded font-bold text-indigo-950 text-[11px] border-y border-indigo-200">
                <span>Grand Total (Incl. 18% GST):</span>
                <span className="font-mono text-indigo-900">{formatCurrency(totals.grandTotal)}</span>
              </div>

              {totals.advancePaid > 0 && (
                <div className="flex justify-between py-0.5 text-slate-600">
                  <span>Less: Advance Received:</span>
                  <span className="font-mono text-emerald-800 font-semibold">- {formatCurrency(totals.advancePaid)}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 -mx-2 px-2 bg-slate-900 text-white rounded font-extrabold text-[12px]">
                <span className="tracking-wide">BALANCE PAYABLE:</span>
                <span className="font-mono">{formatCurrency(totals.balanceDue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SIGNATORY & A4 FOOTER */}
      <div className="page-break-avoid border-t border-slate-200 pt-2 mt-auto flex justify-between items-end text-[9.5px]">
        <div className="text-slate-500 max-w-[55%]">
          <p className="font-semibold text-slate-700 mb-0.5">Payment Terms & Milestones:</p>
          <p className="text-[9px] leading-snug">{invoice.paymentTerms}</p>
          <p className="text-[8.5px] text-slate-400 mt-1">
            * This is a system-generated electronic GST invoice under SAC 998596. Certified valid without physical signature.
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9.5px] font-bold text-slate-800 mb-9 uppercase">
            For {invoice.company.name}
          </p>
          <div className="border-t border-slate-400 pt-0.5 inline-block min-w-[160px] text-center">
            <span className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider block">
              Authorized Signatory
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceA4View.displayName = 'InvoiceA4View';
