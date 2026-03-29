import { AlertTriangle, CheckCircle, Download, Share2 } from "lucide-react";
import { useRef } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";

type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
type EntryType = "Asset" | "Liability";
interface Entry {
  id: string;
  type: EntryType;
  category: Category;
  amount: number;
}

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

type Archetype = {
  name: string;
  icon: string;
  description: string;
};

function detectArchetype(entries: Entry[]): Archetype {
  const assets = entries.filter((e) => e.type === "Asset");
  const total = assets.reduce((s, e) => s + e.amount, 0);
  if (total === 0)
    return {
      name: "Emerging Wealth Builder",
      icon: "\ud83c\udf31",
      description:
        "You are at the beginning of your financial journey. Every rupee invested today compounds into a fortune tomorrow. The best time to start was yesterday; the second best is now.",
    };

  const pct = (cat: Category) =>
    (assets
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0) /
      total) *
    100;
  const eqPct = pct("Equity");
  const debtPct = pct("Debt");
  const goldPct = pct("Gold");
  const cashPct = pct("Cash");
  const maxPct = Math.max(
    eqPct,
    debtPct,
    goldPct,
    cashPct,
    pct("Mutual Funds"),
  );

  if (eqPct > 60)
    return {
      name: "Aggressive Growth Seeker",
      icon: "\ud83d\ude80",
      description:
        "You thrive on market volatility and chase asymmetric returns. Your high equity allocation shows conviction in long-term wealth creation, though you must weather significant drawdowns with discipline.",
    };
  if (eqPct < 20 && debtPct > 40)
    return {
      name: "Conservative Preserver",
      icon: "\ud83d\udee1\ufe0f",
      description:
        "Capital preservation is your north star. You prioritize stability over growth, making you resilient in market downturns but potentially underperforming in bull runs over the long term.",
    };
  if (goldPct > 25)
    return {
      name: "Tangible Asset Defender",
      icon: "\ud83e\ude99",
      description:
        "You trust what you can see and hold. Your significant gold allocation reflects a hedge against currency risk and systemic uncertainty \u2014 a time-tested Indian wealth preservation strategy.",
    };
  if (cashPct > 30)
    return {
      name: "Cautious Accumulator",
      icon: "\ud83d\udcb0",
      description:
        "You maintain high liquidity as a safety buffer. While wise for short-term security, excess cash is silently eroded by inflation. Deploying idle cash into growth assets could dramatically improve your long-term outlook.",
    };
  if (maxPct <= 45)
    return {
      name: "Balanced Strategist",
      icon: "\u2696\ufe0f",
      description:
        "You are the financial equivalent of a seasoned chess player \u2014 patient, diversified, and deliberate. Your balanced approach minimizes concentration risk while capturing returns across multiple asset classes.",
    };
  return {
    name: "Emerging Wealth Builder",
    icon: "\ud83c\udf31",
    description:
      "You are building your financial foundation with conviction. Your portfolio shows early-stage diversification effort \u2014 an excellent sign of financial awareness and discipline.",
  };
}

function computeStrengths(entries: Entry[]): string[] {
  const assets = entries.filter((e) => e.type === "Asset");
  const total = assets.reduce((s, e) => s + e.amount, 0);
  const liabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);
  const strengths: string[] = [];
  const cats = new Set(assets.map((e) => e.category)).size;
  if (cats >= 4)
    strengths.push(`Excellent diversification across ${cats} asset classes`);
  else if (cats >= 3)
    strengths.push(`Good diversification across ${cats} asset classes`);
  if (total > 0 && liabilities / total < 0.2)
    strengths.push("Healthy debt-to-asset ratio below 20%");
  const cashPct =
    assets
      .filter((e) => e.category === "Cash")
      .reduce((s, e) => s + e.amount, 0) / total;
  if (cashPct >= 0.1 && cashPct <= 0.25)
    strengths.push("Adequate emergency fund (10\u201325% in cash)");
  const growthPct =
    assets
      .filter((e) => e.category === "Equity" || e.category === "Mutual Funds")
      .reduce((s, e) => s + e.amount, 0) / total;
  if (growthPct > 0.4)
    strengths.push("Strong growth asset allocation (Equity + MF)");
  if (total > 0 && assets.some((e) => e.category === "Gold"))
    strengths.push("Inflation hedge via gold holdings");
  return strengths.slice(0, 3);
}

