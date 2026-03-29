import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

export default function UlipVsSipTab({
  entries: _entries,
}: { entries: Entry[] }) {
  const [annualPremium, setAnnualPremium] = useState(100000);
  const [ulipReturn, setUlipReturn] = useState(7);
  const [sipReturn, setSipReturn] = useState(12);
  const [years, setYears] = useState(15);

  const results = useMemo(() => {
    // ULIP: annual compounding with ~1.5% charge drag
    const ulipEffective = (ulipReturn - 1.5) / 100;
    const ulipCorpus =
      ulipEffective > 0
        ? annualPremium *
          (((1 + ulipEffective) ** years - 1) / ulipEffective) *
          (1 + ulipEffective)
        : annualPremium * years;

    // SIP: monthly
    const monthlySIP = annualPremium / 12;
    const rMonthly = sipReturn / 12 / 100;
    const nMonths = years * 12;
    const sipCorpus =
      monthlySIP *
      (((1 + rMonthly) ** nMonths - 1) / rMonthly) *
      (1 + rMonthly);

    const opportunityLoss = sipCorpus - ulipCorpus;
    const totalInvested = annualPremium * years;

    return { ulipCorpus, sipCorpus, opportunityLoss, totalInvested };
  }, [annualPremium, ulipReturn, sipReturn, years]);

  const chartData = useMemo(() => {
    const data: { year: string; ulip: number; sip: number }[] = [];
    const ulipEffective = (ulipReturn - 1.5) / 100;
    const rMonthly = sipReturn / 12 / 100;
    for (let y = 1; y <= years; y++) {
      const ulip =
        ulipEffective > 0
          ? annualPremium *
            (((1 + ulipEffective) ** y - 1) / ulipEffective) *
            (1 + ulipEffective)
          : annualPremium * y;
      const mn = y * 12;
      const sip =
        (annualPremium / 12) *
        (((1 + rMonthly) ** mn - 1) / rMonthly) *
        (1 + rMonthly);
      data.push({
        year: `Y${y}`,
        ulip: Math.round(ulip),
        sip: Math.round(sip),
      });
    }
    return data;
  }, [annualPremium, ulipReturn, sipReturn, years]);

  const advantage =
    results.sipCorpus > results.ulipCorpus ? "SIP Wins" : "ULIP Wins";
  const advantageColor =
    results.sipCorpus > results.ulipCorpus ? "#B8FF4A" : "#FFD74A";

  return (
    <div className="space-y-6" data-ocid="ulip_sip.section">
      <div className="flex items-center gap-3 mb-2">
        <div
          style={{
            background: "linear-gradient(135deg, #4AB8FF22, #4AB8FF11)",
            border: "1px solid #4AB8FF44",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span style={{ fontSize: 20 }}>⚖️</span>
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
            ULIP vs SIP Comparison
          </h2>
          <p className="text-xs" style={{ color: "#9AA6B2" }}>
            Compare ULIP corpus vs direct SIP investments side by side
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="p-5 rounded-xl" style={CARD}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Annual Premium (₹)
            </div>
            <input
              type="number"
              min={1000}
              step={1000}
              value={annualPremium}
              onChange={(e) => setAnnualPremium(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="ulip_sip.premium.input"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              ULIP Return:{" "}
              <span style={{ color: "#FFD74A" }}>{ulipReturn}%</span>
              <span style={{ color: "#4A5568", fontSize: 10 }}>
                {" "}
                (effective: {(ulipReturn - 1.5).toFixed(1)}% after charges)
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={10}
              step={0.5}
              value={ulipReturn}
              onChange={(e) => setUlipReturn(Number(e.target.value))}
              className="w-full accent-[#FFD74A]"
              data-ocid="ulip_sip.ulip_return.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>4%</span>
              <span>10%</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              SIP Return: <span style={{ color: "#B8FF4A" }}>{sipReturn}%</span>
            </div>
            <input
              type="range"
              min={8}
              max={20}
              step={0.5}
              value={sipReturn}
              onChange={(e) => setSipReturn(Number(e.target.value))}
              className="w-full accent-[#B8FF4A]"
              data-ocid="ulip_sip.sip_return.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>8%</span>
              <span>20%</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Investment Period:{" "}
              <span style={{ color: "#B8FF4A" }}>{years} yrs</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-[#B8FF4A]"
              data-ocid="ulip_sip.years.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>5 yrs</span>
              <span>30 yrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <motion.div
        key={`${annualPremium}-${ulipReturn}-${sipReturn}-${years}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div
          className="p-5 rounded-xl"
          style={{ ...CARD, border: "1px solid #FFD74A44" }}
        >
          <div
            className="text-xs font-semibold mb-1"
            style={{ color: "#9AA6B2" }}
          >
            ULIP Corpus
          </div>
          <div className="text-2xl font-bold" style={{ color: "#FFD74A" }}>
            {formatINR(Math.round(results.ulipCorpus))}
          </div>
          <div className="text-xs mt-1" style={{ color: "#4A5568" }}>
            Effective return: {(ulipReturn - 1.5).toFixed(1)}% after 1.5%
            charges
          </div>
        </div>
        <div
          className="p-5 rounded-xl"
          style={{ ...CARD, border: "1px solid #B8FF4A44" }}
        >
          <div
            className="text-xs font-semibold mb-1"
            style={{ color: "#9AA6B2" }}
          >
            SIP Corpus
          </div>
          <div className="text-2xl font-bold" style={{ color: "#B8FF4A" }}>
            {formatINR(Math.round(results.sipCorpus))}
          </div>
          <div className="text-xs mt-1" style={{ color: "#4A5568" }}>
            Monthly SIP: {formatINR(Math.round(annualPremium / 12))}/mo at{" "}
            {sipReturn}%
          </div>
        </div>
      </motion.div>

      {/* Opportunity loss */}
      <div
        className="p-5 rounded-xl"
        style={{ ...CARD, border: "1px solid #FF4A4A44" }}
      >
        <div
          className="text-xs font-semibold mb-1"
          style={{ color: "#9AA6B2" }}
        >
          Opportunity Loss (choosing ULIP over SIP)
        </div>
        <div
          className="text-2xl font-bold"
          style={{ color: results.opportunityLoss > 0 ? "#FF4A4A" : "#B8FF4A" }}
        >
          {results.opportunityLoss > 0 ? "-" : "+"}
          {formatINR(Math.abs(Math.round(results.opportunityLoss)))}
        </div>
        <div className="text-xs mt-1" style={{ color: "#9AA6B2" }}>
          Total invested: {formatINR(results.totalInvested)} | {advantage}
        </div>
      </div>

      {/* Decision Summary */}
      <div className="p-5 rounded-xl" style={CARD}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#EAF0F6" }}>
          📊 Decision Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Risk Level", value: "Medium", color: "#FFD74A" },
            {
              label: "Return Quality",
              value:
                results.sipCorpus > results.ulipCorpus
                  ? "SIP Better"
                  : "ULIP Better",
              color: advantageColor,
            },
            {
              label: "Inflation Impact",
              value: ulipReturn - 1.5 < 6 ? "Negative" : "Marginal",
              color: ulipReturn - 1.5 < 6 ? "#FF4A4A" : "#FFD74A",
            },
            { label: "Final Verdict", value: advantage, color: advantageColor },
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

      {/* Line Chart */}
      <div className="p-5 rounded-xl" style={CARD}>
        <div
          className="text-xs font-semibold mb-3"
          style={{ color: "#9AA6B2" }}
        >
          ULIP vs SIP Growth Over Time
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="year"
              stroke="#4A5568"
              tick={{ fill: "#9AA6B2", fontSize: 11 }}
              interval={Math.max(0, Math.floor(years / 8) - 1)}
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
            <Line
              type="monotone"
              dataKey="ulip"
              name="ULIP"
              stroke="#FFD74A"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sip"
              name="SIP"
              stroke="#B8FF4A"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
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
        ⚠️ For educational purposes only. ULIP charges vary by product. Actual
        returns may differ.
      </p>
    </div>
  );
}
