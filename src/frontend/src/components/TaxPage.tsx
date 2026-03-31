import { useState } from "react";

function calcOldTax(income: number, ded: number): number {
  const taxable = Math.max(0, income - ded);
  let tax = 0;
  if (taxable <= 250000) tax = 0;
  else if (taxable <= 500000) tax = (taxable - 250000) * 0.05;
  else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.2;
  else tax = 112500 + (taxable - 1000000) * 0.3;
  return Math.round(tax * 1.04); // 4% cess
}

function calcNewTax(income: number): number {
  const std = 75000;
  const taxable = Math.max(0, income - std);
  let tax = 0;
  if (taxable <= 300000) tax = 0;
  else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
  else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.1;
  else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
  else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.2;
  else tax = 140000 + (taxable - 1500000) * 0.3;
  return Math.round(tax * 1.04);
}

export default function TaxPage() {
  const [income, setIncome] = useState(1000000);
  const [sec80c, setSec80c] = useState(150000);
  const [sec80d, setSec80d] = useState(25000);
  const [hra, setHra] = useState(120000);
  const [other, setOther] = useState(0);

  const totalDed = sec80c + sec80d + hra + other + 50000; // 50k std ded for old
  const oldTax = calcOldTax(income, totalDed);
  const newTax = calcNewTax(income);
  const savings = oldTax - newTax;
  const better = savings > 0 ? "new" : "old";

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Tax Optimizer
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          Compare old vs new regime and find the best option for you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="glass-card p-6 space-y-4">
          <div className="font-semibold text-white mb-1">
            Income & Deductions
          </div>
          {[
            ["Annual Income (₹)", income, setIncome],
            ["80C Investments (₹)", sec80c, setSec80c],
            ["80D Health Insurance (₹)", sec80d, setSec80d],
            ["HRA Exemption (₹)", hra, setHra],
            ["Other Deductions (₹)", other, setOther],
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

        {/* Results */}
        <div className="space-y-4">
          <div
            className="glass-card p-5"
            style={{
              border:
                better === "old"
                  ? "1px solid rgba(47,230,255,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Old Regime</span>
              {better === "old" && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(47,230,255,0.15)",
                    color: "#2FE6FF",
                  }}
                >
                  ✓ Better for you
                </span>
              )}
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: better === "old" ? "#2FE6FF" : "#F2F5FF" }}
            >
              ₹{oldTax.toLocaleString("en-IN")}
            </div>
            <div className="text-xs mt-1" style={{ color: "#9AA6BF" }}>
              Total deductions: ₹{totalDed.toLocaleString("en-IN")}
            </div>
          </div>

          <div
            className="glass-card p-5"
            style={{
              border:
                better === "new"
                  ? "1px solid rgba(49,233,129,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">New Regime</span>
              {better === "new" && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(49,233,129,0.15)",
                    color: "#31E981",
                  }}
                >
                  ✓ Better for you
                </span>
              )}
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: better === "new" ? "#31E981" : "#F2F5FF" }}
            >
              ₹{newTax.toLocaleString("en-IN")}
            </div>
            <div className="text-xs mt-1" style={{ color: "#9AA6BF" }}>
              Standard deduction: ₹75,000 (FY2024-25)
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background:
                Math.abs(savings) > 0
                  ? "rgba(47,230,255,0.06)"
                  : "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-sm font-medium text-white mb-1">
              {savings > 0
                ? `New regime saves you ₹${savings.toLocaleString("en-IN")}`
                : savings < 0
                  ? `Old regime saves you ₹${Math.abs(savings).toLocaleString("en-IN")}`
                  : "Both regimes result in similar tax"}
            </div>
            <p className="text-xs" style={{ color: "#9AA6BF" }}>
              Recommendation: Switch to the{" "}
              <strong style={{ color: "#2FE6FF" }}>{better}</strong> tax regime.
            </p>
          </div>

          <p className="text-xs" style={{ color: "#9AA6BF" }}>
            Based on FY 2024-25 slabs. Includes 4% health & education cess.
            Consult a CA for accurate tax filing.
          </p>
        </div>
      </div>
    </div>
  );
}
