import React, { useState } from 'react';
import { Invoice } from '../types';
import { calculateTotals, formatCurrency } from '../utils/formatters';
import { 
  Printer, 
  Download, 
  Share2, 
  RotateCcw, 
  FileCheck,
  Eye,
  Columns,
  Square
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface NavbarProps {
  invoice: Invoice;
  onReset: () => void;
  printRef: React.RefObject<HTMLDivElement>;
  onOpenPreview: () => void;
  isDesktopSplit: boolean;
  onToggleDesktopSplit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  invoice, 
  onReset, 
  printRef, 
  onOpenPreview,
  isDesktopSplit,
  onToggleDesktopSplit
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const totals = calculateTotals(invoice);

  // Trigger Native Browser Print Dialog (Strictly styled for A4 page)
  const handlePrintA4 = () => {
    window.print();
  };

  // Generate crisp A4 PDF using jsPDF + html2canvas
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);

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
      alert('Unable to generate PDF. You can also click "Print A4" and select "Save as PDF"!');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // WhatsApp invoice summary share
  const handleWhatsAppShare = () => {
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

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          {invoice.company.logoUrl ? (
            <img 
              src={invoice.company.logoUrl} 
              alt="Logo" 
              className="w-9 h-9 object-contain rounded bg-white p-0.5" 
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base">
              <FileCheck className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white line-clamp-1">
                {invoice.company.name}
              </span>
              <span className="bg-indigo-500/30 text-indigo-300 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-500/40 shrink-0">
                18% GST
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Event Management Invoice & Quotation Manager
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop Split View Toggle (Desktop Only) */}
          <button
            type="button"
            onClick={onToggleDesktopSplit}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
            title="Toggle Side-by-side Live Preview on large screens"
          >
            {isDesktopSplit ? <Square className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{isDesktopSplit ? 'Focus Mode' : 'Split View'}</span>
          </button>

          {/* Sample Reset */}
          <button
            type="button"
            onClick={onReset}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Load sample event template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* A4 PREVIEW BUTTON (POPUP) */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/70 rounded-lg transition-all shadow-sm"
            title="Open A4 Invoice Preview Popup"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>A4 Preview</span>
          </button>

          {/* PRINT A4 BUTTON */}
          <button
            type="button"
            onClick={handlePrintA4}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md"
            title="Print A4 Size"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print A4</span>
          </button>
        </div>
      </div>
    </header>
  );
};
