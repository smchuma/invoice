import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Invoice, CompanySettings } from "../types";
import InvoicePreview from "./InvoicePreview";
import { printElement } from "../utils/print";

interface Props {
  invoice: Partial<Invoice>;
  settings: CompanySettings;
  onClose: () => void;
  onSave?: () => void;
}

export default function PreviewModal({
  invoice,
  settings,
  onClose,
  onSave,
}: Props) {
  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function handlePrint() {
    printElement('invoice-print-root', `Invoice ${invoice.invoiceNumber ?? ''}`);
  }

  const green = settings.primaryColor || "#064e3b";

  const modal = (
    <>
      {/* ── Modal backdrop ── */}
      <div
        className="no-print"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "20px 16px 40px",
          overflowY: "auto",
        }}
      >
        {/* Modal card */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "820px",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            backgroundColor: "#fff",
            marginTop: "10px",
            animation: "modalIn 0.2s ease",
          }}
        >
          {/* ── Toolbar ── */}
          <div
            className="modal-toolbar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              padding: "14px 18px",
              background: `linear-gradient(135deg, ${green} 0%, ${green}cc 100%)`,
              color: "#fff",
            }}
          >
            {/* Left: title */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "15px" }}>
                  Invoice Preview
                </div>
                <div
                  style={{ fontSize: "12px", opacity: 0.65, marginTop: "1px" }}
                >
                  #{invoice.invoiceNumber} ·{" "}
                  {invoice.customerName || "Customer"}
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {onSave && (
                <button
                  onClick={() => {
                    onSave();
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 18px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save Invoice
                </button>
              )}

              <button
                onClick={handlePrint}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  color: green,
                  border: "none",
                  fontWeight: 800,
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print / PDF
              </button>

              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* ── Invoice body ── */}
          <div
            className="modal-body"
            style={{ backgroundColor: "#f0f4f8", padding: "20px" }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                overflowX: "auto",
              }}
            >
              <div id="invoice-print-root" style={{ minWidth: "480px" }}>
                <InvoicePreview invoice={invoice} settings={settings} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        /* Mobile: full-screen modal */
        @media (max-width: 600px) {
          .modal-body { padding: 10px !important; }
          .modal-toolbar { padding: 10px 12px !important; }
        }
      `}</style>
    </>
  );

  return createPortal(modal, document.body);
}
