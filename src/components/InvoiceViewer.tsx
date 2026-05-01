import React from 'react';
import type { Invoice, CompanySettings } from '../types';
import InvoicePreview from './InvoicePreview';

interface Props {
  invoice: Invoice;
  settings: CompanySettings;
  onBack: () => void;
  onEdit: () => void;
}

export default function InvoiceViewer({ invoice, settings, onBack, onEdit }: Props) {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Toolbar */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', backgroundColor: '#fff', color: '#4a5568', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1a202c' }}>Invoice #{invoice.invoiceNumber}</h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#718096' }}>{invoice.customerName}</p>
        </div>
        <button
          onClick={onEdit}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: '2px solid #1d4ed8', backgroundColor: 'transparent', color: '#1d4ed8', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #064e3b, #065f46)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(6,78,59,0.35)' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / PDF
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(226,232,240,0.8)' }}>
        <InvoicePreview invoice={invoice} settings={settings} />
      </div>
    </div>
  );
}
