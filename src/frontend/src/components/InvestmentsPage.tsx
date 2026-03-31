import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Tab = "sip" | "return" | "risk";

function SIPCalc() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const n = years * 12;
  const r = rate / 100 / 12;
  const maturity = monthly * (((1 + r) ** n - 1) / r) * (1 + r);
  const invested = monthly * n;
  const gains = maturity - invested;

  const chartData = Array.from({ length: years }, (_, i) => {
    const yr = i + 1;
    const ni = yr * 12;
    const m = monthly * (((1 + r) ** ni - 1) / r) * (1 + r);
    return { year: `Yr ${yr}`, invested: monthly * ni, value: Math.round(m) };
  });

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["Monthly SIP (\u20b9)", monthly, setMonthly, 500, 100000, 500],
          ["Expected Rate (%)", rate, setRate, 1, 30, 0.5],
          ["Time Period (years)", years, setYears, 1, 40, 1],
        ].map(([label, val, setter, min, max, step]) => (
          <div key={label as string}>
            <div className="fin-label">{label as string}</div>
            <input
              type="number"
              className="fin-input"
              value={val as number}
              min={min as number}
              max={max as number}
              step={step as number}
              onChange={(e) =>
                (setter as (v: number) => void)(Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          [
            "Total Invested",
            `\u20b9${invested.toLocaleString("en-IN")}`,
            "#9AA6BF",
          ],
          [
            "Estimated Gains",
            `\u20b9${Math.round(gains).toLocaleString("en-IN")}`,
            "#31E981",
          ],
          [
            "Maturity Value",
            `\u20b9${Math.round(maturity).toLocaleString("en-IN")}`,
            "#2FE6FF",
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
      <div className="glass-card p-4">
        <div className="text-sm font-medium text-white mb-3">
          Growth Projection
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "#9AA6BF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9AA6BF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`}
            />
            <Tooltip
              contentStyle={{
                background: "#121828",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#F2F5FF",
                fontSize: "12px",
              }}
              formatter={(v: number) => [
                `\u20b9${v.toLocaleString("en-IN")}`,
                "",
              ]}
            />
            <Bar
              dataKey="invested"
              fill="rgba(47,230,255,0.3)"
              radius={[4, 4, 0, 0]}
              name="Invested"
            />
            <Bar
              dataKey="value"
              fill="#2D7BFF"
              radius={[4, 4, 0, 0]}
              name="Value"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        Projections are indicative based on assumed rate. Actual returns may
        vary. Not financial advice.
      </p>
    </div>
  );
}

function ReturnCalc() {
  const [initial, setInitial] = useState(100000);
  const [final, setFinal] = useState(180000);
  const [yrs, setYrs] = useState(5);
  const cagr = ((final / initial) ** (1 / yrs) - 1) * 100;
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["Initial Investment (\u20b9)", initial, setInitial],
          ["Final Value (\u20b9)", final, setFinal],
          ["Time Period (years)", yrs, setYrs],
        ].map(([l, v, s]) => (
          <div key={l as string}>
            <div className="fin-label">{l as string}</div>
            <input
              type="number"
              className="fin-input"
              value={v as number}
              min={1}
              onChange={(e) =>
                (s as (v: number) => void)(Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <div className="glass-card p-6 text-center">
        <div className="text-xs mb-2" style={{ color: "#9AA6BF" }}>
          CAGR (Compound Annual Growth Rate)
        </div>
        <div className="text-4xl font-extrabold gradient-text">
          {Number.isFinite(cagr) ? cagr.toFixed(2) : "0"}%
        </div>
        <div className="text-xs mt-2" style={{ color: "#9AA6BF" }}>
          Your investment grew {((final / initial - 1) * 100).toFixed(1)}% in
          total
        </div>
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        CAGR represents annualized compounded growth. Past returns do not
        guarantee future performance.
      </p>
    </div>
  );
}

function RiskAnalysis() {
  const profiles = [
    {
      name: "Conservative",
      desc: "Low risk, stable returns. Focus on debt and FDs.",
      allocation: { Debt: 60, Equity: 20, Gold: 15, Cash: 5 },
      color: "#31E981",
    },
    {
      name: "Moderate",
      desc: "Balanced approach. Mix of equity and debt.",
      allocation: { Equity: 50, Debt: 35, Gold: 10, Cash: 5 },
      color: "#2D7BFF",
    },
    {
      name: "Aggressive",
      desc: "High risk, high return potential. Heavy equity.",
      allocation: { Equity: 75, Debt: 15, Gold: 5, Cash: 5 },
      color: "#7A3CFF",
    },
  ];
  const [sel, setSel] = useState("Moderate");
  const profile = profiles.find((p) => p.name === sel)!;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {profiles.map((p) => (
          <button
            type="button"
            key={p.name}
            onClick={() => setSel(p.name)}
            className="p-4 rounded-xl text-left transition-all"
            style={{
              background:
                sel === p.name ? `${p.color}18` : "rgba(18,24,42,0.5)",
              border: `1px solid ${sel === p.name ? `${p.color}50` : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <div className="font-semibold text-white text-sm mb-1">
              {p.name}
            </div>
            <div className="text-xs" style={{ color: "#9AA6BF" }}>
              {p.desc}
            </div>
          </button>
        ))}
      </div>
      <div className="glass-card p-5">
        <div className="font-medium text-white mb-3">
          Recommended Allocation — {profile.name}
        </div>
        <div className="space-y-3">
          {Object.entries(profile.allocation).map(([asset, pct]) => (
            <div key={asset}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "#9AA6BF" }}>{asset}</span>
                <span style={{ color: profile.color, fontWeight: 600 }}>
                  {pct}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${pct}%`, background: profile.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        Risk profiles are for educational purposes. Consult a SEBI-registered
        advisor before investing.
      </p>
    </div>
  );
}

export default function InvestmentsPage() {
  const [tab, setTab] = useState<Tab>("sip");
  const tabs: { id: Tab; label: string }[] = [
    { id: "sip", label: "SIP Calculator" },
    { id: "return", label: "Return Calculator" },
    { id: "risk", label: "Risk Analysis" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Investments
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          Tools to plan and analyze your investments.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setTab(t.id)}
            className={tab === t.id ? "fin-tab-active" : "fin-tab"}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="glass-card p-6">
        {tab === "sip" && <SIPCalc />}
        {tab === "return" && <ReturnCalc />}
        {tab === "risk" && <RiskAnalysis />}
      </div>
    </div>
  );
}
