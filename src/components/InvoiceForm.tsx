import React, { useState } from 'react';
import type { Invoice, LineItem, CompanySettings } from '../types';
import { generateId, formatInvoiceNumber, formatCurrency } from '../utils/formatting';
import PreviewModal from './PreviewModal';

interface Props {
  settings: CompanySettings;
  initialInvoice?: Partial<Invoice>;
  onSave: (invoice: Invoice) => void;
  onIncrementNumber: () => void;
}

const PAYMENT_METHODS = ['Cash', 'M-Pesa', 'Mixx by Yas', 'Bank Transfer', 'Cheque'];

function emptyLine(): LineItem {
  return { id: generateId(), description: '', price: 0, quantity: 1, total: 0 };
}

export default function InvoiceForm({ settings, initialInvoice, onSave, onIncrementNumber }: Props) {
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber ?? formatInvoiceNumber(settings.nextInvoiceNumber)
  );
  const [date, setDate]                     = useState(initialInvoice?.date ?? new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName]     = useState(initialInvoice?.customerName ?? '');
  const [customerTIN, setCustomerTIN]       = useState(initialInvoice?.customerTIN ?? '');
  const [customerVRN, setCustomerVRN]       = useState(initialInvoice?.customerVRN ?? '');
  const [paymentMethod, setPaymentMethod]   = useState(initialInvoice?.paymentMethod ?? 'Cash');
  const [lineItems, setLineItems]           = useState<LineItem[]>(
    initialInvoice?.lineItems?.length ? initialInvoice.lineItems : [emptyLine()]
  );
  const [terms, setTerms]       = useState(initialInvoice?.terms ?? settings.defaultTerms);
  const [vatEnabled, setVatEnabled] = useState(initialInvoice?.vatEnabled ?? false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved]   = useState(false);
  const [prevNextNumber, setPrevNextNumber] = useState(settings.nextInvoiceNumber);

  if (!initialInvoice && prevNextNumber !== settings.nextInvoiceNumber) {
    setPrevNextNumber(settings.nextInvoiceNumber);
    setInvoiceNumber(formatInvoiceNumber(settings.nextInvoiceNumber));
  }

  const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
  const vatAmount = vatEnabled ? Math.round(subtotal * 0.18 * 100) / 100 : 0;
  const total = subtotal + vatAmount;

  function updateLine(id: string, field: keyof LineItem, value: string | number) {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'price' || field === 'quantity') {
          updated.total = Number(updated.price) * Number(updated.quantity);
        }
        return updated;
      })
    );
  }

  function addLine()          { setLineItems((p) => [...p, emptyLine()]); }
  function removeLine(id: string) { setLineItems((p) => p.length > 1 ? p.filter((i) => i.id !== id) : p); }

  function validate() {
    const e: Record<string, string> = {};
    if (!customerName.trim()) e.customerName = 'Required';
    if (lineItems.some((i) => !i.description.trim())) e.lineItems = 'All items need a description';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildInvoice(): Invoice {
    return {
      id: initialInvoice?.id ?? generateId(),
      invoiceNumber, date, customerName, customerTIN, customerVRN,
      paymentMethod, lineItems, subtotal, vatEnabled, vatAmount, total, terms,
      createdAt: initialInvoice?.createdAt ?? new Date().toISOString(),
    };
  }

  function handleSave() {
    if (!validate()) return;
    onSave(buildInvoice());
    if (!initialInvoice) onIncrementNumber();
    setSaved(true);
  }

  function handlePreview() {
    if (!validate()) return;
    setShowModal(true);
  }

  function handleSaveFromModal() {
    onSave(buildInvoice());
    if (!initialInvoice) onIncrementNumber();
    setShowModal(false);
    setSaved(true);
  }

  const currentInvoice: Partial<Invoice> = {
    invoiceNumber, date, customerName, customerTIN, customerVRN,
    paymentMethod, lineItems, subtotal, vatEnabled, vatAmount, total, terms,
  };

  // ── shared styles ──
  const card: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)',
    border: '1px solid rgba(226,232,240,0.8)',
  };
  const input: React.CSSProperties = {
    width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    padding: '10px 14px', fontSize: '14px', outline: 'none',
    backgroundColor: '#fafbfc', color: '#1a202c', fontFamily: 'Inter, sans-serif',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700, color: '#718096',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.7px',
  };
  const accent = { width: '4px', height: '16px', backgroundColor: '#064e3b', borderRadius: '2px', display: 'inline-block' as const };
  const sectionHead: React.CSSProperties = {
    fontSize: '13px', fontWeight: 700, color: '#2d3748',
    textTransform: 'uppercase', letterSpacing: '0.8px',
    marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
  };

  return (
    <>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', margin: 0, lineHeight: 1.2 }}>
              {initialInvoice?.id ? 'Edit Invoice' : 'Create Invoice'}
            </h1>
            <p style={{ fontSize: '13px', color: '#718096', marginTop: '4px', margin: '4px 0 0' }}>
              {initialInvoice?.id ? `Editing #${invoiceNumber}` : 'Fill in the details to generate a new invoice'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '11px', color: '#a0aec0', fontWeight: 600 }}>Invoice #</span>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              style={{ ...input, width: '100px', fontWeight: 800, fontSize: '15px', color: '#064e3b', textAlign: 'center', letterSpacing: '2px', padding: '7px 10px' }}
            />
          </div>
        </div>

        {/* ── DATE + PAYMENT ── */}
        <div style={card}>
          <div style={sectionHead}><span style={accent} />Invoice Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            <div>
              <label style={lbl}>Invoice Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
            </div>
            <div>
              <label style={lbl}>Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ ...input, cursor: 'pointer' }}>
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── CUSTOMER ── */}
        <div style={card}>
          <div style={sectionHead}><span style={accent} />Customer Details</div>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label style={lbl}>Company / Customer Name *</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Wakandi Company Ltd"
                style={{ ...input, borderColor: errors.customerName ? '#fc8181' : '#e2e8f0' }}
              />
              {errors.customerName && <span style={{ fontSize: '12px', color: '#e53e3e', marginTop: '4px', display: 'block' }}>{errors.customerName}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div>
                <label style={lbl}>TIN Number</label>
                <input value={customerTIN} onChange={(e) => setCustomerTIN(e.target.value)} placeholder="Optional" style={input} />
              </div>
              <div>
                <label style={lbl}>VRN</label>
                <input value={customerVRN} onChange={(e) => setCustomerVRN(e.target.value)} placeholder="Optional" style={input} />
              </div>
            </div>
          </div>
        </div>

        {/* ── LINE ITEMS ── */}
        <div style={card}>
          <div style={{ ...sectionHead, justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={accent} />Line Items
            </div>
            {errors.lineItems && <span style={{ fontSize: '12px', color: '#e53e3e', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>{errors.lineItems}</span>}
          </div>

          {/* Desktop column headers */}
          <div className="line-item-header" style={{ display: 'grid', gridTemplateColumns: '28px 1fr 110px 70px 100px 30px', gap: '8px', marginBottom: '8px', padding: '0 2px' }}>
            {['#', 'Description', 'Price', 'Qty', 'Total', ''].map((h, i) => (
              <span key={i} style={{ fontSize: '10px', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i >= 2 && i < 5 ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>

          {/* Line item rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lineItems.map((item, idx) => (
              <div key={item.id} className="line-item-row">
                {/* Desktop layout */}
                <div className="line-item-desktop" style={{ display: 'grid', gridTemplateColumns: '28px 1fr 110px 70px 100px 30px', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '26px', height: '26px', backgroundColor: '#064e3b', color: '#fff', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <input value={item.description} onChange={(e) => updateLine(item.id, 'description', e.target.value)} placeholder="Item description..." style={{ ...input, fontSize: '13px' }} />
                  <input type="number" min={0} value={item.price || ''} onChange={(e) => updateLine(item.id, 'price', parseFloat(e.target.value) || 0)} placeholder="0" style={{ ...input, fontSize: '13px', textAlign: 'right' }} />
                  <input type="number" min={1} value={item.quantity} onChange={(e) => updateLine(item.id, 'quantity', parseInt(e.target.value) || 1)} style={{ ...input, fontSize: '13px', textAlign: 'center' }} />
                  <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '13px', color: '#064e3b', padding: '0 2px' }}>{formatCurrency(item.total)}</div>
                  <button onClick={() => removeLine(item.id)} disabled={lineItems.length === 1}
                    style={{ width: '28px', height: '28px', borderRadius: '7px', border: 'none', backgroundColor: lineItems.length === 1 ? '#f7fafc' : '#fff5f5', color: lineItems.length === 1 ? '#cbd5e0' : '#fc8181', cursor: lineItems.length === 1 ? 'not-allowed' : 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    ×
                  </button>
                </div>

                {/* Mobile layout — stacked card */}
                <div className="line-item-mobile" style={{ display: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '26px', height: '26px', backgroundColor: '#064e3b', color: '#fff', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1, fontWeight: 700, fontSize: '12px', color: '#064e3b' }}>Item {idx + 1}</div>
                    <button onClick={() => removeLine(item.id)} disabled={lineItems.length === 1}
                      style={{ width: '28px', height: '28px', borderRadius: '7px', border: 'none', backgroundColor: lineItems.length === 1 ? '#f7fafc' : '#fff5f5', color: lineItems.length === 1 ? '#cbd5e0' : '#fc8181', cursor: lineItems.length === 1 ? 'not-allowed' : 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                      ×
                    </button>
                  </div>
                  <input value={item.description} onChange={(e) => updateLine(item.id, 'description', e.target.value)} placeholder="Item description..." style={{ ...input, fontSize: '13px', marginBottom: '8px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ ...lbl, fontSize: '10px' }}>Unit Price</label>
                      <input type="number" min={0} value={item.price || ''} onChange={(e) => updateLine(item.id, 'price', parseFloat(e.target.value) || 0)} placeholder="0" style={{ ...input, fontSize: '13px', textAlign: 'right' }} />
                    </div>
                    <div>
                      <label style={{ ...lbl, fontSize: '10px' }}>Quantity</label>
                      <input type="number" min={1} value={item.quantity} onChange={(e) => updateLine(item.id, 'quantity', parseInt(e.target.value) || 1)} style={{ ...input, fontSize: '13px', textAlign: 'center' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '14px', color: '#064e3b', marginTop: '8px' }}>
                    Total: {formatCurrency(item.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add line + VAT toggle */}
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={addLine}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1.5px dashed #a7f3d0', backgroundColor: '#f0fdf4', color: '#064e3b', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Line Item
            </button>
            <button
              onClick={() => setVatEnabled((v) => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: `1.5px solid ${vatEnabled ? '#064e3b' : '#e2e8f0'}`, backgroundColor: vatEnabled ? '#f0fdf4' : '#fafbfc', color: vatEnabled ? '#064e3b' : '#718096', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `2px solid ${vatEnabled ? '#064e3b' : '#cbd5e0'}`, backgroundColor: vatEnabled ? '#064e3b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {vatEnabled && <svg width="10" height="10" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              VAT 18%
            </button>
          </div>

          {/* Totals breakdown */}
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: '#064e3b', color: '#fff', borderRadius: '12px', padding: '12px 20px', minWidth: '200px' }}>
              {vatEnabled && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', opacity: 0.8, fontSize: '12px' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', opacity: 0.8, fontSize: '12px' }}>
                    <span>VAT (18%)</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(vatAmount)}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: '8px' }} />
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Total</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{formatCurrency(total)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TERMS ── */}
        <div style={card}>
          <div style={sectionHead}><span style={accent} />Terms &amp; Conditions</div>
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={3}
            style={{ ...input, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
            placeholder="Enter your terms and conditions..." />
        </div>

        {/* ── ACTIONS ── */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button onClick={handlePreview}
            style={{ flex: '1 1 140px', padding: '13px', borderRadius: '14px', border: '2px solid #064e3b', backgroundColor: 'transparent', color: '#064e3b', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontFamily: 'Inter, sans-serif' }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Invoice
          </button>
          <button onClick={handleSave}
            style={{ flex: '1 1 140px', padding: '13px', borderRadius: '14px', background: saved ? 'linear-gradient(135deg,#38a169,#2f855a)' : 'linear-gradient(135deg,#064e3b,#065f46)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 4px 14px rgba(6,78,59,0.4)', fontFamily: 'Inter, sans-serif' }}>
            {saved ? (
              <><svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Saved!</>
            ) : (
              <><svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save Invoice</>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showModal && (
        <PreviewModal
          invoice={currentInvoice}
          settings={settings}
          onClose={() => setShowModal(false)}
          onSave={handleSaveFromModal}
        />
      )}

      {/* Responsive line-item styles */}
      <style>{`
        @media (max-width: 600px) {
          .line-item-header   { display: none !important; }
          .line-item-desktop  { display: none !important; }
          .line-item-mobile   { display: block !important; }
          .line-item-row {
            background: #fafbfc;
            border: 1.5px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
}
