import { useState } from "react";

function EMICalc() {
  const [principal, setPrincipal] = useState(2000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const r = rate / 100 / 12;
  const n = tenure * 12;
  const emi = (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const total = emi * n;
  const interest = total - principal;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["Loan Amount (₹)", principal, setPrincipal],
          ["Interest Rate (%)", rate, setRate],
          ["Tenure (years)", tenure, setTenure],
        ].map(([l, v, s]) => (
          <div key={l as string}>
            <div className="fin-label">{l as string}</div>
            <input
              type="number"
              className="fin-input"
              value={v as number}
              min={0.1}
              step={0.1}
              onChange={(e) =>
                (s as (n: number) => void)(Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          [
            "Monthly EMI",
            `₹${Math.round(emi).toLocaleString("en-IN")}`,
            "#2FE6FF",
          ],
          [
            "Total Interest",
            `₹${Math.round(interest).toLocaleString("en-IN")}`,
            "#F87171",
          ],
          [
            "Total Amount",
            `₹${Math.round(total).toLocaleString("en-IN")}`,
            "#9AA6BF",
          ],
        ].map(([l, v, c]) => (
          <div key={l as string} className="glass-card p-4 text-center">
            <div className="text-xs mb-1" style={{ color: "#9AA6BF" }}>
              {l as string}
            </div>
            <div className="text-xl font-bold" style={{ color: c as string }}>
              {v as string}
            </div>
          </div>
        ))}
      </div>
      <div
        className="p-4 rounded-xl"
        style={{
          background: "rgba(47,230,255,0.05)",
          border: "1px solid rgba(47,230,255,0.12)",
        }}
      >
        <div className="text-sm font-medium text-white mb-1">
          Interest Breakdown
        </div>
        <div className="text-sm" style={{ color: "#9AA6BF" }}>
          You pay{" "}
          <span style={{ color: "#F87171", fontWeight: 600 }}>
            {((interest / total) * 100).toFixed(1)}%
          </span>{" "}
          as interest on this loan. Consider prepayment to reduce it.
        </div>
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        EMI = P × r × (1+r)^n / ((1+r)^n - 1). Indicative calculation only.
      </p>
    </div>
  );
}

function PrepaymentCalc() {
  const [principal, setPrincipal] = useState(2000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [prepay, setPrepay] = useState(200000);

  const r = rate / 100 / 12;
  const n = tenure * 12;
  const emi = (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);

  const newPrincipal = principal - prepay;
  const emiNew = (newPrincipal * r * (1 + r) ** n) / ((1 + r) ** n - 1);

  const interestOld = emi * n - principal;
  const interestNew = emiNew * n - newPrincipal;
  const saved = interestOld - interestNew;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["Loan Amount (₹)", principal, setPrincipal],
          ["Interest Rate (%)", rate, setRate],
          ["Tenure (years)", tenure, setTenure],
          ["Prepayment Amount (₹)", prepay, setPrepay],
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
      <div className="glass-card p-5">
        <div className="font-medium text-white mb-3">
          Savings from Prepayment
        </div>
        <div
          className="flex items-center justify-between py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
            EMI without prepayment
          </span>
          <span className="font-semibold text-white">
            ₹{Math.round(emi).toLocaleString("en-IN")}/mo
          </span>
        </div>
        <div
          className="flex items-center justify-between py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
            EMI after prepayment
          </span>
          <span className="font-semibold" style={{ color: "#31E981" }}>
            ₹{Math.round(emiNew).toLocaleString("en-IN")}/mo
          </span>
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="font-semibold text-white">Total Interest Saved</span>
          <span
            className="font-bold"
            style={{ color: "#31E981", fontSize: "1.1rem" }}
          >
            ₹{Math.round(saved).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        Indicative savings based on reduced principal. Bank policies on
        prepayment may vary.
      </p>
    </div>
  );
}

export default function LoansPage() {
  const [tab, setTab] = useState<"emi" | "prepay">("emi");
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Loans
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          Calculate EMI and plan your loan repayment strategy.
        </p>
      </div>
      <div className="flex gap-2">
        {[
          ["emi", "EMI Calculator"],
          ["prepay", "Prepayment Strategy"],
        ].map(([id, l]) => (
          <button
            type="button"
            key={id}
            onClick={() => setTab(id as "emi" | "prepay")}
            className={tab === id ? "fin-tab-active" : "fin-tab"}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="glass-card p-6">
        {tab === "emi" && <EMICalc />}
        {tab === "prepay" && <PrepaymentCalc />}
      </div>
    </div>
  );
}
