import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

export default function InvestmentCalculatorTab({
  entries: _entries,
}: { entries: Entry[] }) {
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");
  const [amount, setAmount] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);

  const results = useMemo(() => {
    const r = returnRate / 100;
    const rMonthly = returnRate / 12 / 100;
    const n = years * 12;

    let fv: number;
    let invested: number;

    if (mode === "sip") {
      fv =
        rMonthly === 0
          ? amount * n
          : amount * (((1 + rMonthly) ** n - 1) / rMonthly) * (1 + rMonthly);
      invested = amount * n;
    } else {
      fv = amount * (1 + r) ** years;
      invested = amount;
    }

    const wealthGain = fv - invested;
    const cagr =
      mode === "lumpsum"
        ? returnRate
        : ((fv / invested) ** (1 / years) - 1) * 100;
    const inflationAdj = fv / (1 + inflation / 100) ** years;

    return { fv, invested, wealthGain, cagr, inflationAdj };
  }, [mode, amount, returnRate, years, inflation]);

  const chartData = useMemo(() => {
    const rMonthly = returnRate / 12 / 100;
    const r = returnRate / 100;
    const data: { year: string; invested: number; value: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const mn = y * 12;
      let value: number;
      let inv: number;
      if (mode === "sip") {
        value =
          rMonthly === 0
            ? amount * mn
            : amount * (((1 + rMonthly) ** mn - 1) / rMonthly) * (1 + rMonthly);
        inv = amount * mn;
      } else {
        value = amount * (1 + r) ** y;
        inv = amount;
      }
      data.push({
        year: `Y${y}`,
        invested: Math.round(inv),
        value: Math.round(value),
      });
    }
    return data;
  }, [mode, amount, returnRate, years]);

  return (
    <div className="space-y-6" data-ocid="investment_calc.section">
      <div className="flex items-center gap-3 mb-2">
        <div
          style={{
            background: "linear-gradient(135deg, #B8FF4A22, #B8FF4A11)",
            border: "1px solid #B8FF4A44",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span style={{ color: "#B8FF4A", fontSize: 20 }}>📈</span>
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
            Investment Calculator
          </h2>
          <p className="text-xs" style={{ color: "#9AA6B2" }}>
            SIP & Lumpsum projections with inflation-adjusted returns
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="fintech-card p-4" style={CARD}>
        <div className="flex gap-2 mb-5">
          {(["sip", "lumpsum"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              data-ocid={`investment_calc.${m}.toggle`}
              className="px-5 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: mode === m ? "#B8FF4A" : "#1F2A38",
                color: mode === m ? "#060A10" : "#9AA6B2",
                border: `1px solid ${mode === m ? "#B8FF4A" : "#24303A"}`,
              }}
            >
              {m === "sip" ? "SIP (Monthly)" : "Lump Sum"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              {mode === "sip"
                ? "Monthly SIP Amount (₹)"
                : "Lump Sum Amount (₹)"}
            </div>
            <input
              type="number"
              min={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              data-ocid="investment_calc.input"
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Expected Return:{" "}
              <span style={{ color: "#B8FF4A" }}>{returnRate}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full accent-[#B8FF4A]"
              data-ocid="investment_calc.return_rate.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Investment Period:{" "}
              <span style={{ color: "#B8FF4A" }}>{years} yrs</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-[#B8FF4A]"
              data-ocid="investment_calc.years.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>1 yr</span>
              <span>40 yrs</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Inflation Rate:{" "}
              <span style={{ color: "#FFD74A" }}>{inflation}%</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-full accent-[#FFD74A]"
              data-ocid="investment_calc.inflation.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>2%</span>
              <span>12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <motion.div
        key={`${mode}-${amount}-${returnRate}-${years}-${inflation}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {[
          {
            label: "Future Value",
            value: formatINR(results.fv),
            color: "#B8FF4A",
          },
          {
            label: "Total Invested",
            value: formatINR(results.invested),
            color: "#4AB8FF",
          },
          {
            label: "Wealth Gain",
            value: formatINR(results.wealthGain),
            color: "#C74AFF",
          },
          {
            label: "CAGR",
            value: `${results.cagr.toFixed(2)}%`,
            color: "#FFD74A",
          },
          {
            label: "Approx. XIRR",
            value: `~${results.cagr.toFixed(2)}%`,
            color: "#FF9A4A",
          },
          {
            label: "Inflation-Adj. Value",
            value: formatINR(results.inflationAdj),
            color: "#9AA6B2",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-xl"
            style={{ ...CARD, border: `1px solid ${m.color}33` }}
            data-ocid="investment_calc.card"
          >
            <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
              {m.label}
            </div>
            <div className="text-lg font-bold" style={{ color: m.color }}>
              {m.value}
            </div>
          </div>
        ))}
      </motion.div>

      {results.cagr > 0 && (
        <p className="text-xs text-center" style={{ color: "#4A5568" }}>
          * XIRR is approximate, based on CAGR method. Actual XIRR may vary
          based on cash flow timing.
        </p>
      )}

      {/* Chart */}
      <div className="fintech-card p-5" style={CARD}>
        <div
          className="text-xs font-semibold mb-3"
          style={{ color: "#9AA6B2" }}
        >
          Growth Chart
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="calcValueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B8FF4A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#B8FF4A" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="calcInvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4AB8FF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4AB8FF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="year"
              stroke="#4A5568"
              tick={{ fill: "#9AA6B2", fontSize: 11 }}
              interval={Math.max(0, Math.floor(years / 10) - 1)}
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
              formatter={(value: number, name: string) => [
                formatINR(value),
                name === "value" ? "Portfolio Value" : "Total Invested",
              ]}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#4AB8FF"
              strokeWidth={2}
              fill="url(#calcInvGrad)"
              strokeDasharray="4 2"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#B8FF4A"
              strokeWidth={2.5}
              fill="url(#calcValueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 justify-center mt-3">
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#9AA6B2" }}
          >
            <div
              style={{
                width: 24,
                height: 2,
                background: "#B8FF4A",
                borderRadius: 1,
              }}
            />{" "}
            Portfolio Value
          </div>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#9AA6B2" }}
          >
            <div
              style={{
                width: 24,
                height: 2,
                background: "#4AB8FF",
                borderRadius: 1,
              }}
            />{" "}
            Total Invested
          </div>
        </div>
      </div>

      <p
        className="text-xs text-center px-4 py-3 rounded-xl"
        style={{
          color: "#9AA6B2",
          background: "#0F141B",
          border: "1px solid #24303A",
        }}
      >
        ⚠️ For educational purposes only. Not investment advice. Returns are
        indicative and based on assumed constant rates.
      </p>
    </div>
  );
}
