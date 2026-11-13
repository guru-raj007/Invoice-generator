import React, { useState } from 'react';
import { Invoice } from '../types';
import { InvoiceA4View } from './InvoiceA4View';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface A4PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  printRef: React.RefObject<HTMLDivElement>;
  onDownloadPdf: () => void;
  onShareWhatsApp: () => void;
}

export const A4PreviewModal: React.FC<A4PreviewModalProps> = ({
  isOpen,
  onClose,
  invoice,
  printRef,
  onDownloadPdf,
  onShareWhatsApp
}) => {
  const [zoom, setZoom] = useState<number>(0.72);

  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <h3 className="font-bold text-sm text-white">A4 Invoice Preview</h3>
              <p className="text-[10px] text-slate-400 hidden sm:block">Standard 210mm × 297mm Tax Invoice</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-slate-300 text-xs">
              <button
                type="button"
                onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 font-bold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom(z => Math.min(1.1, z + 0.1))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={onShareWhatsApp}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 rounded-lg flex items-center gap-1"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp</span>
            </button>

            {/* Export PDF */}
            <button
              type="button"
              onClick={onDownloadPdf}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">PDF</span>
            </button>

            {/* Print A4 */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 shadow-md"
              title="Print A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Canvas */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 bg-slate-950/50 flex justify-center items-start">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="shrink-0 mb-6"
          >
            <InvoiceA4View ref={printRef} invoice={invoice} />
          </div>
        </div>

      </div>
    </div>
  );
};
