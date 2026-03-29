import { Flame, TrendingDown } from "lucide-react";
import { useState } from "react";
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

const REAL_RETURNS: Record<Category, number> = {
  Equity: 4,
  "Mutual Funds": 4,
  Debt: 1,
  Gold: -3,
  Cash: 0,
};

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000)
    return `${sign}\u20b9${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}\u20b9${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}\u20b9${(abs / 1_000).toFixed(1)}K`;
  return `${sign}\u20b9${abs.toLocaleString("en-IN")}`;
}

export default function InflationTrackerTab({ entries }: { entries: Entry[] }) {
  const [inflationRate, setInflationRate] = useState(6);

  const assets = entries.filter((e) => e.type === "Asset");
  const CATEGORIES: Category[] = [
    "Equity",
    "Mutual Funds",
    "Debt",
    "Gold",
    "Cash",
  ];

  const getCatAmount = (cat: Category) =>
    assets.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);

  const getRealGrowthRate = (cat: Category) => {
    const realReturn = REAL_RETURNS[cat];
    return realReturn - inflationRate;
  };

  const getProjected = (amount: number, realRate: number, years: number) =>
    amount * (1 + realRate / 100) ** years;

  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const cashAmt = getCatAmount("Cash");
  const cashLossPerYear = cashAmt * (inflationRate / 100);

  const chartData = [0, 1, 2, 3, 4, 5].map((yr) => {
    const realNW = CATEGORIES.reduce((sum, cat) => {
      const amt = getCatAmount(cat);
      const rate = getRealGrowthRate(cat);
      return sum + getProjected(amt, rate, yr);
    }, 0);
    return {
      year: yr === 0 ? "Now" : `${yr}Y`,
      realNW: Math.round(realNW),
      nominal: totalAssets,
    };
  });

  const rows = CATEGORIES.map((cat) => {
    const current = getCatAmount(cat);
    const rate = getRealGrowthRate(cat);
    const val1y = getProjected(current, rate, 1);
    const val3y = getProjected(current, rate, 3);
    const val5y = getProjected(current, rate, 5);
    const loss5y = current - val5y;
    const lossPct5y = current > 0 ? (loss5y / current) * 100 : 0;
    return { cat, current, val1y, val3y, val5y, loss5y, lossPct5y };
  }).filter((r) => r.current > 0);

  return (
    <div className="space-y-6">
      <div className="fintech-card p-6">
        <h2
          className="text-base font-bold mb-1 flex items-center gap-2"
          style={{ color: "#EAF0F6" }}
        >
          <Flame size={18} style={{ color: "#FF9A4A" }} />
          Inflation Impact Tracker
        </h2>
        <p className="text-xs mb-5" style={{ color: "#9AA6B2" }}>
          India CPI-adjusted real purchasing power of your portfolio over time.
        </p>

        {cashAmt > 0 && (
          <div
            className="p-4 rounded-xl mb-5 flex items-start gap-3"
            style={{
              background: "rgba(255,74,74,0.08)",
              border: "1px solid #FF4A4A33",
            }}
          >
            <TrendingDown
              size={18}
              style={{ color: "#FF4A4A" }}
              className="mt-0.5"
            />
            <p className="text-sm" style={{ color: "#EAF0F6" }}>
              Your{" "}
              <span style={{ color: "#FFD74A" }}>{formatINR(cashAmt)}</span> in
              cash is losing{" "}
              <span style={{ color: "#FF4A4A" }}>
                {formatINR(cashLossPerYear)}/year
              </span>{" "}
              to inflation at {inflationRate}% CPI.
            </p>
          </div>
        )}

        <div className="mb-5">
          <div
            className="text-xs font-medium mb-2 flex justify-between"
            style={{ color: "#9AA6B2" }}
          >
            <span>India CPI Inflation Rate</span>
            <span style={{ color: "#B8FF4A" }}>{inflationRate}%</span>
          </div>
          <input
            id="inflation-rate-slider"
            type="range"
            min={2}
            max={12}
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full accent-[#B8FF4A]"
            data-ocid="inflation.rate.input"
            aria-label="Inflation rate"
          />
          <div
            className="flex justify-between text-xs mt-1"
            style={{ color: "#9AA6B2" }}
          >
            <span>2%</span>
            <span>12%</span>
          </div>
        </div>

        {totalAssets > 0 && (
          <div style={{ height: 220 }} className="mb-6">
            <div className="text-xs mb-2" style={{ color: "#9AA6B2" }}>
              Real Net Worth Projection (inflation-adjusted)
            </div>
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
                  dataKey="nominal"
                  stroke="#4AB8FF"
                  strokeDasharray="5 5"
                  dot={false}
                  name="Nominal"
                />
                <Line
                  type="monotone"
                  dataKey="realNW"
                  stroke="#B8FF4A"
                  strokeWidth={2}
                  dot={{ fill: "#B8FF4A", r: 4 }}
                  name="Real (Inflation-adj.)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {rows.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Per-Category Inflation Erosion
            </div>
            {rows.map((r) => (
              <div
                key={r.cat}
                className="p-4 rounded-xl"
                style={{ background: "#0F141B", border: "1px solid #24303A" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#EAF0F6" }}
                  >
                    {r.cat}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: r.loss5y > 0 ? "#FF4A4A" : "#B8FF4A" }}
                  >
                    {r.loss5y > 0
                      ? `-${formatINR(r.loss5y)} in 5yr`
                      : `+${formatINR(Math.abs(r.loss5y))} real gain`}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <div style={{ color: "#9AA6B2" }}>1Y</div>
                    <div style={{ color: "#EAF0F6" }}>{formatINR(r.val1y)}</div>
                  </div>
                  <div>
                    <div style={{ color: "#9AA6B2" }}>3Y</div>
                    <div style={{ color: "#EAF0F6" }}>{formatINR(r.val3y)}</div>
                  </div>
                  <div>
                    <div style={{ color: "#9AA6B2" }}>5Y</div>
                    <div style={{ color: "#EAF0F6" }}>{formatINR(r.val5y)}</div>
                  </div>
                </div>
                {r.lossPct5y > 0 && (
                  <div>
                    <div
                      className="h-2 rounded-full"
                      style={{ background: "#1F2A38" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(r.lossPct5y, 100)}%`,
                          background: "#FF4A4A",
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#FF4A4A" }}>
                      {r.lossPct5y.toFixed(1)}% purchasing power lost over 5
                      years
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {rows.length === 0 && (
          <div className="text-center py-10" style={{ color: "#9AA6B2" }}>
            <Flame size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Add assets to your portfolio to track inflation impact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
