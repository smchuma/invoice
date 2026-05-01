import React, { useState } from 'react';
import type { CompanySettings } from '../types';

interface Props {
  settings: CompanySettings;
  onUpdate: (updates: Partial<CompanySettings>) => void;
}

export default function Settings({ settings, onUpdate }: Props) {
  const [local, setLocal] = useState<CompanySettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  function set(field: keyof CompanySettings, value: string | number) {
    setLocal((p) => ({ ...p, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    onUpdate(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('logoUrl', ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const card: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)',
    border: '1px solid rgba(226,232,240,0.8)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fafbfc',
    color: '#1a202c',
    fontFamily: 'Inter, sans-serif',
  };

  const label: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#718096',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '13px', fontWeight: 700, color: '#2d3748',
    textTransform: 'uppercase', letterSpacing: '0.8px',
    marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px',
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a202c', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>Customize your company details and invoice defaults</p>
      </div>

      {/* Company Info */}
      <div style={card}>
        <div style={sectionTitle}>
          <span style={{ width: '4px', height: '16px', backgroundColor: '#064e3b', borderRadius: '2px', display: 'inline-block' }} />
          Company Information
        </div>
        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={label}>Company Name</label>
            <input value={local.name} onChange={(e) => set('name', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div>
              <label style={label}>Street Address</label>
              <input value={local.address} onChange={(e) => set('address', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={label}>P.O. Box</label>
              <input value={local.poBox} onChange={(e) => set('poBox', e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div>
              <label style={label}>Primary Phone</label>
              <input value={local.phone1} onChange={(e) => set('phone1', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={label}>Secondary Phone</label>
              <input value={local.phone2} onChange={(e) => set('phone2', e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div>
              <label style={label}>Email Address</label>
              <input type="email" value={local.email} onChange={(e) => set('email', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={label}>Website</label>
              <input value={local.website} onChange={(e) => set('website', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* Logo + Color */}
      <div style={card}>
        <div style={sectionTitle}>
          <span style={{ width: '4px', height: '16px', backgroundColor: '#064e3b', borderRadius: '2px', display: 'inline-block' }} />
          Branding
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Logo upload */}
          <div>
            <label style={label}>Company Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '14px', backgroundColor: local.logoUrl ? 'transparent' : '#064e3b', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #e2e8f0' }}>
                {local.logoUrl
                  ? <img src={local.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#fff', fontWeight: 900, fontSize: '18px' }}>BW</span>
                }
              </div>
              <div>
                <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #064e3b', color: '#064e3b', fontWeight: 700, fontSize: '12px' }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogo} />
                </label>
                {local.logoUrl && (
                  <button onClick={() => set('logoUrl', '')} style={{ display: 'block', marginTop: '6px', fontSize: '12px', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Inter, sans-serif' }}>
                    Remove logo
                  </button>
                )}
                <p style={{ fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>PNG, JPG or SVG</p>
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label style={label}>Primary Color</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="color" value={local.primaryColor} onChange={(e) => set('primaryColor', e.target.value)}
                style={{ width: '52px', height: '52px', borderRadius: '12px', border: '2px solid #e2e8f0', cursor: 'pointer', padding: '4px' }} />
              <div style={{ flex: 1 }}>
                <input value={local.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} style={{ ...inputStyle, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {['#064e3b', '#1e3a8a', '#4c1d95', '#7c2d12', '#1f2937', '#be123c'].map((c) => (
                <button key={c} onClick={() => set('primaryColor', c)} title={c}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: c, border: local.primaryColor === c ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer', outline: local.primaryColor === c ? `3px solid ${c}` : 'none', boxShadow: local.primaryColor === c ? `0 0 0 2px ${c}` : 'none' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice defaults */}
      <div style={card}>
        <div style={sectionTitle}>
          <span style={{ width: '4px', height: '16px', backgroundColor: '#064e3b', borderRadius: '2px', display: 'inline-block' }} />
          Invoice Defaults
        </div>
        <div style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={label}>Next Invoice Number</label>
            <input
              type="number"
              value={local.nextInvoiceNumber}
              onChange={(e) => set('nextInvoiceNumber', parseInt(e.target.value) || 1)}
              style={{ ...inputStyle, width: '200px', fontFamily: 'monospace', fontWeight: 700, fontSize: '18px', letterSpacing: '3px' }}
            />
            <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '6px' }}>
              Will display as: <strong style={{ color: '#064e3b', fontFamily: 'monospace' }}>{String(local.nextInvoiceNumber).padStart(5, '0')}</strong>
            </p>
          </div>
          <div>
            <label style={label}>Default Terms &amp; Conditions</label>
            <textarea
              value={local.defaultTerms}
              onChange={(e) => set('defaultTerms', e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
              placeholder="Goods Once Sold Are Non-Refundable..."
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
          background: saved ? 'linear-gradient(135deg, #38a169, #2f855a)' : 'linear-gradient(135deg, #064e3b, #065f46)',
          color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(6,78,59,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          marginBottom: '32px',
        }}
      >
        {saved ? (
          <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Settings Saved!</>
        ) : (
          <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> Save Settings</>
        )}
      </button>
    </div>
  );
}
