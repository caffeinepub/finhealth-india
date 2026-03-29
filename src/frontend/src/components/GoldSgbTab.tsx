import { AlertCircle, CheckCircle } from "lucide-react";
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

type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
type EntryType = "Asset" | "Liability";
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

const PHYSICAL_GOLD_APPRECIATION = 0.08;
const PHYSICAL_GOLD_STORAGE_COST = 0.005;
const SGB_APPRECIATION = 0.08;
const SGB_INTEREST_RATE = 0.025;

type ChartPoint = {
  year: string;
  PhysicalGold: number;
  SGB: number;
};

export default function GoldSgbTab({ entries }: { entries: Entry[] }) {
  const goldAssets = entries.filter(
    (e) => e.type === "Asset" && e.category === "Gold",
  );
  const goldTotal = goldAssets.reduce((s, e) => s + e.amount, 0);

  const chartData: ChartPoint[] = Array.from({ length: 9 }, (_, yr) => {
    const physicalGold =
      goldTotal *
      (1 + PHYSICAL_GOLD_APPRECIATION - PHYSICAL_GOLD_STORAGE_COST) ** yr;
    const sgbPrice = goldTotal * (1 + SGB_APPRECIATION) ** yr;
    const sgbInterest = goldTotal * SGB_INTEREST_RATE * yr;
    const sgb = sgbPrice + sgbInterest;
    return {
      year: yr === 0 ? "Now" : `${yr}Y`,
      PhysicalGold: Math.round(physicalGold),
      SGB: Math.round(sgb),
    };
  });

  const physical8yr = chartData[8].PhysicalGold;
  const sgb8yr = chartData[8].SGB;
  const opportunityCost = sgb8yr - physical8yr;
  const sgbInterestTotal = goldTotal * SGB_INTEREST_RATE * 8;

  const sgbAdvantages = [
    "Tax-free on maturity (8 years) \u2014 zero capital gains tax",
    "RBI-backed sovereign guarantee \u2014 no counterparty risk",
    "No storage cost, no purity risk, fully digital",
    "2.5% annual interest credited to bank account",
    "Tradeable on NSE/BSE after lock-in period (5 years)",
    "Eligible as collateral for loans",
  ];

  return (
    <div className="space-y-6">
      <div className="fintech-card p-6">
        <h2
          className="text-base font-bold mb-1 flex items-center gap-2"
          style={{ color: "#EAF0F6" }}
        >
          <span style={{ fontSize: 18 }}>\ud83e\ude99</span>
          Gold vs SGB Optimizer
        </h2>
        <p className="text-xs mb-5" style={{ color: "#9AA6B2" }}>
          India-exclusive: Compare Physical Gold vs Sovereign Gold Bond returns
          over 8 years.
        </p>

        {goldTotal === 0 ? (
          <div className="text-center py-10" style={{ color: "#9AA6B2" }}>
            <span className="text-4xl mb-3 block">\ud83e\ude99</span>
            <p className="text-sm">
              Add Gold assets to your portfolio to see the SGB comparison.
            </p>
          </div>
        ) : (
          <>
            <div
              className="p-4 rounded-xl mb-5 flex items-start gap-3"
              style={{
                background: "rgba(184,255,74,0.08)",
                border: "1px solid #B8FF4A44",
              }}
            >
              <CheckCircle
                size={18}
                style={{ color: "#B8FF4A", marginTop: 2 }}
              />
              <p className="text-sm" style={{ color: "#EAF0F6" }}>
                By switching{" "}
                <span style={{ color: "#FF9A4A" }}>{formatINR(goldTotal)}</span>{" "}
                to SGB, you could earn an extra{" "}
                <span style={{ color: "#B8FF4A" }}>
                  {formatINR(sgbInterestTotal)}
                </span>{" "}
                in interest alone over 8 years.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div
                className="p-4 rounded-xl"
                style={{ background: "#0F141B", border: "1px solid #24303A" }}
              >
                <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                  Your Gold
                </div>
                <div className="text-lg font-bold" style={{ color: "#FF9A4A" }}>
                  {formatINR(goldTotal)}
                </div>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ background: "#0F141B", border: "1px solid #24303A" }}
              >
                <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                  Physical Gold @ 8Y
                </div>
                <div className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
                  {formatINR(physical8yr)}
                </div>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(184,255,74,0.06)",
                  border: "1px solid #B8FF4A44",
                }}
              >
                <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                  SGB @ 8Y
                </div>
                <div className="text-lg font-bold" style={{ color: "#B8FF4A" }}>
                  {formatINR(sgb8yr)}
                </div>
              </div>
            </div>

            {opportunityCost > 0 && (
              <div
                className="p-3 rounded-xl mb-5 text-xs"
                style={{
                  background: "rgba(255,157,74,0.08)",
                  border: "1px solid #FF9A4A33",
                  color: "#FF9A4A",
                }}
              >
                \u26a0\ufe0f Opportunity Cost of Physical Gold vs SGB at 8Y:{" "}
                <strong>{formatINR(opportunityCost)}</strong>
              </div>
            )}

            <div style={{ height: 240 }} className="mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2A38" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#9AA6B2", fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v: number) => formatINR(v)}
                    tick={{ fill: "#9AA6B2", fontSize: 10 }}
                    width={65}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatINR(value),
                      name,
                    ]}
                    contentStyle={{
                      background: "#0F141B",
                      border: "1px solid #24303A",
                      borderRadius: 10,
                      color: "#EAF0F6",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9AA6B2", fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="PhysicalGold"
                    stroke="#FF9A4A"
                    strokeWidth={2}
                    dot={{ fill: "#FF9A4A", r: 3 }}
                    name="Physical Gold"
                  />
                  <Line
                    type="monotone"
                    dataKey="SGB"
                    stroke="#B8FF4A"
                    strokeWidth={2}
                    dot={{ fill: "#B8FF4A", r: 3 }}
                    name="SGB"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: "#EAF0F6" }}
              >
                SGB Advantages
              </div>
              <div className="space-y-2">
                {sgbAdvantages.map((adv) => (
                  <div key={adv} className="flex items-start gap-2">
                    <CheckCircle
                      size={13}
                      style={{ color: "#B8FF4A", marginTop: 2, flexShrink: 0 }}
                    />
                    <span className="text-xs" style={{ color: "#9AA6B2" }}>
                      {adv}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-4 p-3 rounded-xl text-xs flex items-start gap-2"
              style={{ background: "#0F141B", border: "1px solid #24303A" }}
            >
              <AlertCircle
                size={13}
                style={{ color: "#9AA6B2", marginTop: 1, flexShrink: 0 }}
              />
              <span style={{ color: "#9AA6B2" }}>
                Current SGB series available through RBI, major banks (SBI,
                HDFC, ICICI), and stock exchanges. SGB has an 8-year lock-in
                with exit option from 5 years onwards.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
