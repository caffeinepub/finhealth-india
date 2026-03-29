import { Info, Sliders } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
type EntryType = "Asset" | "Liability";
interface Entry {
  id: string;
  type: EntryType;
  category: Category;
  amount: number;
}

const CATEGORIES: Category[] = [
  "Equity",
  "Debt",
  "Cash",
  "Gold",
  "Mutual Funds",
];
const CATEGORY_COLORS: Record<Category, string> = {
  Equity: "#B8FF4A",
  Debt: "#4AB8FF",
  Cash: "#FFD74A",
  Gold: "#FF9A4A",
  "Mutual Funds": "#C74AFF",
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

function computeScore(
  allocationPcts: Record<Category, number>,
  debtRatio: number,
  cashPct: number,
) {
  const catCount = CATEGORIES.filter((c) => allocationPcts[c] > 0).length;
  const divScore = [0, 5, 12, 18, 22, 25][Math.min(catCount, 5)];
  let debtScore = 0;
  if (debtRatio < 0.2) debtScore = 25;
  else if (debtRatio < 0.3) debtScore = 20;
  else if (debtRatio < 0.4) debtScore = 15;
  else if (debtRatio < 0.5) debtScore = 10;
  else if (debtRatio < 0.6) debtScore = 5;
  let efScore = 5;
  if (cashPct >= 0.1 && cashPct <= 0.2) efScore = 25;
  else if (cashPct >= 0.05 && cashPct < 0.1) efScore = 15;
  else if (cashPct > 0.2 && cashPct <= 0.3) efScore = 18;
  else if (cashPct > 0.3) efScore = 8;
  const maxPct = Math.max(...Object.values(allocationPcts)) / 100;
  let allocScore = 5;
  if (maxPct <= 0.4 && catCount >= 3) allocScore = 25;
  else if (maxPct <= 0.5 && catCount >= 2) allocScore = 18;
  else if (maxPct <= 0.6) allocScore = 12;
  return divScore + debtScore + efScore + allocScore;
}

export default function RebalancingSimulatorTab({
  entries,
}: { entries: Entry[] }) {
  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);

  const currentPcts = useMemo(() => {
    return CATEGORIES.reduce(
      (acc, cat) => {
        const amt = assets
          .filter((e) => e.category === cat)
          .reduce((s, e) => s + e.amount, 0);
        acc[cat] = totalAssets > 0 ? Math.round((amt / totalAssets) * 100) : 0;
        return acc;
      },
      {} as Record<Category, number>,
    );
  }, [assets, totalAssets]);

  const [targets, setTargets] = useState<Record<Category, number>>({
    ...currentPcts,
  });

  const targetSum = Object.values(targets).reduce((s, v) => s + v, 0);
  const isValid = targetSum === 100;

  const currentDebtRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0;
  const currentCashPct = currentPcts.Cash / 100;
  const currentScore = computeScore(
    currentPcts,
    currentDebtRatio,
    currentCashPct,
  );

  const simCashPct = targets.Cash / 100;
  const simScore = computeScore(targets, currentDebtRatio, simCashPct);
  const scoreDelta = simScore - currentScore;

  const isReducingEquity = targets.Equity < currentPcts.Equity;

  return (
    <div className="space-y-6">
      <div className="fintech-card p-6">
        <h2
          className="text-base font-bold mb-1 flex items-center gap-2"
          style={{ color: "#EAF0F6" }}
        >
          <Sliders size={18} style={{ color: "#B8FF4A" }} />
          Portfolio Rebalancing Simulator
        </h2>
        <p className="text-xs mb-5" style={{ color: "#9AA6B2" }}>
          Drag sliders to simulate your ideal allocation. See how it improves
          your health score.
        </p>

        {totalAssets === 0 ? (
          <div className="text-center py-10" style={{ color: "#9AA6B2" }}>
            <Sliders size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Add assets to your portfolio to use the rebalancer.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div
                className="p-4 rounded-xl"
                style={{ background: "#0F141B", border: "1px solid #24303A" }}
              >
                <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                  Current Score
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "#EAF0F6" }}
                >
                  {currentScore}
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
                  Simulated Score
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: scoreDelta >= 0 ? "#B8FF4A" : "#FF4A4A" }}
                >
                  {simScore}
                  <span className="text-sm ml-2">
                    {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="mb-4 p-3 rounded-xl text-xs flex items-center gap-2"
              style={{
                background: isValid
                  ? "rgba(184,255,74,0.06)"
                  : "rgba(255,74,74,0.08)",
                border: `1px solid ${isValid ? "#B8FF4A44" : "#FF4A4A44"}`,
                color: isValid ? "#B8FF4A" : "#FF4A4A",
              }}
            >
              <Info size={14} />
              Target sum: <strong>{targetSum}%</strong>{" "}
              {isValid
                ? "\u2014 Balanced \u2713"
                : `\u2014 Must be 100% (${targetSum > 100 ? "reduce" : "increase"} by ${Math.abs(100 - targetSum)}%)`}
            </div>

            <div className="space-y-4 mb-5">
              {CATEGORIES.map((cat) => {
                const currentAmt = assets
                  .filter((e) => e.category === cat)
                  .reduce((s, e) => s + e.amount, 0);
                const targetAmt = (targets[cat] / 100) * totalAssets;
                const diff = targetAmt - currentAmt;
                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: CATEGORY_COLORS[cat] }}
                      >
                        {cat}
                      </span>
                      <span className="text-xs" style={{ color: "#9AA6B2" }}>
                        {targets[cat]}%
                      </span>
                    </div>
                    <input
                      id={`rebalance-slider-${cat}`}
                      type="range"
                      min={0}
                      max={100}
                      value={targets[cat]}
                      onChange={(e) =>
                        setTargets((prev) => ({
                          ...prev,
                          [cat]: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-[#B8FF4A] mb-1"
                      data-ocid={`rebalance.${cat.toLowerCase().replace(" ", "_")}.input`}
                      aria-label={`${cat} target allocation`}
                    />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div style={{ color: "#9AA6B2" }}>
                        Current: {formatINR(currentAmt)}
                      </div>
                      <div style={{ color: "#9AA6B2" }}>
                        Target: {formatINR(targetAmt)}
                      </div>
                      <div
                        style={{
                          color:
                            diff > 0
                              ? "#B8FF4A"
                              : diff < 0
                                ? "#FF4A4A"
                                : "#9AA6B2",
                        }}
                      >
                        {diff > 0 ? "+" : ""}
                        {formatINR(diff)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isReducingEquity && (
              <div
                className="p-3 rounded-xl mb-4 flex items-start gap-2"
                style={{
                  background: "rgba(255,157,74,0.08)",
                  border: "1px solid #FF9A4A33",
                }}
              >
                <Info size={14} style={{ color: "#FF9A4A", marginTop: 2 }} />
                <p className="text-xs" style={{ color: "#FF9A4A" }}>
                  Selling equity may attract <strong>10% LTCG tax</strong> on
                  gains above \u20b91L. Consider harvesting in tranches across
                  FY.
                </p>
              </div>
            )}

            <button
              type="button"
              disabled
              className="w-full py-3 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed"
              style={{ background: "#24303A", color: "#9AA6B2" }}
              title="Coming soon \u2014 import will be available in v7"
              data-ocid="rebalance.save_button"
            >
              Apply to Portfolio (Coming in v7)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
