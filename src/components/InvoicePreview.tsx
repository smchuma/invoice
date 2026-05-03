import type { Invoice, CompanySettings } from "../types";
import { formatCurrency, formatDate } from "../utils/formatting";

interface Props {
  invoice: Partial<Invoice>;
  settings: CompanySettings;
}

export default function InvoicePreview({ invoice, settings }: Props) {
  const green = settings.primaryColor || "#064e3b";
  const lineItems = invoice.lineItems ?? [];
  const subtotal = invoice.subtotal ?? 0;
  const vatEnabled = invoice.vatEnabled ?? false;
  const vatAmount = invoice.vatAmount ?? 0;
  const total = invoice.total ?? 0;

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff",
        width: "100%",
        maxWidth: "760px",
        margin: "0 auto",
        fontSize: "13px",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          backgroundColor: green,
          color: "#fff",
          padding: "28px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 900,
              fontSize: "20px",
              letterSpacing: "1.5px",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            {settings.name}
          </div>
          <div style={{ fontSize: "12px", lineHeight: 2, opacity: 0.85 }}>
            {settings.address}
            <br />
            {settings.poBox}
            <br />
            Tel: {settings.phone1} / {settings.phone2}
            <br />
            {settings.email} | {settings.website}
          </div>
        </div>
        {settings.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt="logo"
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.35)",
            }}
          />
        ) : (
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontWeight: 900,
                fontSize: "26px",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              BW
            </span>
            <span
              style={{
                fontSize: "8px",
                opacity: 0.7,
                letterSpacing: "1px",
                marginTop: "2px",
              }}
            >
              GRAPHIC
            </span>
          </div>
        )}
      </div>

      {/* ── INVOICE TITLE + NUMBER ── */}
      <div style={{ padding: "20px 36px 0", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontWeight: 700,
            fontSize: "56px",
            color: green,
            lineHeight: 1,
            marginBottom: "2px",
          }}
        >
          Invoice
        </div>
      </div>
      <div
        style={{
          padding: "4px 36px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ fontWeight: 800, color: green, fontSize: "15px" }}>
            No:{" "}
          </span>
          <span
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontStyle: "italic",
              fontSize: "22px",
              color: "#2d3748",
              fontWeight: 700,
            }}
          >
            {invoice.invoiceNumber || "00000"}
          </span>
        </div>
        <div style={{ fontSize: "12px", color: "#718096" }}>
          Date:{" "}
          <strong style={{ color: "#2d3748" }}>
            {invoice.date ? formatDate(invoice.date) : "—"}
          </strong>
        </div>
      </div>

      {/* ── CUSTOMER + PAYMENT ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          padding: "0 36px 18px",
        }}
      >
        <div
          style={{
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            padding: "18px",
          }}
        >
          <div
            style={{ fontSize: "11px", color: "#a0aec0", marginBottom: "4px" }}
          >
            Invoice to:
          </div>
          <div
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "26px",
              fontWeight: 700,
              color: "#1a202c",
              marginBottom: "10px",
              lineHeight: 1.2,
            }}
          >
            {invoice.customerName || "Customer Name"}
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: "11px",
              color: "#2d3748",
              letterSpacing: "0.8px",
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            Customer Details
          </div>
          <div style={{ fontSize: "12px", color: "#4a5568", lineHeight: 2 }}>
            <div>
              <strong>TIN No:</strong> {invoice.customerTIN || "—"}
            </div>
            <div>
              <strong>VRN:</strong> {invoice.customerVRN || "—"}
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: green,
                marginBottom: "4px",
              }}
            >
              Payment Method
            </div>
            <div
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "24px",
                fontWeight: 700,
                color: "#1a202c",
                marginBottom: "12px",
              }}
            >
              {invoice.paymentMethod || "Cash"}
            </div>
          </div>
          <div>
            {vatEnabled && (
              <div style={{ fontSize: "11px", color: "#4a5568", marginBottom: "6px", lineHeight: 1.9 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>VAT (18%):</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(vatAmount)}</span>
                </div>
              </div>
            )}
            <div
              style={{
                fontSize: "11px",
                color: "#a0aec0",
                marginBottom: "4px",
              }}
            >
              Amount Due:
            </div>
            <div
              style={{
                backgroundColor: green,
                color: "#fff",
                borderRadius: "8px",
                padding: "11px 14px",
                fontWeight: 700,
                fontSize: "17px",
              }}
            >
              {formatCurrency(total)}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div style={{ padding: "0 36px 18px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50px 1fr 120px 60px 120px",
            backgroundColor: green,
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 14px",
            fontWeight: 700,
            fontSize: "12px",
            marginBottom: "6px",
            letterSpacing: "0.5px",
          }}
        >
          <span>No.</span>
          <span>Product Details</span>
          <span style={{ textAlign: "right" }}>Price</span>
          <span style={{ textAlign: "center" }}>Qty</span>
          <span style={{ textAlign: "right" }}>Total</span>
        </div>

        {lineItems.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#a0aec0",
              fontSize: "12px",
            }}
          >
            No items
          </div>
        )}

        {lineItems.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "50px 1fr 120px 60px 120px",
              backgroundColor: idx % 2 === 0 ? green : "#0a5c45",
              color: "#fff",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "5px",
              fontWeight: 600,
              fontSize: "12px",
              alignItems: "center",
            }}
          >
            <span>{String(idx + 1).padStart(2, "0")}.</span>
            <span>{item.description}</span>
            <span style={{ textAlign: "right" }}>
              {formatCurrency(item.price)}
            </span>
            <span style={{ textAlign: "center" }}>{item.quantity}</span>
            <span style={{ textAlign: "right" }}>
              {formatCurrency(item.total)}
            </span>
          </div>
        ))}
      </div>

      {/* ── FOOTER: TERMS + TOTAL ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          padding: "0 36px 24px",
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              backgroundColor: green,
              color: "#fff",
              fontWeight: 800,
              fontSize: "11px",
              letterSpacing: "0.8px",
              padding: "7px 12px",
              borderRadius: "6px",
              display: "inline-block",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Terms &amp; Conditions
          </div>
          <div
            style={{
              fontStyle: "italic",
              fontSize: "12px",
              color: "#718096",
              lineHeight: 1.7,
            }}
          >
            {invoice.terms || settings.defaultTerms}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          {vatEnabled && (
            <div style={{ width: "100%", fontSize: "12px", color: "#4a5568", lineHeight: 2, marginBottom: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>VAT (18%):</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(vatAmount)}</span>
              </div>
            </div>
          )}
          <div
            style={{
              backgroundColor: green,
              color: "#fff",
              borderRadius: "8px",
              padding: "11px 18px",
              fontWeight: 700,
              fontSize: "15px",
              width: "100%",
              textAlign: "center",
            }}
          >
            Total : {formatCurrency(total)}
          </div>
          <div style={{ textAlign: "center", width: "100%" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#718096",
                marginBottom: "6px",
              }}
            >
              Administrator Signature
            </div>
            <div
              style={{
                height: "44px",
                borderBottom: "1.5px solid #cbd5e0",
                width: "150px",
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        style={{
          backgroundColor: green,
          color: "#fff",
          textAlign: "center",
          padding: "16px 36px",
          fontSize: "12px",
          lineHeight: 1.9,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "13px" }}>
          Thank You For Your Business!
        </div>
        <div>For all your branding, signage, awards, and printing needs,</div>
        <div>
          follow us on instagram, facebook, tiktok, and twitter (X). - @
          {settings.name.toLowerCase().replace(/\s+/g, "")}
        </div>
        <div>
          {settings.email} | Call: {settings.phone1} / {settings.phone2}
        </div>
      </div>
    </div>
  );
}
