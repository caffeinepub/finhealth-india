import { AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

function calcIRR(cashflows: number[]): number {
  let rate = 0.06;
  for (let i = 0; i < 100; i++) {
    const npv = cashflows.reduce((sum, cf, t) => sum + cf / (1 + rate) ** t, 0);
    const dnpv = cashflows.reduce(
      (sum, cf, t) => sum - (t * cf) / (1 + rate) ** (t + 1),
      0,
    );
    if (Math.abs(npv) < 0.01) break;
    rate = rate - npv / dnpv;
    if (rate < -0.99) rate = -0.99;
  }
  return rate * 100;
}

function PolicyAnalyzer() {
  const [premium, setPremium] = useState(50000);
  const [tenure, setTenure] = useState(20);
  const [maturity, setMaturity] = useState(1200000);
  const [sumAssured, setSumAssured] = useState(500000);
  const [analyzed, setAnalyzed] = useState(false);

  const cashflows = [
    ...Array.from({ length: tenure }, (_, i) =>
      i === 0 ? -premium : -premium,
    ),
    maturity,
  ];
  const irr = calcIRR(cashflows);
  const totalPaid = premium * tenure;
  const verdict = irr >= 8 ? "acceptable" : irr >= 5 ? "moderate" : "avoid";
  const verdictColors = {
    acceptable: "#31E981",
    moderate: "#FBCE24",
    avoid: "#F87171",
  };
  const verdictLabels = {
    acceptable: "Acceptable",
    moderate: "Moderate",
    avoid: "Avoid",
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["Annual Premium (\u20b9)", premium, setPremium],
          ["Policy Tenure (years)", tenure, setTenure],
          ["Maturity Value (\u20b9)", maturity, setMaturity],
          ["Sum Assured (\u20b9)", sumAssured, setSumAssured],
        ].map(([l, v, s]) => (
          <div key={l as string}>
            <div className="fin-label">{l as string}</div>
            <input
              type="number"
              className="fin-input"
              value={v as number}
              min={0}
              onChange={(e) =>
                (s as (n: number) => void)(Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="gradient-btn px-6 py-3 rounded-xl font-semibold"
        onClick={() => setAnalyzed(true)}
      >
        Analyze Policy
      </button>

      {analyzed && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-xs mb-1" style={{ color: "#9AA6BF" }}>
                Total Paid
              </div>
              <div className="text-xl font-bold text-white">
                ₹{totalPaid.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-xs mb-1" style={{ color: "#9AA6BF" }}>
                Real IRR
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: verdictColors[verdict] }}
              >
                {irr.toFixed(2)}%
              </div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-xs mb-1" style={{ color: "#9AA6BF" }}>
                Verdict
              </div>
              <div
                className="text-xl font-bold"
                style={{ color: verdictColors[verdict] }}
              >
                {verdictLabels[verdict]}
              </div>
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background: `${verdictColors[verdict]}10`,
              border: `1px solid ${verdictColors[verdict]}30`,
            }}
          >
            {verdict === "avoid" && (
              <p className="text-sm" style={{ color: "#F87171" }}>
                ⚠️ <strong>IRR below 5%:</strong> This policy delivers very low
                returns compared to inflation (~6%). Consider a pure term
                insurance + SIP alternative.
              </p>
            )}
            {verdict === "moderate" && (
              <p className="text-sm" style={{ color: "#FBCE24" }}>
                ⚠️ <strong>IRR 5-8%:</strong> Returns barely beat inflation. You
                might do better with a term plan + debt funds.
              </p>
            )}
            {verdict === "acceptable" && (
              <p className="text-sm" style={{ color: "#31E981" }}>
                ✓ <strong>IRR above 8%:</strong> Returns are reasonable. Still
                compare with other options before deciding.
              </p>
            )}
          </div>
          <p className="text-xs" style={{ color: "#9AA6BF" }}>
            IRR is calculated using Newton-Raphson method. For informational
            purposes only. Not financial advice.
          </p>
        </div>
      )}
    </div>
  );
}

function CoverageChecker() {
  const [income, setIncome] = useState(85000);
  const [existing, setExisting] = useState(500000);
  const [age, setAge] = useState(32);

  const recommended = income * 12 * (60 - age);
  const gap = Math.max(0, recommended - existing);
  const adequate = existing >= recommended * 0.8;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["Monthly Income (\u20b9)", income, setIncome],
          ["Existing Cover (\u20b9)", existing, setExisting],
          ["Your Age", age, setAge],
        ].map(([l, v, s]) => (
          <div key={l as string}>
            <div className="fin-label">{l as string}</div>
            <input
              type="number"
              className="fin-input"
              value={v as number}
              min={0}
              onChange={(e) =>
                (s as (n: number) => void)(Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <div className="glass-card p-5 space-y-3">
        <div className="flex justify-between">
          <span style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
            Recommended Cover (income × years remaining)
          </span>
          <span className="font-bold text-white">
            ₹{recommended.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
            Your Existing Cover
          </span>
          <span className="font-bold text-white">
            ₹{existing.toLocaleString("en-IN")}
          </span>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 12,
          }}
        >
          {adequate ? (
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: "#31E981" }} />
              <span style={{ color: "#31E981", fontWeight: 600 }}>
                Coverage is adequate
              </span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} style={{ color: "#F87171" }} />
                <span style={{ color: "#F87171", fontWeight: 600 }}>
                  Coverage gap: ₹{gap.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#9AA6BF" }}>
                Consider increasing your term insurance cover.
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        Rule of thumb: life cover should be 10-15x annual income. Consult a
        SEBI-registered advisor for personalized advice.
      </p>
    </div>
  );
}

export default function InsurancePage() {
  const [tab, setTab] = useState<"analyzer" | "coverage">("analyzer");
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Insurance
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          Analyze policies and check your coverage adequacy.
        </p>
      </div>
      <div className="flex gap-2">
        {[
          ["analyzer", "Policy Analyzer"],
          ["coverage", "Coverage Checker"],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            onClick={() => setTab(id as "analyzer" | "coverage")}
            className={tab === id ? "fin-tab-active" : "fin-tab"}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="glass-card p-6">
        {tab === "analyzer" && <PolicyAnalyzer />}
        {tab === "coverage" && <CoverageChecker />}
      </div>
    </div>
  );
}
