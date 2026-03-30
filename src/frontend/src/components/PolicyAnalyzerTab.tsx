import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SmartTooltip, { FINANCE_TERMS } from "./SmartTooltip";

type EntryType = "Asset" | "Liability";
type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
interface Entry {
  id: string;
  type: EntryType;
  category: Category;
  amount: number;
}

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000)
    return `${sign}\u20b9${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}\u20b9${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}\u20b9${(abs / 1_000).toFixed(1)}K`;
  return `${sign}\u20b9${abs.toLocaleString("en-IN")}`;
}

const CARD = {
  background: "#0F141B",
  border: "1px solid #24303A",
  borderRadius: 14,
};

export default function PolicyAnalyzerTab({
  entries: _entries,
}: { entries: Entry[] }) {
  const [premium, setPremium] = useState(100000);
  const [tenure, setTenure] = useState(15);
  const [maturityValue, setMaturityValue] = useState(2000000);
  const [lockIn, setLockIn] = useState(5);

  const results = useMemo(() => {
    const totalInvested = premium * tenure;
    const netGain = maturityValue - totalInvested;
    const cagr =
      totalInvested > 0 && tenure > 0
        ? ((maturityValue / totalInvested) ** (1 / tenure) - 1) * 100
        : 0;

    // SIP alternative at 12%: monthly SIP = premium/12
    const monthlySIP = premium / 12;
    const rMonthly = 0.12 / 12;
    const nMonths = tenure * 12;
    const sipFV =
      monthlySIP *
      (((1 + rMonthly) ** nMonths - 1) / rMonthly) *
      (1 + rMonthly);
    const wealthDiff = sipFV - maturityValue;

    return { totalInvested, netGain, cagr, sipFV, wealthDiff };
  }, [premium, tenure, maturityValue]);

  const verdict =
    results.cagr < 6 ? "AVOID" : results.cagr < 8 ? "MODERATE" : "GOOD";
  const verdictColor =
    verdict === "AVOID"
      ? "#FF4A4A"
      : verdict === "MODERATE"
        ? "#FFD74A"
        : "#B8FF4A";
  const verdictBg =
    verdict === "AVOID"
      ? "rgba(255,74,74,0.15)"
      : verdict === "MODERATE"
        ? "rgba(255,215,74,0.15)"
        : "rgba(184,255,74,0.15)";

  const chartData = [
    {
      name: "Total Invested",
      value: Math.round(results.totalInvested),
      fill: "#4AB8FF",
    },
    {
      name: "Maturity Value",
      value: Math.round(maturityValue),
      fill: "#FFD74A",
    },
    {
      name: "SIP Alternative",
      value: Math.round(results.sipFV),
      fill: "#B8FF4A",
    },
  ];

  const misSellingFlags: { msg: string; color: string }[] = [];
  if (results.cagr < 6)
    misSellingFlags.push({
      msg: "⚠ Return below inflation (< 6% CAGR)",
      color: "#FF4A4A",
    });
  else if (results.cagr < 8)
    misSellingFlags.push({
      msg: "⚠ Low return alert (CAGR < 8%)",
      color: "#FFB84A",
    });
  if (lockIn > 10)
    misSellingFlags.push({
      msg: "⚠ Long lock-in period caution (> 10 years)",
      color: "#FFD74A",
    });
  if (misSellingFlags.length === 0)
    misSellingFlags.push({
      msg: "✓ No immediate mis-selling red flags detected",
      color: "#B8FF4A",
    });

  return (
    <div className="space-y-6" data-ocid="policy_analyzer.section">
      <div className="flex items-center gap-3 mb-2">
        <div
          style={{
            background: "linear-gradient(135deg, #C74AFF22, #C74AFF11)",
            border: "1px solid #C74AFF44",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span style={{ fontSize: 20 }}>📋</span>
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
            Policy / Investment Analyzer
          </h2>
          <p className="text-xs" style={{ color: "#9AA6B2" }}>
            Analyze insurance, ULIP, or agent-sold plans against market
            benchmarks
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="p-5 rounded-xl" style={CARD}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              label: "Annual Premium (₹)",
              value: premium,
              setter: setPremium,
              min: 1000,
              step: 1000,
            },
            {
              label: "Policy Tenure (Years)",
              value: tenure,
              setter: setTenure,
              min: 1,
              step: 1,
            },
            {
              label: "Expected Maturity Value (₹)",
              value: maturityValue,
              setter: setMaturityValue,
              min: 1000,
              step: 10000,
            },
            {
              label: "Lock-in Period (Years)",
              value: lockIn,
              setter: setLockIn,
              min: 0,
              step: 1,
            },
          ].map((f) => (
            <div key={f.label} className="space-y-1">
              <div
                className="text-xs font-semibold"
                style={{ color: "#9AA6B2" }}
              >
                {f.label}
              </div>
              <input
                type="number"
                min={f.min}
                step={f.step}
                value={f.value}
                onChange={(e) => f.setter(Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "#0A0F15",
                  border: "1px solid #24303A",
                  color: "#EAF0F6",
                }}
                data-ocid="policy_analyzer.input"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Results Cards */}
      <motion.div
        key={`${premium}-${tenure}-${maturityValue}-${lockIn}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {[
          {
            label: "Total Invested",
            value: formatINR(results.totalInvested),
            color: "#4AB8FF",
          },
          {
            label: "Maturity Value",
            value: formatINR(maturityValue),
            color: "#FFD74A",
          },
          {
            label: "Net Gain",
            value: formatINR(results.netGain),
            color: results.netGain >= 0 ? "#B8FF4A" : "#FF4A4A",
          },
          {
            label: "CAGR",
            value: `${results.cagr.toFixed(2)}%`,
            color:
              results.cagr >= 8
                ? "#B8FF4A"
                : results.cagr >= 6
                  ? "#FFD74A"
                  : "#FF4A4A",
          },
          {
            label: "SIP @ 12% Alternative",
            value: formatINR(results.sipFV),
            color: "#B8FF4A",
          },
          {
            label: "Opportunity Loss",
            value: formatINR(results.wealthDiff),
            color: results.wealthDiff > 0 ? "#FF4A4A" : "#B8FF4A",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-xl"
            style={{ ...CARD, border: `1px solid ${m.color}33` }}
            data-ocid="policy_analyzer.card"
          >
            <div
              className="text-xs mb-1 flex items-center gap-1"
              style={{ color: "#9AA6B2" }}
            >
              {m.label}
              {m.label === "CAGR" && (
                <SmartTooltip term="CAGR" explanation={FINANCE_TERMS.CAGR} />
              )}
              {m.label === "SIP @ 12% Alternative" && (
                <SmartTooltip term="SIP" explanation={FINANCE_TERMS.SIP} />
              )}
            </div>
            <div className="text-lg font-bold" style={{ color: m.color }}>
              {m.value}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Mis-Selling Detector */}
      <div className="p-5 rounded-xl" style={CARD}>
        <h3 className="text-sm font-bold mb-3" style={{ color: "#EAF0F6" }}>
          🔍 Mis-Selling Detector
        </h3>
        <div className="space-y-2">
          {misSellingFlags.map((f) => (
            <div
              key={f.msg}
              className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg"
              style={{
                background: `${f.color}18`,
                color: f.color,
                border: `1px solid ${f.color}33`,
              }}
            >
              {f.msg}
            </div>
          ))}
        </div>
      </div>

      {/* Verdict Badge */}
      <div
        className="p-5 rounded-xl flex items-center gap-4"
        style={{ ...CARD, border: `1px solid ${verdictColor}44` }}
      >
        <div
          className="text-3xl font-black px-5 py-3 rounded-xl"
          style={{ background: verdictBg, color: verdictColor }}
        >
          {verdict}
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
            Investment Verdict
          </div>
          <div className="text-xs mt-1" style={{ color: "#9AA6B2" }}>
            {verdict === "AVOID" &&
              "CAGR below 6% — likely losing to inflation. Consider SIP alternatives."}
            {verdict === "MODERATE" &&
              "CAGR between 6–8% — borderline return. Compare with FD or SIP options."}
            {verdict === "GOOD" &&
              "CAGR above 8% — reasonable return, but still verify lock-in terms."}
          </div>
        </div>
      </div>

      {/* Decision Summary Panel */}
      <div className="p-5 rounded-xl" style={CARD}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#EAF0F6" }}>
          📊 Decision Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Risk Level", value: "Medium", color: "#FFD74A" },
            { label: "Return Quality", value: verdict, color: verdictColor },
            {
              label: "Inflation Impact",
              value: results.cagr < 6 ? "Negative" : "Marginal",
              color: results.cagr < 6 ? "#FF4A4A" : "#FFD74A",
            },
            { label: "Final Verdict", value: verdict, color: verdictColor },
          ].map((d) => (
            <div
              key={d.label}
              className="text-center p-3 rounded-xl"
              style={{
                background: `${d.color}15`,
                border: `1px solid ${d.color}33`,
              }}
            >
              <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                {d.label}
              </div>
              <div className="text-sm font-bold" style={{ color: d.color }}>
                {d.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="p-5 rounded-xl" style={CARD}>
        <div
          className="text-xs font-semibold mb-3"
          style={{ color: "#9AA6B2" }}
        >
          Total Invested vs Maturity Value vs SIP Alternative
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="name"
              stroke="#4A5568"
              tick={{ fill: "#9AA6B2", fontSize: 10 }}
            />
            <YAxis
              stroke="#4A5568"
              tick={{ fill: "#9AA6B2", fontSize: 11 }}
              tickFormatter={(v) => formatINR(v)}
            />
            <Tooltip
              contentStyle={{
                background: "#0F141B",
                border: "1px solid #24303A",
                borderRadius: 10,
                color: "#EAF0F6",
              }}
              formatter={(value: number) => [formatINR(value)]}
            />
            <Legend wrapperStyle={{ color: "#9AA6B2", fontSize: 11 }} />
            <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p
        className="text-xs text-center px-4 py-3 rounded-xl"
        style={{
          color: "#9AA6B2",
          background: "#0F141B",
          border: "1px solid #24303A",
        }}
      >
        ⚠️ For educational purposes only. Not investment advice. CAGR
        calculations assume constant premium payment.
      </p>
    </div>
  );
}
