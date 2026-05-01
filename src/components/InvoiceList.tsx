import React, { useState } from 'react';
import type { Invoice } from '../types';
import { formatCurrency, formatDate } from '../utils/formatting';

interface Props {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onDuplicate: (invoice: Invoice) => void;
  onNew: () => void;
}

const PAYMENT_COLORS: Record<string, { bg: string; text: string }> = {
  Cash:            { bg: '#f0fdf4', text: '#16a34a' },
  'M-Pesa':        { bg: '#eff6ff', text: '#2563eb' },
  'Mixx by Yas':   { bg: '#fdf4ff', text: '#9333ea' },
  'Bank Transfer': { bg: '#fff7ed', text: '#ea580c' },
  Cheque:          { bg: '#fafafa', text: '#64748b' },
};

const avatarColors = ['#064e3b','#065f46','#047857','#0f766e','#0e7490','#1d4ed8','#4f46e5','#7c3aed'];
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials    = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export default function InvoiceList({ invoices, onView, onEdit, onDelete, onDuplicate, onNew }: Props) {
  const [search, setSearch]           = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const thisMonth  = new Date().toISOString().slice(0, 7);
  const filtered   = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.includes(search)
  );
  const totalRev   = invoices.reduce((s, i) => s + i.total, 0);
  const monthCount = invoices.filter((i) => i.date?.startsWith(thisMonth)).length;

  function confirmDelete(id: string) {
    if (deleteConfirm === id) { onDelete(id); setDeleteConfirm(null); }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000); }
  }

  const card: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)',
    border: '1px solid rgba(226,232,240,0.8)',
    overflow: 'hidden',
  };

  return (
    <>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ── STATS ── */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Invoices', value: invoices.length,         emoji: '📄' },
            { label: 'Total Revenue',  value: formatCurrency(totalRev), emoji: '💰' },
            { label: 'This Month',     value: monthCount,               emoji: '📅' },
          ].map((s) => (
            <div key={s.label} style={{ ...card, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {s.emoji}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a202c', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#718096', marginTop: '3px', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN CARD ── */}
        <div style={card}>
          {/* Toolbar */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', margin: 0, flexShrink: 0 }}>All Invoices</h2>
            <div style={{ flex: '1 1 180px', position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', pointerEvents: 'none' }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or #..."
                style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', backgroundColor: '#fafbfc' }} />
            </div>
            <button onClick={onNew}
              style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '10px', background: 'linear-gradient(135deg,#064e3b,#065f46)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 12px rgba(6,78,59,0.35)', fontFamily: 'Inter, sans-serif' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Invoice
            </button>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ fontSize: '50px', marginBottom: '14px' }}>🧾</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#2d3748', marginBottom: '6px' }}>
                {search ? 'No results found' : 'No invoices yet'}
              </div>
              <div style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '20px' }}>
                {search ? `No invoices match "${search}"` : 'Create your first invoice to get started'}
              </div>
              {!search && (
                <button onClick={onNew} style={{ padding: '10px 22px', borderRadius: '12px', background: 'linear-gradient(135deg,#064e3b,#065f46)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Create First Invoice
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table header */}
              <div className="list-desktop-header" style={{ display: 'grid', gridTemplateColumns: '70px 1fr 110px 100px 110px 120px', gap: '0', padding: '10px 20px', backgroundColor: '#fafbfc', borderBottom: '1px solid #f1f5f9' }}>
                {['#', 'Customer', 'Date', 'Payment', 'Total', 'Actions'].map((h, i) => (
                  <span key={h} style={{ fontSize: '10px', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i >= 4 ? 'right' : 'left' }}>{h}</span>
                ))}
              </div>

              {/* Desktop rows */}
              <div className="list-desktop-rows">
                {filtered.map((inv, idx) => {
                  const badge = PAYMENT_COLORS[inv.paymentMethod] ?? { bg: '#f8fafc', text: '#64748b' };
                  return (
                    <div key={inv.id}
                      onClick={() => onView(inv)}
                      style={{ display: 'grid', gridTemplateColumns: '70px 1fr 110px 100px 110px 120px', gap: '0', padding: '13px 20px', borderBottom: idx < filtered.length - 1 ? '1px solid #f8fafc' : 'none', alignItems: 'center', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafbfc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ fontWeight: 800, fontSize: '12px', color: '#064e3b' }}>#{inv.invoiceNumber}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: getAvatarColor(inv.customerName), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
                          {getInitials(inv.customerName)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#1a202c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inv.customerName}</div>
                          <div style={{ fontSize: '11px', color: '#a0aec0' }}>{inv.lineItems.length} item{inv.lineItems.length !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>{formatDate(inv.date)}</div>
                      <div><span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: badge.bg, color: badge.text, padding: '3px 9px', borderRadius: '20px' }}>{inv.paymentMethod}</span></div>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#064e3b', textAlign: 'right' }}>{formatCurrency(inv.total)}</div>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        {[
                          { icon: '👁', title: 'View',      action: () => onView(inv) },
                          { icon: '✏️', title: 'Edit',      action: () => onEdit(inv) },
                          { icon: '📋', title: 'Duplicate', action: () => onDuplicate(inv) },
                          { icon: deleteConfirm === inv.id ? '⚠️' : '🗑', title: deleteConfirm === inv.id ? 'Confirm' : 'Delete', action: () => confirmDelete(inv.id) },
                        ].map((btn) => (
                          <button key={btn.title} onClick={btn.action} title={btn.title}
                            style={{ width: '28px', height: '28px', borderRadius: '7px', border: 'none', backgroundColor: deleteConfirm === inv.id && btn.title === 'Confirm' ? '#fef2f2' : '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                            {btn.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile cards */}
              <div className="list-mobile-cards" style={{ display: 'none', padding: '10px 14px', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((inv) => {
                  const badge = PAYMENT_COLORS[inv.paymentMethod] ?? { bg: '#f8fafc', text: '#64748b' };
                  return (
                    <div key={inv.id} onClick={() => onView(inv)}
                      style={{ border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '14px', cursor: 'pointer', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      {/* Top row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: getAvatarColor(inv.customerName), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                            {getInitials(inv.customerName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a202c' }}>{inv.customerName}</div>
                            <div style={{ fontSize: '11px', color: '#a0aec0' }}>#{inv.invoiceNumber} · {formatDate(inv.date)}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#064e3b' }}>{formatCurrency(inv.total)}</div>
                      </div>
                      {/* Bottom row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: badge.bg, color: badge.text, padding: '3px 9px', borderRadius: '20px' }}>{inv.paymentMethod}</span>
                        <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                          {[
                            { icon: '✏️', action: () => onEdit(inv),      title: 'Edit' },
                            { icon: '📋', action: () => onDuplicate(inv), title: 'Duplicate' },
                            { icon: deleteConfirm === inv.id ? '⚠️' : '🗑', action: () => confirmDelete(inv.id), title: 'Delete' },
                          ].map((btn) => (
                            <button key={btn.title} onClick={btn.action} title={btn.title}
                              style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {filtered.length > 0 && (
            <div style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#a0aec0' }}>
              Showing {filtered.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stats-grid               { grid-template-columns: 1fr 1fr !important; }
          .list-desktop-header      { display: none !important; }
          .list-desktop-rows        { display: none !important; }
          .list-mobile-cards        { display: flex !important; }
        }
        @media (max-width: 380px) {
          .stats-grid               { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