function computeRisks(entries: Entry[]): string[] {
  const assets = entries.filter((e) => e.type === "Asset");
  const total = assets.reduce((s, e) => s + e.amount, 0);
  const liabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);
  const risks: string[] = [];
  const eqAmt = assets
    .filter((e) => e.category === "Equity")
    .reduce((s, e) => s + e.amount, 0);
  if (total > 0 && eqAmt / total > 0.6)
    risks.push("High equity concentration \u2014 exposed to market volatility");
  if (total > 0 && liabilities / total > 0.4)
    risks.push("High liability ratio \u2014 financial flexibility at risk");
  const cashPct =
    assets
      .filter((e) => e.category === "Cash")
      .reduce((s, e) => s + e.amount, 0) / total;
  if (cashPct < 0.05 && total > 0)
    risks.push("Insufficient emergency fund (< 5% in cash)");
  if (cashPct > 0.35 && total > 0)
    risks.push("Excess cash holdings \u2014 purchasing power eroding");
  const cats = new Set(assets.map((e) => e.category)).size;
  if (cats <= 2 && total > 0)
    risks.push("Low diversification \u2014 concentration risk");
  if (!assets.some((e) => e.category === "Gold") && total > 0)
    risks.push("No inflation hedge \u2014 consider gold/SGB allocation");
  return risks.slice(0, 3);
}

