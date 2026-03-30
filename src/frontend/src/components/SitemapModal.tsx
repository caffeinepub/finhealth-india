import { BarChart2, FileText, LayoutDashboard, Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface SitemapModalProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Net worth overview, FinHealth Score, alerts and portfolio summary",
    items: [
      "Net Worth Card",
      "FinHealth Score Gauge",
      "Smart Alerts",
      "Asset Allocation Pie",
    ],
  },
  {
    icon: BarChart2,
    title: "Analysis",
    description:
      "Portfolio breakdown, trends, SEBI compliance, KYC readiness, SIP Calculator, Risk Profile",
    items: [
      "Portfolio Breakdown",
      "Net Worth Trends",
      "Investor Protection & SEBI",
      "KYC Readiness Checklist",
      "SIP Calculator",
      "Risk Profile Engine",
    ],
  },
  {
    icon: Wrench,
    title: "Tools",
    description: "Advanced financial calculators and simulators",
    items: [
      "Stress Test Simulator",
      "Inflation Impact Tracker",
      "Investment Calculator",
      "Rebalancing Simulator",
      "Loan Prepayment Analyzer",
      "Policy Analyzer",
      "ULIP vs SIP",
      "Goal Planner",
      "Spending Analysis",
      "Tax Optimizer",
      "Life Stage Roadmap",
      "Gold vs SGB",
    ],
  },
  {
    icon: FileText,
    title: "Reports",
    description: "Financial DNA Report, Peer Benchmarking, shareable insights",
    items: [
      "Financial DNA Report",
      "Investor Archetype",
      "Peer Benchmarking Badges",
      "Download & Share",
    ],
  },
];

export default function SitemapModal({ open, onClose }: SitemapModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            overflowY: "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            data-ocid="sitemap.modal"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{
              background: "#060A10",
              border: "1px solid #24303A",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #24303A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#EAF0F6",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Site Map
              </h2>
              <button
                type="button"
                data-ocid="sitemap.close_button"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9AA6B2",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {sections.map((section) => (
                <div
                  key={section.title}
                  style={{
                    background: "#0F141B",
                    border: "1px solid #24303A",
                    borderRadius: "12px",
                    padding: "16px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <section.icon size={20} style={{ color: "#B8FF4A" }} />
                    <h3
                      style={{
                        margin: 0,
                        color: "#EAF0F6",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      {section.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      margin: "0 0 12px",
                      color: "#9AA6B2",
                      fontSize: "13px",
                    }}
                  >
                    {section.description}
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {section.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: "rgba(184,255,74,0.08)",
                          color: "#B8FF4A",
                          fontSize: "12px",
                          border: "1px solid rgba(184,255,74,0.15)",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
