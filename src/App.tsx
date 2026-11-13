import React, { useState, useEffect, useRef } from 'react';
import { Invoice } from './types';
import { INITIAL_INVOICE } from './constants';
import { Navbar } from './components/Navbar';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceA4View } from './components/InvoiceA4View';
import { A4PreviewModal } from './components/A4PreviewModal';
import { calculateTotals, formatCurrency } from './utils/formatters';
import { Eye, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function App() {
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const saved = localStorage.getItem('eventpro_gst_invoice');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.company?.name && !parsed.company.name.includes('CELEBRATION PULSE')) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved invoice', e);
      }
    }
    return INITIAL_INVOICE;
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDesktopSplit, setIsDesktopSplit] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('eventpro_gst_invoice', JSON.stringify(invoice));
  }, [invoice]);

  const handleReset = () => {
    if (confirm('Load fresh sample event data? Any unsaved edits will be replaced.')) {
      setInvoice({
        ...INITIAL_INVOICE,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
      });
    }
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, 297));
      const fileName = `${invoice.documentType}_${invoice.invoiceNumber.replace(/[\/\\]/g, '_')}_${invoice.event.eventName.substring(0, 15).replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Unable to generate PDF. You can also use "Print A4" and select "Save as PDF"!');
    }
  };

  const handleWhatsAppShare = () => {
    const totals = calculateTotals(invoice);
    const text = `*${invoice.documentType === 'TAX_INVOICE' ? 'TAX INVOICE' : 'QUOTATION'} - ${invoice.company.name}*
------------------------------
*Invoice No:* ${invoice.invoiceNumber}
*Event:* ${invoice.event.eventName}
*Date:* ${invoice.event.startDate}
*Venue:* ${invoice.event.venueName}
------------------------------
*Taxable Value:* ${formatCurrency(totals.taxableAmount)}
*GST 18%:* ${formatCurrency(totals.totalTax)}
*Grand Total:* ${formatCurrency(totals.grandTotal)}
*Advance Received:* ${formatCurrency(totals.advancePaid)}
*Balance Due:* *${formatCurrency(totals.balanceDue)}*
------------------------------
Bank: ${invoice.company.bankName} | A/C: ${invoice.company.accountNumber} | IFSC: ${invoice.company.ifscCode}
UPI ID: ${invoice.company.upiId}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const totals = calculateTotals(invoice);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-16 sm:pb-0">
      {/* 1. TOP NAVBAR */}
      <Navbar 
        invoice={invoice} 
        onReset={handleReset} 
        printRef={printRef}
        onOpenPreview={() => setIsPreviewOpen(true)}
        isDesktopSplit={isDesktopSplit}
        onToggleDesktopSplit={() => setIsDesktopSplit(!isDesktopSplit)}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
        <div className={isDesktopSplit ? "grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" : "max-w-3xl mx-auto"}>
          
          {/* THE FORM CONTAINER (Always full width on mobile) */}
          <div className={isDesktopSplit ? "xl:col-span-6" : "w-full"}>
            <InvoiceForm invoice={invoice} onChange={setInvoice} />
          </div>

          {/* DESKTOP SPLIT PREVIEW (Only shown if user explicitly enables Split View on widescreen desktop) */}
          {isDesktopSplit && (
            <div className="hidden xl:block xl:col-span-6 sticky top-20">
              <div className="bg-slate-200/80 p-4 rounded-xl border border-slate-300 flex justify-center shadow-inner overflow-hidden">
                <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center' }}>
                  <InvoiceA4View invoice={invoice} />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 3. MOBILE FLOATING ACTION BAR (Compact & Reachable with One Thumb) */}
      <div className="no-print sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-3 py-2.5 z-40 flex items-center justify-between shadow-2xl">
        <div className="text-left">
          <span className="text-[10px] text-slate-400 block font-medium">Balance Payable:</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">
            {formatCurrency(totals.balanceDue)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* A4 Preview Popup Button */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 active:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-md"
          >
            <Eye className="w-4 h-4" />
            <span>A4 Preview</span>
          </button>

          {/* Direct Print */}
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 active:bg-slate-700"
            title="Print A4"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* 4. A4 PREVIEW MODAL POPUP (Appears on click for Mobile & Desktop) */}
      <A4PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        invoice={invoice}
        printRef={printRef}
        onDownloadPdf={handleDownloadPdf}
        onShareWhatsApp={handleWhatsAppShare}
      />

      {/* 5. ALWAYS-MOUNTED PRINT ELEMENT (Ensures Native window.print() works anytime) */}
      <div className="print-only hidden">
        <InvoiceA4View ref={printRef} invoice={invoice} />
      </div>
    </div>
  );
}

export default App;
