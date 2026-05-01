import { useState, useEffect } from "react";
import { useSettings } from "./hooks/useSettings";
import { useInvoices } from "./hooks/useInvoices";
import { generateId, formatInvoiceNumber } from "./utils/formatting";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import InvoiceViewer from "./components/InvoiceViewer";
import Settings from "./components/Settings";
import type { Invoice, AppView } from "./types";

export default function App() {
  const { settings, updateSettings, incrementInvoiceNumber } = useSettings();
  const { invoices, saveInvoice, deleteInvoice } = useInvoices();

  const [view, setView] = useState<AppView>("form");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  function navigate(nextView: AppView) {
    setView(nextView);
    setSidebarOpen(false);
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const sidebar = document.getElementById("app-sidebar");
      const toggle = document.getElementById("hamburger-btn");
      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        !toggle?.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  function handleSave(invoice: Invoice) {
    saveInvoice(invoice);
    navigate("list");
    setEditingInvoice(undefined);
  }

  function handleNew() {
    setEditingInvoice(undefined);
    navigate("form");
  }
  function handleEdit(inv: Invoice) {
    setEditingInvoice(inv);
    navigate("form");
  }
  function handleView(inv: Invoice) {
    setViewingInvoice(inv);
    navigate("view");
  }
  function handleDuplicate(inv: Invoice) {
    setEditingInvoice({
      ...inv,
      id: generateId(),
      invoiceNumber: formatInvoiceNumber(settings.nextInvoiceNumber),
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    });
    navigate("form");
  }

  const green = settings.primaryColor || "#064e3b";

  const navItems = [
    {
      label: "New Invoice",
      key: "form" as AppView,
      emoji: "✨",
      desc: "Create invoice",
    },
    {
      label: "Invoices",
      key: "list" as AppView,
      emoji: "📄",
      desc: "All invoices",
    },
    {
      label: "Settings",
      key: "settings" as AppView,
      emoji: "⚙️",
      desc: "Customise app",
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "13px",
                color: "#fff",
                flexShrink: 0,
                letterSpacing: "-0.5px",
              }}
            >
              BW
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: "13px",
                color: "#fff",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {settings.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "2px",
              }}
            >
              Invoice System
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {navItems.map((item) => {
          const active =
            view === item.key || (view === "view" && item.key === "list");
          return (
            <button
              key={item.key}
              onClick={() =>
                item.key === "form" ? handleNew() : navigate(item.key)
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 12px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                backgroundColor: active
                  ? "rgba(255,255,255,0.18)"
                  : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                fontFamily: "Inter, sans-serif",
                marginBottom: "3px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0 }}>
                {item.emoji}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: active ? 700 : 500,
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{ fontSize: "10px", opacity: 0.6, marginTop: "1px" }}
                >
                  {item.desc}
                </div>
              </div>
              {item.key === "list" && invoices.length > 0 && (
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.22)",
                    color: "#fff",
                    borderRadius: "20px",
                    padding: "1px 7px",
                    fontSize: "11px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {invoices.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Next invoice # */}
      <div
        style={{
          margin: "0 10px 20px",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            marginBottom: "6px",
          }}
        >
          Next Invoice #
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "3px",
            fontFamily: "monospace",
          }}
        >
          {formatInvoiceNumber(settings.nextInvoiceNumber)}
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      {/* ── DESKTOP SIDEBAR (≥768 px) ── */}
      <aside
        id="app-sidebar"
        className="no-print"
        style={{
          width: "240px",
          flexShrink: 0,
          background: `linear-gradient(180deg, ${green} 0%, ${green}ee 100%)`,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          // hide below 768 px via inline media — handled by the responsive <style> tag
          zIndex: 40,
        }}
      >
        {SidebarContent()}
      </aside>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(3px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        id="mobile-sidebar"
        className="no-print"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "260px",
          zIndex: 60,
          background: `linear-gradient(180deg, ${green} 0%, ${green}ee 100%)`,
          display: "flex",
          flexDirection: "column",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: sidebarOpen ? "4px 0 32px rgba(0,0,0,0.3)" : "none",
          overflowY: "auto",
        }}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ×
        </button>
        {SidebarContent()}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── MOBILE TOP BAR ── */}
        <header
          id="mobile-topbar"
          className="no-print"
          style={{
            display: "none" /* shown via responsive style tag */,
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            backgroundColor: green,
            color: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 30,
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          {/* Hamburger */}
          <button
            id="hamburger-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              flexShrink: 0,
            }}
            aria-label="Open menu"
          >
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                display: "block",
                width: "14px",
                height: "2px",
                backgroundColor: "#fff",
                borderRadius: "2px",
                alignSelf: "flex-start",
                marginLeft: "2px",
              }}
            />
          </button>

          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>
              {settings.name}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6 }}>Invoice System</div>
          </div>

          {/* Quick new invoice button */}
          <button
            onClick={handleNew}
            style={{
              padding: "7px 13px",
              borderRadius: "9px",
              backgroundColor: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New
          </button>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main
          style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}
          id="main-content"
        >
          {view === "form" && (
            <InvoiceForm
              key={editingInvoice?.id ?? "new"}
              settings={settings}
              initialInvoice={editingInvoice}
              onSave={handleSave}
              onIncrementNumber={incrementInvoiceNumber}
            />
          )}
          {view === "list" && (
            <InvoiceList
              invoices={invoices}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={deleteInvoice}
              onDuplicate={handleDuplicate}
              onNew={handleNew}
            />
          )}
          {view === "view" && viewingInvoice && (
            <InvoiceViewer
              invoice={viewingInvoice}
              settings={settings}
              onBack={() => navigate("list")}
              onEdit={() => handleEdit(viewingInvoice)}
            />
          )}
          {view === "settings" && (
            <Settings settings={settings} onUpdate={updateSettings} />
          )}
        </main>
      </div>

      {/* ── Responsive breakpoint styles ── */}
      <style>{`
        /* Mobile: hide desktop sidebar, show top bar */
        @media (max-width: 767px) {
          #app-sidebar       { display: none !important; }
          #mobile-topbar     { display: flex !important; }
          #main-content      { padding: 16px 14px !important; }
        }
        /* Tablet / small desktop */
        @media (min-width: 768px) {
          #mobile-sidebar    { display: none !important; }
          #mobile-topbar     { display: none !important; }
        }
      `}</style>
    </div>
  );
}
