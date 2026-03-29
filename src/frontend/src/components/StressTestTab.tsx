import { AlertTriangle, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

const SCENARIOS = [
  {
    id: "covid",
    name: "2020 COVID Crash",
    emoji: "🦠",
    impacts: { Equity: -38, "Mutual Funds": -32, Gold: 12, Debt: -2, Cash: 0 },
  },
  {
    id: "gfc",
    name: "2008 Global Crisis",
    emoji: "💥",
    impacts: { Equity: -55, "Mutual Funds": -48, Gold: 5, Debt: -5, Cash: 0 },
  },
  {
    id: "dotcom",
    name: "2000 Dot-com Crash",
    emoji: "💻",
    impacts: { Equity: -50, "Mutual Funds": -45, Gold: 3, Debt: 2, Cash: 0 },
  },
  {
    id: "inr",
    name: "2013 INR Crisis",
    emoji: "💸",
    impacts: {
      Equity: -25,
      "Mutual Funds": -20,
      Gold: 20,
      Debt: -10,
      Cash: -5,
    },
  },
  {
    id: "ratehike",
    name: "2024 Rate Hike (Mild)",
    emoji: "📈",
    impacts: { Equity: -15, Debt: -8, Gold: 5, "Mutual Funds": -12, Cash: 0 },
  },
];

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000)
    return `${sign}\u20b9${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}\u20b9${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}\u20b9${(abs / 1_000).toFixed(1)}K`;
  return `${sign}\u20b9${abs.toLocaleString("en-IN")}`;
}

export default function StressTestTab({ entries }: { entries: Entry[] }) {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id);
  const [customDrop, setCustomDrop] = useState(30);

  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);

  const getCatAmount = (cat: Category) =>
    assets.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);

  const getImpacts = () => {
    if (selectedScenario === "custom") {
      return {
        Equity: -customDrop,
        "Mutual Funds": -customDrop,
        Gold: -customDrop,
        Debt: -customDrop,
        Cash: 0,
      };
    }
    return SCENARIOS.find((s) => s.id === selectedScenario)!.impacts;
  };

  const impacts = getImpacts();

  const chartData = (
    ["Equity", "Mutual Funds", "Gold", "Debt", "Cash"] as Category[]
  ).map((cat) => {
    const current = getCatAmount(cat);
    const pct = (impacts as Record<string, number>)[cat] ?? 0;
    const stressed = current * (1 + pct / 100);
    return {
      name: cat,
      Current: Math.round(current),
      Stressed: Math.round(stressed),
    };
  });

  const stressedTotal = chartData.reduce((s, d) => s + d.Stressed, 0);
  const lossAmt = totalAssets - stressedTotal;
  const lossPct = totalAssets > 0 ? (lossAmt / totalAssets) * 100 : 0;

  const severity =
    lossPct < 10
      ? "Low"
      : lossPct < 25
        ? "Medium"
        : lossPct < 40
          ? "High"
          : "Severe";
  const severityColor =
    severity === "Low"
      ? "#B8FF4A"
      : severity === "Medium"
        ? "#FFD74A"
        : severity === "High"
          ? "#FF9A4A"
          : "#FF4A4A";

  return (
    <div className="space-y-6">
      <div className="fintech-card p-6">
        <h2
          className="text-base font-bold mb-2 flex items-center gap-2"
          style={{ color: "#EAF0F6" }}
        >
          <AlertTriangle size={18} style={{ color: "#FF9A4A" }} />
          Portfolio Stress Test
        </h2>
        <p className="text-xs mb-5" style={{ color: "#9AA6B2" }}>
          Simulate historical market crashes on your current portfolio to
          understand your downside risk.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedScenario(s.id)}
              data-ocid={`stress.${s.id}.button`}
              className="text-left p-3 rounded-xl border transition-all"
              style={{
                background:
                  selectedScenario === s.id
                    ? "rgba(184,255,74,0.08)"
                    : "#0F141B",
                borderColor: selectedScenario === s.id ? "#B8FF4A" : "#24303A",
                color: selectedScenario === s.id ? "#B8FF4A" : "#9AA6B2",
              }}
            >
              <div className="text-lg mb-1">{s.emoji}</div>
              <div className="text-xs font-semibold leading-tight">
                {s.name}
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedScenario("custom")}
            data-ocid="stress.custom.button"
            className="text-left p-3 rounded-xl border transition-all"
            style={{
              background:
                selectedScenario === "custom"
                  ? "rgba(184,255,74,0.08)"
                  : "#0F141B",
              borderColor:
                selectedScenario === "custom" ? "#B8FF4A" : "#24303A",
              color: selectedScenario === "custom" ? "#B8FF4A" : "#9AA6B2",
            }}
          >
            <div className="text-lg mb-1">🎛️</div>
            <div className="text-xs font-semibold">Custom Crash</div>
          </button>
        </div>

        <AnimatePresence>
          {selectedScenario === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 rounded-xl"
              style={{ background: "#0F141B", border: "1px solid #24303A" }}
            >
              <div
                className="text-xs font-medium mb-2"
                style={{ color: "#9AA6B2" }}
              >
                Custom Drop:{" "}
                <span style={{ color: "#FF4A4A" }}>-{customDrop}%</span>{" "}
                (applied to all non-cash)
              </div>
              <input
                id="custom-drop-slider"
                type="range"
                min={5}
                max={80}
                value={customDrop}
                onChange={(e) => setCustomDrop(Number(e.target.value))}
                className="w-full accent-[#B8FF4A]"
                data-ocid="stress.custom.input"
                aria-label="Custom crash percentage"
              />
              <div
                className="flex justify-between text-xs mt-1"
                style={{ color: "#9AA6B2" }}
              >
                <span>-5%</span>
                <span>-80%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div
            className="p-4 rounded-xl"
            style={{ background: "#0F141B", border: "1px solid #24303A" }}
          >
            <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
              Current Portfolio
            </div>
            <div className="text-lg font-bold" style={{ color: "#B8FF4A" }}>
              {formatINR(totalAssets)}
            </div>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ background: "#0F141B", border: "1px solid #24303A" }}
          >
            <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
              Stressed Value
            </div>
            <div className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
              {formatINR(stressedTotal)}
            </div>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{
              background: "rgba(255,74,74,0.08)",
              border: "1px solid #FF4A4A33",
            }}
          >
            <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
              Potential Loss
            </div>
            <div className="text-lg font-bold" style={{ color: "#FF4A4A" }}>
              -{formatINR(lossAmt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm" style={{ color: "#9AA6B2" }}>
            Severity:
          </span>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: `${severityColor}22`,
              color: severityColor,
              border: `1px solid ${severityColor}44`,
            }}
          >
            {severity} — {lossPct.toFixed(1)}% loss
          </span>
        </div>

        {totalAssets > 0 && (
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2A38" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9AA6B2", fontSize: 11 }}
                />
                <YAxis
                  tickFormatter={(v: number) => formatINR(v)}
                  tick={{ fill: "#9AA6B2", fontSize: 10 }}
                  width={60}
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
                <Bar dataKey="Current" fill="#B8FF4A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Stressed" fill="#FF4A4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {totalAssets === 0 && (
          <div className="text-center py-10" style={{ color: "#9AA6B2" }}>
            <Zap size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Add assets to your portfolio to run stress tests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