export default function DnaReportTab({
  entries,
  healthScore,
}: {
  entries: Entry[];
  healthScore: number;
}) {
  const reportRef = useRef<HTMLDivElement>(null);

  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtRatio =
    totalAssets > 0
      ? ((totalLiabilities / totalAssets) * 100).toFixed(1)
      : "0.0";

  const archetype = detectArchetype(entries);
  const strengths = computeStrengths(entries);
  const risks = computeRisks(entries);

  const pieData = (
    ["Equity", "Debt", "Cash", "Gold", "Mutual Funds"] as Category[]
  )
    .map((cat) => ({
      name: cat,
      value: assets
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0),
    }))
    .filter((d) => d.value > 0);

  const scoreColor =
    healthScore >= 75 ? "#B8FF4A" : healthScore >= 50 ? "#FFD74A" : "#FF4A4A";

  const shareText = `My FinHealth India Report \ud83d\udcca\nArchetype: ${archetype.icon} ${archetype.name}\nHealth Score: ${healthScore}/100\nNet Worth: ${formatINR(netWorth)}\nTop Risk: ${risks[0] ?? "None"}\n\nPowered by FinHealth India`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Report copied to clipboard!");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const handleDownload = () => {
    const el = reportRef.current;
    if (!el) {
      toast.error("Report not ready");
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Financial DNA Report - FinHealth India</title>
    <style>
      body{background:#060A10;color:#EAF0F6;font-family:system-ui,sans-serif;padding:32px;margin:0;}
      .report{max-width:700px;margin:0 auto;}
      h2{color:#B8FF4A;margin-bottom:8px;}
      p{color:#9AA6B2;font-size:13px;}
      .metric{display:inline-block;background:#0F141B;border:1px solid #24303A;border-radius:10px;padding:12px 16px;margin:6px;min-width:120px;}
      .metric .label{color:#9AA6B2;font-size:11px;}
      .metric .val{font-weight:700;font-size:16px;}
      ul{color:#9AA6B2;font-size:13px;padding-left:20px;}
      li{margin-bottom:6px;}
      .footer{margin-top:24px;font-size:11px;color:#4A5568;border-top:1px solid #24303A;padding-top:12px;}
    </style></head>
    <body><div class="report">${el.innerHTML}</div>
    <div class="footer">Generated by FinHealth India. For educational purposes only. Not investment advice.</div>
    <script>window.onload=function(){window.print();}<\/script></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financial-dna-report.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  const cashPct =
    totalAssets > 0
      ? (
          (assets
            .filter((e) => e.category === "Cash")
            .reduce((s, e) => s + e.amount, 0) /
            totalAssets) *
          100
        ).toFixed(0)
      : "0";
  const efStatus = Number.parseFloat(cashPct) >= 10 ? "Adequate" : "Low";

  return (
    <div className="space-y-6" data-ocid="dna.card">
      <div
        ref={reportRef}
        className="fintech-card p-6 mb-4"
        style={{
          background: "linear-gradient(135deg, #0F141B 0%, #1A2332 100%)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="text-3xl mb-1">{archetype.icon}</div>
            <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
              {archetype.name}
            </h2>
            <p className="text-xs mt-1 max-w-md" style={{ color: "#9AA6B2" }}>
              {archetype.description}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: 90, height: 90 }}>
              <svg
                viewBox="0 0 90 90"
                style={{ transform: "rotate(-90deg)" }}
                aria-hidden="true"
              >
                <circle
                  cx="45"
                  cy="45"
                  r="38"
                  fill="none"
                  stroke="#1F2A38"
                  strokeWidth="8"
                />
                <circle
                  cx="45"
                  cy="45"
                  r="38"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(healthScore / 100) * 238.76} 238.76`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-xl font-bold"
                  style={{ color: scoreColor }}
                >
                  {healthScore}
                </span>
                <span className="text-xs" style={{ color: "#9AA6B2" }}>
                  /100
                </span>
              </div>
            </div>
            <span className="text-xs mt-1" style={{ color: "#9AA6B2" }}>
              Health Score
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Net Worth",
              value: formatINR(netWorth),
              color: netWorth >= 0 ? "#B8FF4A" : "#FF4A4A",
            },
            {
              label: "Total Assets",
              value: formatINR(totalAssets),
              color: "#EAF0F6",
            },
            {
              label: "Total Liabilities",
              value: formatINR(totalLiabilities),
              color: totalLiabilities > 0 ? "#FF4A4A" : "#9AA6B2",
            },
            {
              label: "Debt Ratio",
              value: `${debtRatio}%`,
              color: Number.parseFloat(debtRatio) < 30 ? "#B8FF4A" : "#FF4A4A",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-xl"
              style={{ background: "#0F141B", border: "1px solid #24303A" }}
            >
              <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                {m.label}
              </div>
              <div className="text-base font-bold" style={{ color: m.color }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <div
              className="text-xs font-semibold mb-2"
              style={{ color: "#9AA6B2" }}
            >
              Asset Allocation
            </div>
            {pieData.length > 0 ? (
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((d) => (
                        <Cell
                          key={d.name}
                          fill={CATEGORY_COLORS[d.name as Category]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => formatINR(v)}
                      contentStyle={{
                        background: "#0F141B",
                        border: "1px solid #24303A",
                        borderRadius: 10,
                        color: "#EAF0F6",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div
                className="flex items-center justify-center h-44"
                style={{ color: "#9AA6B2" }}
              >
                <p className="text-xs">No assets added yet</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <div
                className="text-xs font-semibold mb-2 flex items-center gap-1"
                style={{ color: "#B8FF4A" }}
              >
                <CheckCircle size={12} /> Top Strengths
              </div>
              {strengths.length > 0 ? (
                <ul className="space-y-1.5">
                  {strengths.map((s) => (
                    <li
                      key={s}
                      className="text-xs flex items-start gap-1.5"
                      style={{ color: "#9AA6B2" }}
                    >
                      <span style={{ color: "#B8FF4A" }}>\u2713</span> {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs" style={{ color: "#9AA6B2" }}>
                  Add assets to see your strengths.
                </p>
              )}
            </div>
            <div>
              <div
                className="text-xs font-semibold mb-2 flex items-center gap-1"
                style={{ color: "#FF4A4A" }}
              >
                <AlertTriangle size={12} /> Risk Flags
              </div>
              {risks.length > 0 ? (
                <ul className="space-y-1.5">
                  {risks.map((r) => (
                    <li
                      key={r}
                      className="text-xs flex items-start gap-1.5"
                      style={{ color: "#9AA6B2" }}
                    >
                      <span style={{ color: "#FF4A4A" }}>\u26a0</span> {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs" style={{ color: "#9AA6B2" }}>
                  No major risks detected!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
          {[
            {
              label: "Emergency Fund",
              value: efStatus,
              color: efStatus === "Adequate" ? "#B8FF4A" : "#FF4A4A",
            },
            {
              label: "Portfolio Health",
              value:
                healthScore >= 75
                  ? "Strong"
                  : healthScore >= 50
                    ? "Moderate"
                    : "Weak",
              color: scoreColor,
            },
            {
              label: "Asset Classes",
              value: `${new Set(assets.map((e) => e.category)).size} / 5`,
              color: "#4AB8FF",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-xl text-center"
              style={{ background: "#0F141B", border: "1px solid #24303A" }}
            >
              <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                {m.label}
              </div>
              <div className="text-sm font-bold" style={{ color: m.color }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "#B8FF4A", color: "#060A10" }}
            data-ocid="dna.share.button"
          >
            <Share2 size={16} /> Share Report
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{
              background: "#1F2A38",
              color: "#EAF0F6",
              border: "1px solid #24303A",
            }}
            data-ocid="dna.download.button"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
