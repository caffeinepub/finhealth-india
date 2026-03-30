import { Info } from "lucide-react";

export const FINANCE_TERMS: Record<string, string> = {
  CAGR: "Compound Annual Growth Rate — the rate at which an investment grows annually over a specified period.",
  SIP: "Systematic Investment Plan — invest a fixed amount regularly (monthly) in mutual funds.",
  "Risk Profile":
    "Your risk tolerance level (Low/Medium/High) that determines suitable investment types.",
  XIRR: "Extended Internal Rate of Return — measures actual annualised return of investments made at different times.",
  NAV: "Net Asset Value — the per-unit market value of a mutual fund scheme.",
  ULIP: "Unit Linked Insurance Plan — insurance + investment product where premium goes to life cover and market investments.",
  "Policy Returns":
    "The annualised return on your insurance or investment policy, often expressed as CAGR or IRR.",
  "Expected Returns":
    "The anticipated annual growth rate (%) for your SIP investment based on historical market performance.",
};

interface SmartTooltipProps {
  term: string;
  explanation: string;
}

export default function SmartTooltip({ term, explanation }: SmartTooltipProps) {
  return (
    <span
      className="smart-tooltip-wrapper"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
      }}
    >
      <Info
        size={13}
        className="smart-tooltip-icon"
        style={{
          color: "#9AA6B2",
          cursor: "help",
          marginLeft: 3,
          flexShrink: 0,
          transition: "color 0.2s",
        }}
      />
      <span
        className="smart-tooltip-card"
        role="tooltip"
        aria-label={`${term}: ${explanation}`}
        style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: 220,
          background: "#0F141B",
          border: "1px solid #B8FF4A44",
          borderRadius: 10,
          padding: "10px 12px",
          zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.15s",
          whiteSpace: "normal",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 700,
            color: "#B8FF4A",
            marginBottom: 4,
          }}
        >
          {term}
        </p>
        <p
          style={{ margin: 0, fontSize: 11, color: "#9AA6B2", lineHeight: 1.5 }}
        >
          {explanation}
        </p>
        <span
          style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 8,
            height: 8,
            background: "#0F141B",
            border: "1px solid #B8FF4A44",
            borderTop: "none",
            borderLeft: "none",
          }}
        />
      </span>
      <style>{`
        .smart-tooltip-wrapper:hover .smart-tooltip-icon { color: #B8FF4A; }
        .smart-tooltip-wrapper:hover .smart-tooltip-card { opacity: 1; }
      `}</style>
    </span>
  );
}
