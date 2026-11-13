import React, { useState } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { INDIAN_STATES, SAC_CODES } from '../constants';
import { 
  Building2, 
  User, 
  Calendar, 
  ListPlus, 
  CreditCard, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
}

const PRESET_EVENT_ITEMS = [
  { category: "Stage & Set Decor", description: "Main Stage Fabrication (30x16 ft) with Carpet, Ramp & 3D Backdrop", sacCode: "998596", unit: "Set", unitPrice: 75000 },
  { category: "LED Video Wall", description: "High-Resolution P2.9 Indoor LED Wall (20x10 ft) with Video Scaler & Laptop Tech", sacCode: "999612", unit: "Day", unitPrice: 60000 },
  { category: "Line Array Sound", description: "JBL/RCF Line Array System (4 Tops, 2 Subs), Cordless Mics & Digital Audio Mixer", sacCode: "999612", unit: "Day", unitPrice: 45000 },
  { category: "Intelligent Lighting", description: "Sharpys (Beam 230), LED Par Cans, Moving Washes, Profile Spots & DMX Console", sacCode: "999612", unit: "Day", unitPrice: 40000 },
  { category: "Artist / Emcee", description: "Professional Event Emcee / Anchor for Stage Hosting & Audience Engagement", sacCode: "999613", unit: "Show", unitPrice: 35000 },
  { category: "DJ & Sound Console", description: "Celebrity Club DJ with Pioneer CDJ-3000 Setup & Custom Music Production", sacCode: "999613", unit: "Night", unitPrice: 50000 },
  { category: "Photo & 4K Video", description: "2 Cinematographers (Sony FX3), 1 Candid Photographer, 1 Drone Pilot & Live Streaming", sacCode: "998311", unit: "Day", unitPrice: 65000 },
  { category: "Event Management Fee", description: "End-to-end Event Planning, Vendor Liaison, Floor Coordination & Technical Direction", sacCode: "998596", unit: "Lumpsum", unitPrice: 50000 },
  { category: "Event Security & Manpower", description: "Trained Bouncers (6 Pax), Female Ushers (4 Pax) & Hospitality Support Crew", sacCode: "998599", unit: "Day", unitPrice: 30000 }
];

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onChange }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'event' | 'client' | 'company' | 'payment'>('items');
  const [showPresets, setShowPresets] = useState(false);

  // Prevent negative sign '-', scientific 'e', and '+' from being entered
  const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
      e.preventDefault();
    }
  };

  const handleNonNegativeInput = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    const clean = value.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const updateCompany = (fields: Partial<Invoice['company']>) => {
    const updatedCompany = { ...invoice.company, ...fields };
    const isSameState = updatedCompany.stateCode === invoice.client.stateCode;
    onChange({
      ...invoice,
      company: updatedCompany,
      taxType: isSameState ? 'INTRA_STATE' : 'INTER_STATE'
    });
  };

  const updateClient = (fields: Partial<Invoice['client']>) => {
    const updatedClient = { ...invoice.client, ...fields };
    const isSameState = invoice.company.stateCode === updatedClient.stateCode;
    onChange({
      ...invoice,
      client: updatedClient,
      taxType: isSameState ? 'INTRA_STATE' : 'INTER_STATE'
    });
  };

  const updateEvent = (fields: Partial<Invoice['event']>) => {
    onChange({
      ...invoice,
      event: { ...invoice.event, ...fields }
    });
  };

  const handleItemChange = (index: number, fields: Partial<InvoiceItem>) => {
    const newItems = [...invoice.items];
    const current = newItems[index];
    const updated = { ...current, ...fields };

    if ('quantity' in fields || 'unitPrice' in fields) {
      const q = fields.quantity !== undefined ? fields.quantity : current.quantity;
      const p = fields.unitPrice !== undefined ? fields.unitPrice : current.unitPrice;
      updated.amount = Math.round((Number(q) * Number(p)) * 100) / 100;
    }

    newItems[index] = updated;
    onChange({ ...invoice, items: newItems });
  };

  const addItem = (preset?: typeof PRESET_EVENT_ITEMS[0]) => {
    const newItem: InvoiceItem = preset ? {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: preset.category,
      description: preset.description,
      sacCode: preset.sacCode,
      quantity: 1,
      unit: preset.unit,
      unitPrice: preset.unitPrice,
      amount: preset.unitPrice
    } : {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: "Event Production",
      description: "Service deliverable description",
      sacCode: "998596",
      quantity: 1,
      unit: "Set",
      unitPrice: 10000,
      amount: 10000
    };

    onChange({
      ...invoice,
      items: [...invoice.items, newItem]
    });
    setShowPresets(false);
  };

  const removeItem = (index: number) => {
    if (invoice.items.length <= 1) {
      alert("At least one line item is required.");
      return;
    }
    const newItems = invoice.items.filter((_, i) => i !== index);
    onChange({ ...invoice, items: newItems });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Controls: Document Type & 18% Tax Type Switcher */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm">Document Mode:</span>
          <select
            value={invoice.documentType}
            onChange={(e) => onChange({ ...invoice, documentType: e.target.value as any })}
            className="bg-slate-800 text-white font-semibold text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="TAX_INVOICE">Tax Invoice (Official)</option>
            <option value="QUOTATION">Quotation / Cost Estimate</option>
            <option value="PROFORMA">Proforma Invoice</option>
          </select>
        </div>

        {/* GST 18% Tax Engine Mode */}
        <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-300 font-medium">GST Rate: <strong className="text-emerald-400">18%</strong></span>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ ...invoice, taxType: 'INTRA_STATE' })}
              className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                invoice.taxType === 'INTRA_STATE'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Intra-State (CGST 9% + SGST 9%)
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...invoice, taxType: 'INTER_STATE' })}
              className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                invoice.taxType === 'INTER_STATE'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Inter-State (IGST 18%)
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 px-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'items'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListPlus className="w-4 h-4" />
          <span>Line Items ({invoice.items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('event')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'event'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Event & Venue</span>
        </button>

        <button
          onClick={() => setActiveTab('client')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'client'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Client Details</span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'company'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Your Organization</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'payment'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Financials & Bank</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="p-4 sm:p-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        {/* 1. LINE ITEMS TAB */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Event Deliverables & Services</h3>
                <p className="text-xs text-slate-500">Each item auto-calculates toward the 18% GST taxable total.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quick Add Event Presets</span>
                  {showPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => addItem()}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Event Presets Panel */}
            {showPresets && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {PRESET_EVENT_ITEMS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addItem(preset)}
                    className="text-left bg-white p-2 rounded border border-amber-200 hover:border-amber-400 hover:shadow-sm transition-all"
                  >
                    <div className="font-bold text-slate-900 text-xs flex justify-between">
                      <span>{preset.category}</span>
                      <span className="text-indigo-600 font-mono">₹{preset.unitPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{preset.description}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Items List */}
            <div className="space-y-3">
              {invoice.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Service Category (e.g. Stage Decor, Sound, Lights, DJ)"
                        value={item.category}
                        onChange={(e) => handleItemChange(index, { category: e.target.value })}
                        className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                      />

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0">SAC:</span>
                        <select
                          value={item.sacCode}
                          onChange={(e) => handleItemChange(index, { sacCode: e.target.value })}
                          className="text-xs font-mono bg-white border border-slate-300 rounded px-2 py-1.5 w-full focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                          {SAC_CODES.map((s) => (
                            <option key={s.code} value={s.code}>{s.code} - {s.name.split('(')[0]}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Specific item details, brand specifications, deliverables..."
                    value={item.description}
                    onChange={(e) => handleItemChange(index, { description: e.target.value })}
                    className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />

                  {/* Quantity, Unit, Price, Total Amount */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-200/80 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onKeyDown={preventNegative}
                        onChange={(e) => handleItemChange(index, { quantity: Math.max(1, Math.floor(handleNonNegativeInput(e.target.value)) || 1) })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono text-center focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Unit</label>
                      <input
                        type="text"
                        placeholder="Day / Set / Nos / Lumpsum"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, { unit: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Rate (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice || ''}
                        placeholder="0"
                        onKeyDown={preventNegative}
                        onChange={(e) => handleItemChange(index, { unitPrice: handleNonNegativeInput(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono text-right focus:ring-1 focus:ring-indigo-500 outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Line Total (₹)</label>
                      <div className="w-full bg-slate-100 border border-slate-300 rounded px-2 py-1 font-mono text-right font-extrabold text-slate-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Manual Adjustments: Transport, Labour, Discount & Advance */}
            <div className="bg-slate-100/90 border border-slate-300 rounded-lg p-3 space-y-2 mt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Manual Adjustments & Charges
                </h4>
                <span className="text-[10px] text-slate-500">Auto-calculated into Taxable Value</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-1">
                    🚚 Transport Charges (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={invoice.transportCharges || ''}
                    onKeyDown={preventNegative}
                    onChange={(e) => onChange({ ...invoice, transportCharges: handleNonNegativeInput(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-1">
                    👷 Labour Charges (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={invoice.labourCharges || ''}
                    onKeyDown={preventNegative}
                    onChange={(e) => onChange({ ...invoice, labourCharges: handleNonNegativeInput(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-1">
                    🏷️ Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={invoice.discountAmount || ''}
                    onKeyDown={preventNegative}
                    onChange={(e) => onChange({ ...invoice, discountAmount: handleNonNegativeInput(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-emerald-700 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-1">
                    💰 Advance Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={invoice.advancePaid || ''}
                    onKeyDown={preventNegative}
                    onChange={(e) => onChange({ ...invoice, advancePaid: handleNonNegativeInput(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-indigo-700 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EVENT & VENUE TAB */}
        {activeTab === 'event' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
              Event Production & Venue Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Event Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Wedding Reception / Annual Tech Summit 2026"
                  value={invoice.event.eventName}
                  onChange={(e) => updateEvent({ eventName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Type</label>
                <input
                  type="text"
                  placeholder="e.g. Corporate Gala, Wedding, Live Concert, Birthday"
                  value={invoice.event.eventType}
                  onChange={(e) => updateEvent({ eventType: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Estimated Guest Count (Pax)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 500"
                  value={invoice.event.guestCount || ''}
                  onKeyDown={preventNegative}
                  onChange={(e) => updateEvent({ guestCount: handleNonNegativeInput(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Start Date</label>
                <input
                  type="date"
                  value={invoice.event.startDate}
                  onChange={(e) => updateEvent({ startDate: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event End Date</label>
                <input
                  type="date"
                  value={invoice.event.endDate}
                  onChange={(e) => updateEvent({ endDate: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Hyatt Ballroom / Palace Grounds"
                  value={invoice.event.venueName}
                  onChange={(e) => updateEvent({ venueName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Venue Full Address & City</label>
                <input
                  type="text"
                  placeholder="e.g. Western Express Highway, Santacruz East, Mumbai"
                  value={invoice.event.venueAddress}
                  onChange={(e) => updateEvent({ venueAddress: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Client Point of Contact (POC)</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Rajesh Sharma"
                  value={invoice.event.pocName || ''}
                  onChange={(e) => updateEvent({ pocName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">POC Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={invoice.event.pocPhone || ''}
                  onChange={(e) => updateEvent({ pocPhone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. CLIENT DETAILS TAB */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
              Client & Billing Particulars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Global Media Pvt Ltd"
                  value={invoice.client.companyName}
                  onChange={(e) => updateClient({ companyName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Person Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Kapoor"
                  value={invoice.client.name}
                  onChange={(e) => updateClient({ name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Client GSTIN (15 Digits)</label>
                <input
                  type="text"
                  placeholder="e.g. 27AAAAA0000A1Z5 (Leave blank if Consumer)"
                  value={invoice.client.gstin}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    const stateCode = val.substring(0, 2);
                    const matchedState = INDIAN_STATES.find(s => s.code === stateCode);
                    updateClient({
                      gstin: val,
                      ...(matchedState ? { stateCode: matchedState.code, state: matchedState.name } : {})
                    });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Client State (Place of Supply)</label>
                <select
                  value={invoice.client.stateCode}
                  onChange={(e) => {
                    const s = INDIAN_STATES.find(item => item.code === e.target.value);
                    if (s) {
                      updateClient({ stateCode: s.code, state: s.name });
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Billing Street Address</label>
                <input
                  type="text"
                  placeholder="Plot No, Street, Landmark"
                  value={invoice.client.address}
                  onChange={(e) => updateClient({ address: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={invoice.client.city}
                  onChange={(e) => updateClient({ city: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pincode</label>
                <input
                  type="text"
                  placeholder="e.g. 400001"
                  value={invoice.client.pincode}
                  onChange={(e) => updateClient({ pincode: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={invoice.client.phone}
                  onChange={(e) => updateClient({ phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email ID</label>
                <input
                  type="email"
                  placeholder="client@domain.com"
                  value={invoice.client.email}
                  onChange={(e) => updateClient({ email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. COMPANY DETAILS TAB */}
        {activeTab === 'company' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
              Your Event Management Organization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Organization / Agency Name</label>
                <input
                  type="text"
                  value={invoice.company.name}
                  onChange={(e) => updateCompany({ name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Agency Tagline / Slogan</label>
                <input
                  type="text"
                  value={invoice.company.tagline}
                  onChange={(e) => updateCompany({ tagline: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Organization GSTIN</label>
                <input
                  type="text"
                  value={invoice.company.gstin}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    const stateCode = val.substring(0, 2);
                    const matchedState = INDIAN_STATES.find(s => s.code === stateCode);
                    updateCompany({
                      gstin: val,
                      ...(matchedState ? { stateCode: matchedState.code, state: matchedState.name } : {})
                    });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-indigo-700 uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">PAN Number</label>
                <input
                  type="text"
                  value={invoice.company.pan}
                  onChange={(e) => updateCompany({ pan: e.target.value.toUpperCase() })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">State & GST State Code</label>
                <select
                  value={invoice.company.stateCode}
                  onChange={(e) => {
                    const s = INDIAN_STATES.find(item => item.code === e.target.value);
                    if (s) {
                      updateCompany({ stateCode: s.code, state: s.name });
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">City</label>
                <input
                  type="text"
                  value={invoice.company.city}
                  onChange={(e) => updateCompany({ city: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Office Address</label>
                <input
                  type="text"
                  value={invoice.company.address}
                  onChange={(e) => updateCompany({ address: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Office Phone / WhatsApp</label>
                <input
                  type="text"
                  value={invoice.company.phone}
                  onChange={(e) => updateCompany({ phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Billing Email</label>
                <input
                  type="email"
                  value={invoice.company.email}
                  onChange={(e) => updateCompany({ email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. FINANCIALS, BANK & MILESTONES TAB */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
              Payment Terms, Additional Charges & Bank Settlement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => onChange({ ...invoice, invoiceNumber: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={invoice.invoiceDate}
                  onChange={(e) => onChange({ ...invoice, invoiceDate: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => onChange({ ...invoice, dueDate: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Special Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={invoice.discountAmount || ''}
                  onKeyDown={preventNegative}
                  onChange={(e) => onChange({ ...invoice, discountAmount: handleNonNegativeInput(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-emerald-700 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">🚚 Transport Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={invoice.transportCharges || ''}
                  onKeyDown={preventNegative}
                  onChange={(e) => onChange({ ...invoice, transportCharges: handleNonNegativeInput(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">👷 Labour / Crew Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={invoice.labourCharges || ''}
                  onKeyDown={preventNegative}
                  onChange={(e) => onChange({ ...invoice, labourCharges: handleNonNegativeInput(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Advance Received (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={invoice.advancePaid || ''}
                  onKeyDown={preventNegative}
                  onChange={(e) => onChange({ ...invoice, advancePaid: handleNonNegativeInput(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono text-indigo-700 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Terms Note</label>
                <input
                  type="text"
                  placeholder="e.g. 50% on booking, 50% before event day"
                  value={invoice.paymentTerms}
                  onChange={(e) => onChange({ ...invoice, paymentTerms: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Bank Details */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-indigo-900 text-xs mb-2">Bank Details & Dynamic UPI QR Code</h4>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={invoice.company.bankName}
                  onChange={(e) => updateCompany({ bankName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Account Number</label>
                <input
                  type="text"
                  value={invoice.company.accountNumber}
                  onChange={(e) => updateCompany({ accountNumber: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={invoice.company.ifscCode}
                  onChange={(e) => updateCompany({ ifscCode: e.target.value.toUpperCase() })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Branch Name</label>
                <input
                  type="text"
                  value={invoice.company.branch}
                  onChange={(e) => updateCompany({ branch: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  UPI ID / VPA <span className="text-indigo-600 font-normal">(Generates instant dynamic QR code on the A4 invoice)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. eventcompany@hdfcbank or 9876543210@paytm"
                  value={invoice.company.upiId}
                  onChange={(e) => updateCompany({ upiId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
