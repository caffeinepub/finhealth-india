import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronRight,
  CloudUpload,
  Info,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Scale,
  Shield,
  Trash2,
  TrendingUp,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Papa from "papaparse";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import DnaReportTab from "./components/DnaReportTab";
import GoldSgbTab from "./components/GoldSgbTab";
import InflationTrackerTab from "./components/InflationTrackerTab";
import InvestmentCalculatorTab from "./components/InvestmentCalculatorTab";
import KycChecklistTab from "./components/KycChecklistTab";
import LifeStageRoadmapTab from "./components/LifeStageRoadmapTab";
import LoanPrepaymentTab from "./components/LoanPrepaymentTab";
import RebalancingSimulatorTab from "./components/RebalancingSimulatorTab";
import SipCalculatorTab from "./components/SipCalculatorTab";
import StressTestTab from "./components/StressTestTab";
import TaxOptimizerTab from "./components/TaxOptimizerTab";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ─── Types ──────────────────────────────────────────────────────────────────
type EntryType = "Asset" | "Liability";
type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
type InsightSeverity = "danger" | "warning" | "info" | "success";

interface Entry {
  id: string;
  type: EntryType;
  category: Category;
  amount: number;
}

interface Insight {
  message: string;
  severity: InsightSeverity;
}

interface NetWorthSnapshot {
  timestamp: number;
  netWorth: number;
}

interface ParsedRow {
  type: EntryType;
  category: Category;
  amount: number;
}

interface UploadError {
  row: number;
  message: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<Category, string> = {
  Equity: "#B8FF4A",
  Debt: "#4AB8FF",
  Cash: "#FFD74A",
  Gold: "#FF9A4A",
  "Mutual Funds": "#C74AFF",
};

const CATEGORIES: Category[] = [
  "Equity",
  "Debt",
  "Cash",
  "Gold",
  "Mutual Funds",
];

const CATEGORY_MAP: Record<string, Category> = {
  equity: "Equity",
  debt: "Debt",
  cash: "Cash",
  gold: "Gold",
  "mutual fund": "Mutual Funds",
  "mutual funds": "Mutual Funds",
};

const LS_KEY = "finhealth_networth_history";

// ─── LocalStorage helpers ────────────────────────────────────────────────────
function loadHistory(): NetWorthSnapshot[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as NetWorthSnapshot[];
  } catch {
    return [];
  }
}

function pushSnapshot(netWorth: number): NetWorthSnapshot[] {
  const history = loadHistory();
  history.push({ timestamp: Date.now(), netWorth });
  const trimmed = history.slice(-30);
  localStorage.setItem(LS_KEY, JSON.stringify(trimmed));
  return trimmed;
}

// ─── Finance helpers ──────────────────────────────────────────────────────────
function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function computeScoreBreakdown(entries: Entry[]) {
  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);

  if (totalAssets === 0)
    return {
      total: 0,
      diversification: 0,
      debtRatio: 0,
      emergencyFund: 0,
      allocation: 0,
    };

  const assetCats = new Set(assets.map((e) => e.category)).size;
  const divScore = [0, 5, 12, 18, 22, 25][Math.min(assetCats, 5)];

  const liabRatio = totalLiabilities / totalAssets;
  let debtScore = 0;
  if (liabRatio < 0.2) debtScore = 25;
  else if (liabRatio < 0.3) debtScore = 20;
  else if (liabRatio < 0.4) debtScore = 15;
  else if (liabRatio < 0.5) debtScore = 10;
  else if (liabRatio < 0.6) debtScore = 5;

  const cashAmt = assets
    .filter((e) => e.category === "Cash")
    .reduce((s, e) => s + e.amount, 0);
  const cashPct = cashAmt / totalAssets;
  // Emergency fund: 10-20% ideal=25, 5-10%=15, 20-30%=18, >30%=8, <5%=5
  let efScore = 5;
  if (cashPct >= 0.1 && cashPct <= 0.2) efScore = 25;
  else if (cashPct >= 0.05 && cashPct < 0.1) efScore = 15;
  else if (cashPct > 0.2 && cashPct <= 0.3) efScore = 18;
  else if (cashPct > 0.3) efScore = 8;

  const maxCatAmt = Math.max(
    ...CATEGORIES.map((cat) =>
      assets
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0),
    ),
  );
  const maxCatPct = totalAssets > 0 ? maxCatAmt / totalAssets : 0;
  // Allocation balance: maxCatPct<=0.4 and cats>=3=25, <=0.5 and cats>=2=18, <=0.6=12, >0.6=5
  let allocScore = 5;
  if (maxCatPct <= 0.4 && assetCats >= 3) allocScore = 25;
  else if (maxCatPct <= 0.5 && assetCats >= 2) allocScore = 18;
  else if (maxCatPct <= 0.6) allocScore = 12;

  return {
    total: divScore + debtScore + efScore + allocScore,
    diversification: divScore,
    debtRatio: debtScore,
    emergencyFund: efScore,
    allocation: allocScore,
  };
}

function computeInsights(entries: Entry[]): Insight[] {
  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);

  if (totalAssets === 0) return [];

  const getCatAmt = (cat: Category) =>
    assets.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);

  const equityAmt = getCatAmt("Equity");
  const cashAmt = getCatAmt("Cash");
  const goldAmt = getCatAmt("Gold");
  const mfAmt = getCatAmt("Mutual Funds");
  const equityPct = (equityAmt / totalAssets) * 100;
  const cashPct = (cashAmt / totalAssets) * 100;
  const goldPct = (goldAmt / totalAssets) * 100;
  const mfPct = (mfAmt / totalAssets) * 100;
  const liabRatioPct = (totalLiabilities / totalAssets) * 100;
  const distinctCats = new Set(assets.map((e) => e.category)).size;
  const netWorth = totalAssets - totalLiabilities;

  const insights: Insight[] = [];

  // Net worth overview
  insights.push({
    message: `Net Worth: ${formatINR(netWorth)} (Assets: ${formatINR(totalAssets)}, Liabilities: ${formatINR(totalLiabilities)})`,
    severity: netWorth >= 0 ? "success" : "danger",
  });

  // Equity insights
  if (equityAmt > 0) {
    if (equityPct > 75) {
      insights.push({
        message: `Equity allocation is ${equityPct.toFixed(1)}% (${formatINR(equityAmt)}) — above recommended 40–70% range, indicating high risk`,
        severity: "warning",
      });
    } else if (equityPct < 40) {
      insights.push({
        message: `Equity allocation is only ${equityPct.toFixed(1)}% (${formatINR(equityAmt)}) — below recommended 40% minimum, limiting growth potential`,
        severity: "info",
      });
    } else {
      insights.push({
        message: `Equity allocation is ${equityPct.toFixed(1)}% (${formatINR(equityAmt)}) — within the healthy 40–70% range`,
        severity: "success",
      });
    }
  } else {
    insights.push({
      message:
        "No equity holdings detected — consider adding equity for long-term growth",
      severity: "info",
    });
  }

  // Cash/Emergency fund insights
  if (cashPct > 30) {
    insights.push({
      message: `Cash holding is ${cashPct.toFixed(1)}% (${formatINR(cashAmt)}) — excessively idle; ideal range is 10–20% of assets`,
      severity: "warning",
    });
  } else if (cashPct < 5) {
    insights.push({
      message: `Cash is only ${cashPct.toFixed(1)}% (${formatINR(cashAmt)}) — insufficient emergency fund; aim for at least 10% of assets`,
      severity: "danger",
    });
  } else if (cashPct >= 10 && cashPct <= 20) {
    insights.push({
      message: `Cash/Emergency fund is ${cashPct.toFixed(1)}% (${formatINR(cashAmt)}) — in the ideal 10–20% range`,
      severity: "success",
    });
  } else {
    insights.push({
      message: `Cash holding is ${cashPct.toFixed(1)}% (${formatINR(cashAmt)}) — slightly outside ideal 10–20% range`,
      severity: "info",
    });
  }

  // Debt/Liability ratio
  if (liabRatioPct > 60) {
    insights.push({
      message: `Debt ratio is ${liabRatioPct.toFixed(1)}% (${formatINR(totalLiabilities)}) — critical risk; safe threshold is below 40%`,
      severity: "danger",
    });
  } else if (liabRatioPct > 40) {
    insights.push({
      message: `Debt ratio is ${liabRatioPct.toFixed(1)}% (${formatINR(totalLiabilities)}) — above the 40% safe threshold; work on reducing liabilities`,
      severity: "warning",
    });
  } else if (liabRatioPct > 0) {
    insights.push({
      message: `Debt ratio is ${liabRatioPct.toFixed(1)}% (${formatINR(totalLiabilities)}) — within safe range (below 40%)`,
      severity: "success",
    });
  }

  // Gold insights
  if (goldAmt > 0) {
    insights.push({
      message: `Gold allocation is ${goldPct.toFixed(1)}% (${formatINR(goldAmt)}) — provides inflation hedge and portfolio diversification`,
      severity: "info",
    });
  }

  // Mutual Funds insights
  if (mfAmt > 0) {
    insights.push({
      message: `Mutual Funds allocation is ${mfPct.toFixed(1)}% (${formatINR(mfAmt)}) — good for systematic, diversified investing`,
      severity: "info",
    });
  }

  // Diversification
  if (distinctCats < 3) {
    insights.push({
      message: `Portfolio has only ${distinctCats} asset ${distinctCats === 1 ? "category" : "categories"} — poor diversification; aim for 3+ categories`,
      severity: "warning",
    });
  } else {
    insights.push({
      message: `Portfolio spans ${distinctCats} asset categories — good diversification`,
      severity: "success",
    });
  }

  // Inflation erosion insight for cash
  if (cashAmt > 0) {
    insights.push({
      message: `Cash of ${formatINR(cashAmt)} loses ~${formatINR(cashAmt * 0.06)}/year to inflation at 6%`,
      severity: cashPct > 20 ? "warning" : "info",
    });
  }

  return insights;
}

function computeActions(entries: Entry[]): Insight[] {
  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);

  if (totalAssets === 0) return [];

  const equityAmt = assets
    .filter((e) => e.category === "Equity")
    .reduce((s, e) => s + e.amount, 0);
  const cashAmt = assets
    .filter((e) => e.category === "Cash")
    .reduce((s, e) => s + e.amount, 0);
  const equityPct = equityAmt / totalAssets;
  const cashPct = cashAmt / totalAssets;

  const actions: Insight[] = [];

  if (equityPct > 0.65) {
    const reduceAmt = (equityPct - 0.65) * totalAssets;
    actions.push({
      message: `Reduce equity by ${formatINR(reduceAmt)} (shift to Debt or Gold for stability)`,
      severity: "warning",
    });
  }

  if (cashPct > 0.15) {
    const investAmt = cashAmt - 0.15 * totalAssets;
    actions.push({
      message: `Invest ${formatINR(investAmt)} idle cash into liquid mutual funds or FDs`,
      severity: "warning",
    });
  }

  if (totalLiabilities > 0.4 * totalAssets) {
    const reduceDebt = totalLiabilities - 0.4 * totalAssets;
    actions.push({
      message: `Target reducing debt by ${formatINR(reduceDebt)} to reach a safe 40% debt ratio`,
      severity: "danger",
    });
  }

  const emergencyTarget = 0.2 * totalAssets;
  if (cashAmt < emergencyTarget) {
    const increase = emergencyTarget - cashAmt;
    actions.push({
      message: `Increase emergency fund by ${formatINR(increase)} to reach ${formatINR(emergencyTarget)} (20% of assets)`,
      severity: "info",
    });
  }

  if (actions.length === 0) {
    actions.push({
      message:
        "Your portfolio is well-optimized. Continue regular rebalancing every 6 months.",
      severity: "success",
    });
  }

  return actions;
}

// ─── CSV / Excel parsing ──────────────────────────────────────────────────────
function validateAndParse(rawRows: Record<string, unknown>[]): {
  rows: ParsedRow[];
  errors: UploadError[];
} {
  const rows: ParsedRow[] = [];
  const errors: UploadError[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const raw = rawRows[i];
    const rowNum = i + 2; // 1-indexed, header is row 1

    // Normalise keys
    const normalised: Record<string, string> = {};
    for (const k of Object.keys(raw)) {
      normalised[k.trim().toLowerCase()] = String(raw[k] ?? "").trim();
    }

    const typeRaw = normalised.type ?? "";
    const catRaw = normalised.category ?? "";
    const amtRaw = normalised.amount ?? "";

    if (!typeRaw && !catRaw && !amtRaw) continue; // skip blank rows

    const typeNorm = typeRaw.toLowerCase();
    if (typeNorm !== "asset" && typeNorm !== "liability") {
      errors.push({
        row: rowNum,
        message: `Row ${rowNum}: "type" must be Asset or Liability (got "${typeRaw}")`,
      });
      continue;
    }

    const catNorm = catRaw.toLowerCase();
    const mappedCat = CATEGORY_MAP[catNorm];
    if (!mappedCat) {
      errors.push({
        row: rowNum,
        message: `Row ${rowNum}: "category" must be one of Equity, Debt, Cash, Gold, Mutual Funds (got "${catRaw}")`,
      });
      continue;
    }

    const amt = Number.parseFloat(amtRaw.replace(/[₹,]/g, ""));
    if (Number.isNaN(amt) || amt <= 0) {
      errors.push({
        row: rowNum,
        message: `Row ${rowNum}: "amount" must be a positive number (got "${amtRaw}")`,
      });
      continue;
    }

    rows.push({
      type: typeNorm === "asset" ? "Asset" : "Liability",
      category: mappedCat,
      amount: amt,
    });
  }

  return { rows, errors };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HealthGauge({ score }: { score: number }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const R = 80;
  const circumference = Math.PI * R;

  const scoreColor =
    score >= 70 ? "#B8FF4A" : score >= 40 ? "#FFB84A" : "#FF4A4A";
  const label = score >= 80 ? "Strong" : score >= 50 ? "Moderate" : "Weak";

  const filledAngle = (score / 100) * Math.PI;
  const dashOffset = circumference - (filledAngle / Math.PI) * circumference;

  const arcPath = (r: number) => {
    const x1 = cx + r * Math.cos(Math.PI);
    const y1 = cy - r * Math.sin(Math.PI);
    const x2 = cx + r * Math.cos(0);
    const y2 = cy - r * Math.sin(0);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        role="img"
        aria-label={`Financial health score: ${score} out of 100, rated ${label}`}
        width={size}
        height={size / 2 + 40}
        viewBox={`0 0 ${size} ${size / 2 + 60}`}
      >
        <path
          d={arcPath(R)}
          fill="none"
          stroke="#1F2A38"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d={arcPath(R)}
          fill="none"
          stroke={scoreColor}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${dashOffset}`}
          style={{
            filter: `drop-shadow(0 0 8px ${scoreColor}80)`,
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill={scoreColor}
          fontSize={40}
          fontWeight={700}
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 32}
          textAnchor="middle"
          fill="#9AA6B2"
          fontSize={13}
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          out of 100
        </text>
      </svg>
      <span
        className="text-sm font-bold px-4 py-1 rounded-full mt-1"
        style={{
          background: `${scoreColor}20`,
          color: scoreColor,
          border: `1px solid ${scoreColor}40`,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: "neon" | "red" | "default";
}) {
  const valueColor =
    highlight === "neon"
      ? "#B8FF4A"
      : highlight === "red"
        ? "#FF4A4A"
        : "#EAF0F6";
  return (
    <div className="fintech-card p-5 flex flex-col gap-2">
      <div
        className="flex items-center gap-2"
        style={{ color: "#9AA6B2", fontSize: 13 }}
      >
        <span style={{ color: "#B8FF4A" }}>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div
        className="text-2xl font-bold"
        style={{ color: valueColor, letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: "#9AA6B2" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="fintech-card p-4 flex flex-col gap-1"
      style={{ borderRadius: 14 }}
    >
      <div className="text-xs font-medium" style={{ color: "#9AA6B2" }}>
        {label}
      </div>
      <div className="text-lg font-bold" style={{ color: color ?? "#EAF0F6" }}>
        {value}
      </div>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#141A22",
          border: "1px solid #24303A",
          borderRadius: 8,
          padding: "8px 14px",
        }}
      >
        <p style={{ color: "#EAF0F6", margin: 0, fontSize: 13 }}>
          <span
            style={{
              color: CATEGORY_COLORS[payload[0].name as Category] || "#B8FF4A",
            }}
          >
            ■
          </span>{" "}
          {payload[0].name}: <strong>{formatINR(payload[0].value)}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const TrendTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "#141A22",
          border: "1px solid #B8FF4A40",
          borderRadius: 8,
          padding: "8px 14px",
        }}
      >
        <p
          style={{ color: "#B8FF4A", margin: 0, fontSize: 13, fontWeight: 700 }}
        >
          {formatINR(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

function insightIcon(sev: InsightSeverity) {
  if (sev === "danger") return <XCircle size={16} color="#FF4A4A" />;
  if (sev === "warning") return <AlertTriangle size={16} color="#FFB84A" />;
  if (sev === "info") return <Info size={16} color="#4AB8FF" />;
  return <CheckCircle size={16} color="#B8FF4A" />;
}

function StatusBadge({
  label,
  status,
  positive,
}: { label: string; status: string; positive: boolean | null }) {
  const color =
    positive === true ? "#B8FF4A" : positive === false ? "#FF4A4A" : "#FFB84A";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-medium" style={{ color: "#9AA6B2" }}>
        {label}
      </span>
      <span
        className="px-3 py-1 rounded-full text-sm font-bold"
        style={{
          background: `${color}18`,
          color,
          border: `1px solid ${color}40`,
        }}
      >
        {status}
      </span>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({
  login,
  isLoggingIn,
}: { login: () => void; isLoggingIn: boolean }) {
  return (
    <div
      className="neon-bg min-h-screen flex items-center justify-center"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fintech-card p-10 flex flex-col items-center gap-6 text-center"
        style={{ maxWidth: 420, width: "100%", margin: "0 1rem" }}
      >
        <div className="flex items-center gap-3">
          <Zap
            size={32}
            style={{
              color: "#B8FF4A",
              filter: "drop-shadow(0 0 10px #B8FF4A80)",
            }}
          />
          <span className="text-3xl font-bold" style={{ color: "#EAF0F6" }}>
            FinPulse
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "#EAF0F6" }}>
            Your AI-Powered Financial Advisor
          </h1>
          <p className="text-sm" style={{ color: "#9AA6B2", lineHeight: 1.6 }}>
            Get deep insights, health scores, and personalized recommendations
            for your portfolio.
          </p>
        </div>

        <div className="w-full grid grid-cols-3 gap-3">
          {["Secure", "Private", "Decentralized"].map((f) => (
            <div
              key={f}
              className="py-2 rounded-xl text-center text-xs font-semibold"
              style={{
                background: "rgba(184,255,74,0.08)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.2)",
              }}
            >
              {f}
            </div>
          ))}
        </div>

        <button
          type="button"
          data-ocid="auth.primary_button"
          className="neon-btn w-full flex items-center justify-center gap-2 py-3.5 text-base"
          onClick={login}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Zap size={18} />
              Sign in with Internet Identity
            </>
          )}
        </button>

        <p className="text-xs" style={{ color: "#9AA6B2" }}>
          Your data is stored on-chain — only you control it.
        </p>
      </motion.div>
    </div>
  );
}

// ─── Upload Section ───────────────────────────────────────────────────────────
function UploadSection({
  onImport,
}: {
  onImport: (rows: ParsedRow[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewRows, setPreviewRows] = useState<ParsedRow[] | null>(null);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const [fileName, setFileName] = useState("");

  const processRows = useCallback((rawRows: Record<string, unknown>[]) => {
    const { rows, errors: errs } = validateAndParse(rawRows);
    setPreviewRows(rows);
    setErrors(errs);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      setPreviewRows(null);
      setErrors([]);

      if (file.name.endsWith(".csv")) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            processRows(results.data as Record<string, unknown>[]);
          },
          error: () => {
            setErrors([
              {
                row: 0,
                message: "Failed to parse CSV file. Please check the format.",
              },
            ]);
          },
        });
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = new Uint8Array(ev.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet) as Record<
              string,
              unknown
            >[];
            processRows(json);
          } catch {
            setErrors([
              {
                row: 0,
                message: "Failed to parse Excel file. Please check the format.",
              },
            ]);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrors([
          {
            row: 0,
            message:
              "Unsupported file format. Please upload a .csv or .xlsx file.",
          },
        ]);
      }
    },
    [processRows],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    if (previewRows && previewRows.length > 0) {
      onImport(previewRows);
      setPreviewRows(null);
      setErrors([]);
      setFileName("");
      toast.success(`Imported ${previewRows.length} entries successfully!`);
    }
  };

  return (
    <div className="fintech-card p-6 mb-6">
      <h2
        className="text-base font-bold mb-4 flex items-center gap-2"
        style={{ color: "#EAF0F6" }}
      >
        <CloudUpload size={18} style={{ color: "#B8FF4A" }} />
        Upload Portfolio
      </h2>

      <p className="text-xs mb-4" style={{ color: "#9AA6B2" }}>
        Upload a .csv or .xlsx file with columns:{" "}
        <code style={{ color: "#B8FF4A" }}>type</code>,{" "}
        <code style={{ color: "#B8FF4A" }}>category</code>,{" "}
        <code style={{ color: "#B8FF4A" }}>amount</code>
      </p>

      {/* Drop zone */}
      <div
        data-ocid="upload.dropzone"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl cursor-pointer transition-all"
        style={{
          border: `2px dashed ${isDragging ? "#B8FF4A" : "#24303A"}`,
          background: isDragging ? "rgba(184,255,74,0.05)" : "#0F141B",
          boxShadow: isDragging ? "0 0 20px rgba(184,255,74,0.15)" : "none",
        }}
      >
        <CloudUpload
          size={32}
          style={{
            color: isDragging ? "#B8FF4A" : "#9AA6B2",
            transition: "color 0.2s",
          }}
        />
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: "#EAF0F6" }}>
            Drop your file here, or{" "}
            <span style={{ color: "#B8FF4A" }}>browse</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "#9AA6B2" }}>
            .csv, .xlsx supported
          </p>
        </div>
        {fileName && (
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ background: "rgba(184,255,74,0.1)", color: "#B8FF4A" }}
          >
            {fileName}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleInputChange}
        data-ocid="upload.button"
      />

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-1.5" data-ocid="upload.error_state">
          {errors.map((err) => (
            <div
              key={err.row}
              className="flex items-start gap-2 text-xs px-3 py-2 rounded-lg"
              style={{ background: "rgba(255,74,74,0.1)", color: "#FF4A4A" }}
            >
              <XCircle size={14} className="flex-shrink-0 mt-0.5" />
              {err.message}
            </div>
          ))}
        </div>
      )}

      {/* Preview table */}
      {previewRows && previewRows.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#9AA6B2" }}
            >
              Preview — {previewRows.length} rows
            </h3>
            <button
              type="button"
              data-ocid="upload.import_button"
              className="neon-btn py-2 px-5 text-sm"
              onClick={handleImport}
            >
              Import to Portfolio
            </button>
          </div>
          <div
            className="overflow-x-auto rounded-xl"
            style={{ border: "1px solid #24303A" }}
          >
            <table className="w-full text-xs">
              <thead>
                <tr
                  style={{
                    background: "#0F141B",
                    borderBottom: "1px solid #24303A",
                  }}
                >
                  {["Type", "Category", "Amount"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-semibold"
                      style={{ color: "#9AA6B2" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(0, 10).map((row, i) => (
                  <tr
                    key={`${row.type}-${row.category}-${i}`}
                    data-ocid={`upload.row.${i + 1}`}
                    style={{ borderBottom: "1px solid #1A2230" }}
                  >
                    <td className="px-4 py-2.5">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background:
                            row.type === "Asset"
                              ? "rgba(184,255,74,0.1)"
                              : "rgba(255,74,74,0.1)",
                          color: row.type === "Asset" ? "#B8FF4A" : "#FF4A4A",
                        }}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5" style={{ color: "#EAF0F6" }}>
                      {row.category}
                    </td>
                    <td
                      className="px-4 py-2.5 font-bold"
                      style={{
                        color: row.type === "Asset" ? "#B8FF4A" : "#FF4A4A",
                      }}
                    >
                      {formatINR(row.amount)}
                    </td>
                  </tr>
                ))}
                {previewRows.length > 10 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-center"
                      style={{ color: "#9AA6B2" }}
                    >
                      +{previewRows.length - 10} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {previewRows !== null && previewRows.length === 0 && (
        <div
          className="mt-4 text-xs text-center py-4"
          style={{ color: "#9AA6B2" }}
        >
          No valid rows found. Please check the file format.
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const uid = useId();
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const [entries, setEntries] = useState<Entry[]>([
    { id: "s1", type: "Asset", category: "Equity", amount: 300000 },
    { id: "s2", type: "Asset", category: "Mutual Funds", amount: 200000 },
    { id: "s3", type: "Asset", category: "Cash", amount: 80000 },
    { id: "s4", type: "Asset", category: "Gold", amount: 120000 },
    { id: "s5", type: "Liability", category: "Debt", amount: 150000 },
  ]);

  const [form, setForm] = useState<{
    type: EntryType;
    category: Category;
    amount: string;
  }>({
    type: "Asset",
    category: "Equity",
    amount: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [toolsSubTab, setToolsSubTab] = useState("stress-test");
  const [history, setHistory] = useState<NetWorthSnapshot[]>(() =>
    loadHistory(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [riskAppetite, setRiskAppetite] = useState<
    "Low" | "Medium" | "High" | null
  >(null);
  const [investmentHorizon, setInvestmentHorizon] = useState<
    "Short" | "Medium" | "Long" | null
  >(null);
  const portfolioLoadedRef = useRef(false);

  // Load portfolio from backend on login
  useEffect(() => {
    if (identity && actor && !actorFetching && !portfolioLoadedRef.current) {
      portfolioLoadedRef.current = true;
      actor
        .getPortfolio()
        .then((data) => {
          try {
            const parsed = JSON.parse(data) as Entry[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setEntries(parsed);
              toast.success("Portfolio loaded from your account!");
            }
          } catch {
            // invalid JSON — start fresh
          }
        })
        .catch(() => {
          // no portfolio yet — keep defaults
        });
    }
  }, [identity, actor, actorFetching]);

  // Reset load flag on logout
  useEffect(() => {
    if (!identity) {
      portfolioLoadedRef.current = false;
    }
  }, [identity]);

  const savePortfolio = async () => {
    if (!actor || !identity) {
      toast.error("Please sign in to save your portfolio");
      return;
    }
    setIsSaving(true);
    try {
      await actor.savePortfolio(JSON.stringify(entries));
      toast.success("Portfolio saved!");
    } catch {
      toast.error("Failed to save portfolio. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Derived values
  const totalAssets = entries
    .filter((e) => e.type === "Asset")
    .reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const scoreBreakdown = computeScoreBreakdown(entries);
  const score = scoreBreakdown.total;
  const insights = computeInsights(entries);
  const actions = computeActions(entries);

  const getCatAmt = (cat: Category) =>
    entries
      .filter((e) => e.type === "Asset" && e.category === cat)
      .reduce((s, e) => s + e.amount, 0);

  const equityPct =
    totalAssets > 0 ? (getCatAmt("Equity") / totalAssets) * 100 : 0;
  const debtPct = totalAssets > 0 ? (getCatAmt("Debt") / totalAssets) * 100 : 0;
  const cashPct = totalAssets > 0 ? (getCatAmt("Cash") / totalAssets) * 100 : 0;
  const goldPct = totalAssets > 0 ? (getCatAmt("Gold") / totalAssets) * 100 : 0;
  const mfPct =
    totalAssets > 0 ? (getCatAmt("Mutual Funds") / totalAssets) * 100 : 0;
  const liabToAsset = totalAssets > 0 ? totalLiabilities / totalAssets : 0;

  // Risk/liquidity labels
  const riskLevel =
    equityPct > 75 ? "High" : equityPct >= 40 ? "Medium" : "Low";
  const riskPositive: boolean | null =
    equityPct <= 40 ? true : equityPct <= 75 ? null : false;
  const liquidityStatus = cashPct > 15 ? "Strong" : "Weak";
  const liquidityPositive = cashPct > 15;
  const healthLabel =
    score >= 80 ? "Strong" : score >= 50 ? "Moderate" : "Weak";
  const healthPositive: boolean | null =
    score >= 80 ? true : score >= 50 ? null : false;

  const pieData = CATEGORIES.map((cat) => ({
    name: cat,
    value: getCatAmt(cat),
  })).filter((d) => d.value > 0);

  const addEntry = () => {
    const amt = Number.parseFloat(form.amount);
    if (!amt || Number.isNaN(amt) || amt <= 0) return;
    if (editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, type: form.type, category: form.category, amount: amt }
            : e,
        ),
      );
      setEditingId(null);
    } else {
      setEntries((prev) => [
        ...prev,
        {
          id: `${uid}-${Date.now()}`,
          type: form.type,
          category: form.category,
          amount: amt,
        },
      ]);
    }
    setForm((prev) => ({ ...prev, amount: "" }));
    setAnalyzed(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ type: "Asset", category: "Equity", amount: "" });
  };

  const startEdit = (entry: Entry) => {
    setEditingId(entry.id);
    setForm({
      type: entry.type,
      category: entry.category,
      amount: String(entry.amount),
    });
  };

  const deleteEntry = (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setAnalyzed(false);
  };

  const handleImportRows = (rows: ParsedRow[]) => {
    const newEntries: Entry[] = rows.map((r, i) => ({
      id: `upload-${Date.now()}-${i}`,
      type: r.type,
      category: r.category,
      amount: r.amount,
    }));
    setEntries(newEntries);
    setAnalyzed(false);
  };

  const handleAnalyze = () => {
    if (entries.length === 0) return;
    setIsAnalyzing(true);
    const newHistory = pushSnapshot(netWorth);
    setHistory(newHistory);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
      setActiveTab("analysis");
    }, 1200);
  };

  const scoreItems = [
    {
      label: "Diversification",
      score: scoreBreakdown.diversification,
      maxScore: 25,
    },
    { label: "Debt Ratio", score: scoreBreakdown.debtRatio, maxScore: 25 },
    {
      label: "Emergency Fund",
      score: scoreBreakdown.emergencyFund,
      maxScore: 25,
    },
    {
      label: "Asset Allocation",
      score: scoreBreakdown.allocation,
      maxScore: 25,
    },
  ];

  const trendData = history.map((h) => ({
    date: new Date(h.timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
    }),
    netWorth: h.netWorth,
  }));

  const trendGrowth =
    history.length >= 2
      ? (
          ((history[history.length - 1].netWorth - history[0].netWorth) /
            Math.abs(history[0].netWorth || 1)) *
          100
        ).toFixed(1)
      : null;

  // Loading / initializing
  if (isInitializing) {
    return (
      <div
        className="neon-bg min-h-screen flex items-center justify-center"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={40}
            className="animate-spin"
            style={{ color: "#B8FF4A" }}
          />
          <p className="text-sm" style={{ color: "#9AA6B2" }}>
            Loading FinPulse...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginScreen login={login} isLoggingIn={isLoggingIn} />
        <Toaster />
      </>
    );
  }

  const principal = identity.getPrincipal().toString();
  const shortPrincipal = `${principal.slice(0, 5)}...${principal.slice(-4)}`;

  return (
    <div
      className="neon-bg min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <Toaster />

      {/* Header */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(6,10,16,0.9)",
          borderBottom: "1px solid #24303A",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap
              size={22}
              style={{
                color: "#B8FF4A",
                filter: "drop-shadow(0 0 6px #B8FF4A80)",
              }}
            />
            <span className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
              FinPulse
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="hidden sm:block text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(184,255,74,0.1)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.2)",
              }}
            >
              {shortPrincipal}
            </span>

            <button
              type="button"
              data-ocid="portfolio.save_button"
              onClick={savePortfolio}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: "rgba(184,255,74,0.12)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.25)",
              }}
            >
              {isSaving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              data-ocid="auth.button"
              onClick={clear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: "rgba(255,74,74,0.1)",
                color: "#FF4A4A",
                border: "1px solid rgba(255,74,74,0.2)",
              }}
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <p className="text-sm mb-2" style={{ color: "#9AA6B2" }}>
            Today's{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
          >
            Financial{" "}
            <span
              style={{
                color: "#B8FF4A",
                textShadow: "0 0 20px rgba(184,255,74,0.4)",
              }}
            >
              Intelligence
            </span>{" "}
            Dashboard
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "#9AA6B2" }}>
            Upload your portfolio, add entries, then click Analyze for
            AI-powered insights.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="w-full mb-6"
            style={{
              background: "#0F141B",
              border: "1px solid #24303A",
              borderRadius: 14,
              height: 48,
            }}
          >
            <TabsTrigger
              value="portfolio"
              data-ocid="portfolio.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              data-ocid="analysis.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              Analysis
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              data-ocid="trends.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              Trends
            </TabsTrigger>
            <TabsTrigger
              value="investor-protection"
              data-ocid="investor_protection.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              <Shield size={13} className="inline mr-1" />
              Investor Protection
            </TabsTrigger>
            <TabsTrigger
              value="sip-calculator"
              data-ocid="sip_calculator.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              SIP Calculator
            </TabsTrigger>
            <TabsTrigger
              value="kyc-checklist"
              data-ocid="kyc_checklist.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              KYC Checklist
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              data-ocid="tools.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              Tools
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              data-ocid="reports.tab"
              className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
              style={{ borderRadius: 10, fontSize: 14 }}
            >
              DNA Report
            </TabsTrigger>
          </TabsList>

          {/* ── PORTFOLIO TAB ── */}
          <TabsContent value="portfolio">
            {/* Upload Section */}
            <UploadSection onImport={handleImportRows} />

            {/* Manual Entry */}
            <section className="fintech-card p-6 mb-6">
              <h2
                className="text-base font-bold mb-5 flex items-center gap-2"
                style={{ color: "#EAF0F6" }}
              >
                <Plus size={18} style={{ color: "#B8FF4A" }} />
                Add Portfolio Entry
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="entry-type"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "#9AA6B2" }}
                  >
                    Type
                  </label>
                  <select
                    id="entry-type"
                    data-ocid="entry.select"
                    className="dark-input"
                    value={form.type}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        type: e.target.value as EntryType,
                      }))
                    }
                  >
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="entry-category"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "#9AA6B2" }}
                  >
                    Category
                  </label>
                  <select
                    id="entry-category"
                    data-ocid="entry.select"
                    className="dark-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        category: e.target.value as Category,
                      }))
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="entry-amount"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "#9AA6B2" }}
                  >
                    Amount (₹)
                  </label>
                  <input
                    id="entry-amount"
                    data-ocid="entry.input"
                    type="number"
                    placeholder="Enter amount..."
                    className="dark-input"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, amount: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && addEntry()}
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  data-ocid="entry.primary_button"
                  className="neon-btn flex items-center gap-2"
                  onClick={addEntry}
                >
                  {editingId ? <Pencil size={16} /> : <Plus size={16} />}
                  {editingId ? "Update Entry" : "Add Entry"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    data-ocid="entry.cancel_button"
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                    style={{
                      background: "rgba(255,74,74,0.1)",
                      color: "#FF4A4A",
                      border: "1px solid rgba(255,74,74,0.2)",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {entries.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#9AA6B2" }}
                    >
                      Portfolio Entries ({entries.length})
                    </h3>
                    <button
                      type="button"
                      data-ocid="entry.delete_button"
                      onClick={() => {
                        setEntries([]);
                        setAnalyzed(false);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{
                        color: "#FF4A4A",
                        background: "rgba(255,74,74,0.1)",
                        border: "1px solid rgba(255,74,74,0.2)",
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {entries.map((entry, idx) => (
                        <motion.div
                          key={entry.id}
                          data-ocid={`entry.item.${idx + 1}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10, height: 0 }}
                          className="flex items-center justify-between rounded-xl px-4 py-3"
                          style={{
                            background: "#0F141B",
                            border: "1px solid #24303A",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                background:
                                  entry.type === "Asset"
                                    ? "#B8FF4A"
                                    : "#FF4A4A",
                              }}
                            />
                            <div>
                              <span
                                className="text-sm font-medium"
                                style={{ color: "#EAF0F6" }}
                              >
                                {entry.category}
                              </span>
                              <span
                                className="ml-2 text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  background:
                                    entry.type === "Asset"
                                      ? "rgba(184,255,74,0.1)"
                                      : "rgba(255,74,74,0.1)",
                                  color:
                                    entry.type === "Asset"
                                      ? "#B8FF4A"
                                      : "#FF4A4A",
                                }}
                              >
                                {entry.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="font-bold text-sm"
                              style={{
                                color:
                                  entry.type === "Asset"
                                    ? "#B8FF4A"
                                    : "#FF4A4A",
                              }}
                            >
                              {formatINR(entry.amount)}
                            </span>
                            <button
                              type="button"
                              data-ocid={`entry.edit_button.${idx + 1}`}
                              onClick={() => startEdit(entry)}
                              aria-label={`Edit ${entry.category} entry`}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: "#4AB8FF" }}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`entry.delete_button.${idx + 1}`}
                              onClick={() => deleteEntry(entry.id)}
                              aria-label={`Delete ${entry.category} entry`}
                              className="p-1.5 rounded-lg transition-colors delete-btn"
                              style={{ color: "#9AA6B2" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  data-ocid="portfolio.primary_button"
                  className="neon-btn flex items-center gap-2 px-10 py-3 text-base"
                  onClick={handleAnalyze}
                  disabled={entries.length === 0 || isAnalyzing}
                  style={
                    entries.length === 0
                      ? { opacity: 0.4, cursor: "not-allowed" }
                      : {}
                  }
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp size={18} />
                      Analyze Portfolio
                    </>
                  )}
                </button>
              </div>
            </section>
          </TabsContent>

          {/* ── ANALYSIS TAB ── */}
          <TabsContent value="analysis">
            {!analyzed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fintech-card p-12 flex flex-col items-center justify-center gap-4 text-center"
                data-ocid="analysis.empty_state"
              >
                <BarChart3 size={48} style={{ color: "#24303A" }} />
                <p className="text-sm" style={{ color: "#9AA6B2" }}>
                  Go to Portfolio tab and click{" "}
                  <span style={{ color: "#B8FF4A" }}>Analyze Portfolio</span> to
                  see your results.
                </p>
              </motion.div>
            ) : !consentGiven ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fintech-card p-10 flex flex-col items-center justify-center gap-6 text-center"
                data-ocid="consent.section"
              >
                <Shield size={48} style={{ color: "#B8FF4A" }} />
                <div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "#EAF0F6" }}
                  >
                    Before viewing your analysis
                  </h3>
                  <p className="text-sm" style={{ color: "#9AA6B2" }}>
                    Please acknowledge the disclaimer below to proceed.
                  </p>
                </div>
                <label
                  className="flex items-center gap-3 cursor-pointer group"
                  data-ocid="consent.checkbox"
                >
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-5 h-5 accent-[#B8FF4A] cursor-pointer"
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#EAF0F6" }}
                  >
                    I understand this is{" "}
                    <span style={{ color: "#B8FF4A" }}>
                      not investment advice
                    </span>{" "}
                    and investments are subject to market risks.
                  </span>
                </label>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  data-ocid="dashboard.section"
                >
                  {/* Summary Cards Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <SummaryCard
                      icon={<Wallet size={16} />}
                      label="Total Assets"
                      value={formatINR(totalAssets)}
                      sub={`${entries.filter((e) => e.type === "Asset").length} entries`}
                      highlight="neon"
                    />
                    <SummaryCard
                      icon={<Scale size={16} />}
                      label="Total Liabilities"
                      value={formatINR(totalLiabilities)}
                      sub={`${entries.filter((e) => e.type === "Liability").length} entries`}
                      highlight="red"
                    />
                    <SummaryCard
                      icon={<BarChart3 size={16} />}
                      label="Net Worth"
                      value={formatINR(netWorth)}
                      sub={
                        netWorth >= 0
                          ? "Positive net worth"
                          : "Negative — focus on debt"
                      }
                      highlight={netWorth >= 0 ? "neon" : "red"}
                    />
                  </div>

                  {/* Advanced Metrics Row 2 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                      label="Equity %"
                      value={`${equityPct.toFixed(1)}%`}
                      color="#B8FF4A"
                    />
                    <MetricCard
                      label="Debt %"
                      value={`${debtPct.toFixed(1)}%`}
                      color="#4AB8FF"
                    />
                    <MetricCard
                      label="Cash %"
                      value={`${cashPct.toFixed(1)}%`}
                      color="#FFD74A"
                    />
                    <MetricCard
                      label="Gold %"
                      value={`${goldPct.toFixed(1)}%`}
                      color="#FF9A4A"
                    />
                    <MetricCard
                      label="Liability/Asset"
                      value={liabToAsset.toFixed(2)}
                      color={
                        liabToAsset > 0.6
                          ? "#FF4A4A"
                          : liabToAsset > 0.4
                            ? "#FFB84A"
                            : "#B8FF4A"
                      }
                    />
                    <MetricCard
                      label="Mutual Funds %"
                      value={`${mfPct.toFixed(1)}%`}
                      color="#C74AFF"
                    />
                  </div>

                  {/* Financial Summary */}
                  <div className="fintech-card p-6 mb-6">
                    <h2
                      className="text-sm font-bold mb-5 flex items-center gap-2"
                      style={{ color: "#EAF0F6" }}
                    >
                      <Info size={16} style={{ color: "#B8FF4A" }} />
                      Financial Summary
                    </h2>
                    <div className="grid grid-cols-3 gap-6">
                      <StatusBadge
                        label="Risk Level"
                        status={riskLevel}
                        positive={riskPositive}
                      />
                      <StatusBadge
                        label="Liquidity Status"
                        status={liquidityStatus}
                        positive={liquidityPositive}
                      />
                      <StatusBadge
                        label="Overall Health"
                        status={healthLabel}
                        positive={healthPositive}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Health Score + Pie */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="fintech-card p-6">
                    <h2
                      className="text-sm font-bold mb-4 flex items-center gap-2"
                      style={{ color: "#EAF0F6" }}
                    >
                      <Activity size={16} style={{ color: "#B8FF4A" }} />
                      Financial Health Score
                    </h2>
                    <HealthGauge score={score} />
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {scoreItems.map((item) => {
                        const pct = (item.score / item.maxScore) * 100;
                        return (
                          <div
                            key={item.label}
                            className="rounded-xl p-3"
                            style={{
                              background: "#0F141B",
                              border: "1px solid #24303A",
                            }}
                          >
                            <div
                              className="text-xs mb-1.5"
                              style={{ color: "#9AA6B2" }}
                            >
                              {item.label}
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="flex-1 h-1.5 rounded-full"
                                style={{ background: "#1F2A38" }}
                              >
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${pct}%`,
                                    background:
                                      pct >= 70
                                        ? "#B8FF4A"
                                        : pct >= 40
                                          ? "#FFB84A"
                                          : "#FF4A4A",
                                    transition: "width 1s ease",
                                  }}
                                />
                              </div>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#EAF0F6" }}
                              >
                                {item.score}/{item.maxScore}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="fintech-card p-6">
                    <h2
                      className="text-sm font-bold mb-4 flex items-center gap-2"
                      style={{ color: "#EAF0F6" }}
                    >
                      <BarChart3 size={16} style={{ color: "#B8FF4A" }} />
                      Asset Allocation
                    </h2>
                    {pieData.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {pieData.map((entry) => (
                                <Cell
                                  key={entry.name}
                                  fill={
                                    CATEGORY_COLORS[entry.name as Category] ||
                                    "#B8FF4A"
                                  }
                                  stroke="#0F141B"
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {pieData.map((d) => {
                            const pct = ((d.value / totalAssets) * 100).toFixed(
                              1,
                            );
                            return (
                              <div
                                key={d.name}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                  style={{
                                    background:
                                      CATEGORY_COLORS[d.name as Category],
                                  }}
                                />
                                <span style={{ color: "#9AA6B2" }}>
                                  {d.name}
                                </span>
                                <span
                                  className="font-bold ml-auto"
                                  style={{ color: "#EAF0F6" }}
                                >
                                  {pct}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div
                        className="flex items-center justify-center h-40"
                        style={{ color: "#9AA6B2", fontSize: 13 }}
                      >
                        No asset data to display
                      </div>
                    )}
                  </div>
                </div>

                {/* Insights + Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="fintech-card p-6">
                    <h2
                      className="text-sm font-bold mb-4 flex items-center gap-2"
                      style={{ color: "#EAF0F6" }}
                    >
                      <AlertTriangle size={16} style={{ color: "#B8FF4A" }} />
                      Smart Insights
                    </h2>
                    <div className="space-y-2">
                      {insights.map((ins, idx) => (
                        <motion.div
                          key={ins.message}
                          data-ocid={`insight.item.${idx + 1}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`insight-tile ${ins.severity}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="flex-shrink-0 mt-0.5">
                              {insightIcon(ins.severity)}
                            </span>
                            <span
                              className="text-sm"
                              style={{ color: "#EAF0F6", lineHeight: 1.5 }}
                            >
                              {ins.message}
                            </span>
                            <ChevronRight
                              size={14}
                              style={{
                                color: "#9AA6B2",
                                flexShrink: 0,
                                marginLeft: "auto",
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="fintech-card p-6">
                    <h2
                      className="text-sm font-bold mb-4 flex items-center gap-2"
                      style={{ color: "#EAF0F6" }}
                    >
                      <TrendingUp size={16} style={{ color: "#B8FF4A" }} />
                      Action Recommendations
                    </h2>
                    <div className="space-y-3">
                      {actions.map((action, idx) => (
                        <motion.div
                          key={action.message}
                          data-ocid={`action.item.${idx + 1}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.12 + 0.1 }}
                          className="rounded-xl p-4"
                          style={{
                            background: "#0F141B",
                            border: "1px solid #24303A",
                          }}
                        >
                          <div className="flex gap-3">
                            <div
                              className="w-1 rounded-full flex-shrink-0"
                              style={{
                                background:
                                  action.severity === "danger"
                                    ? "#FF4A4A"
                                    : action.severity === "warning"
                                      ? "#FFB84A"
                                      : action.severity === "info"
                                        ? "#4AB8FF"
                                        : "#B8FF4A",
                              }}
                            />
                            <p
                              className="text-sm"
                              style={{ color: "#9AA6B2", lineHeight: 1.6 }}
                            >
                              {action.message}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Portfolio Breakdown Bars */}
                <div className="fintech-card p-6 mb-6">
                  <h2
                    className="text-sm font-bold mb-4 flex items-center gap-2"
                    style={{ color: "#EAF0F6" }}
                  >
                    <BarChart3 size={16} style={{ color: "#B8FF4A" }} />
                    Portfolio Breakdown
                  </h2>
                  <div className="space-y-3">
                    {pieData.map((d) => {
                      const pct =
                        totalAssets > 0 ? (d.value / totalAssets) * 100 : 0;
                      return (
                        <div key={d.name}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span
                              className="font-medium"
                              style={{ color: "#EAF0F6" }}
                            >
                              {d.name}
                            </span>
                            <span
                              style={{
                                color: CATEGORY_COLORS[d.name as Category],
                              }}
                            >
                              {pct.toFixed(1)}% — {formatINR(d.value)}
                            </span>
                          </div>
                          <div
                            className="h-2 rounded-full"
                            style={{ background: "#1F2A38" }}
                          >
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: CATEGORY_COLORS[d.name as Category],
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.2,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ─── Peer Benchmarks ─── */}
                <div
                  className="fintech-card p-6 mt-6"
                  data-ocid="peer_benchmarks.section"
                >
                  <h3
                    className="text-sm font-bold mb-4 flex items-center gap-2"
                    style={{ color: "#EAF0F6" }}
                  >
                    <Activity size={16} style={{ color: "#B8FF4A" }} />
                    Peer Benchmarks
                    <span
                      className="text-xs font-normal ml-1"
                      style={{ color: "#9AA6B2" }}
                    >
                      vs FinHealth India users
                    </span>
                  </h3>
                  {(() => {
                    const assets = entries.filter((e) => e.type === "Asset");
                    const total = assets.reduce((s, e) => s + e.amount, 0);
                    const liabilities = entries
                      .filter((e) => e.type === "Liability")
                      .reduce((s, e) => s + e.amount, 0);
                    const cats = new Set(assets.map((e) => e.category)).size;
                    const netWorthVal = total - liabilities;

                    // Hardcoded percentile benchmarks
                    const divPercentile =
                      cats >= 5
                        ? 92
                        : cats >= 4
                          ? 78
                          : cats >= 3
                            ? 55
                            : cats >= 2
                              ? 35
                              : 15;
                    const scorePercentile =
                      score >= 75
                        ? 88
                        : score >= 60
                          ? 65
                          : score >= 45
                            ? 42
                            : 22;
                    const nwPercentile =
                      netWorthVal >= 5000000
                        ? 85
                        : netWorthVal >= 2000000
                          ? 68
                          : netWorthVal >= 500000
                            ? 45
                            : netWorthVal >= 100000
                              ? 28
                              : 12;

                    const getBadgeColor = (pct: number) =>
                      pct >= 75 ? "#B8FF4A" : pct >= 50 ? "#FFD74A" : "#FF4A4A";
                    const getLabel = (pct: number) =>
                      pct >= 75
                        ? `Top ${100 - pct}%`
                        : pct >= 50
                          ? "Above Average"
                          : "Room to Grow";

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          {
                            label: "Diversification",
                            pct: divPercentile,
                            detail: `${cats} asset classes`,
                          },
                          {
                            label: "Health Score",
                            pct: scorePercentile,
                            detail: `${score}/100`,
                          },
                          {
                            label: "Net Worth",
                            pct: nwPercentile,
                            detail: formatINR(netWorthVal),
                          },
                        ].map((b) => (
                          <div
                            key={b.label}
                            className="p-4 rounded-xl flex items-center gap-3"
                            style={{
                              background: "#0F141B",
                              border: "1px solid #24303A",
                            }}
                          >
                            <div
                              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                              style={{
                                background: `${getBadgeColor(b.pct)}22`,
                                color: getBadgeColor(b.pct),
                                border: `1.5px solid ${getBadgeColor(b.pct)}55`,
                              }}
                            >
                              {b.pct}%
                            </div>
                            <div>
                              <div
                                className="text-xs font-semibold"
                                style={{ color: "#EAF0F6" }}
                              >
                                {b.label}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: getBadgeColor(b.pct) }}
                              >
                                {getLabel(b.pct)}
                              </div>
                              <div
                                className="text-xs mt-0.5"
                                style={{ color: "#9AA6B2" }}
                              >
                                {b.detail}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  <p className="text-xs mt-3" style={{ color: "#9AA6B2" }}>
                    * Based on anonymized FinHealth India user data (percentile
                    rankings)
                  </p>
                </div>
              </AnimatePresence>
            )}
          </TabsContent>

          {/* ── TRENDS TAB ── */}
          <TabsContent value="trends">
            <div className="fintech-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-base font-bold flex items-center gap-2"
                  style={{ color: "#EAF0F6" }}
                >
                  <TrendingUp size={18} style={{ color: "#B8FF4A" }} />
                  Net Worth Trend
                </h2>
                {trendGrowth !== null && (
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{
                      background:
                        Number(trendGrowth) >= 0
                          ? "rgba(184,255,74,0.1)"
                          : "rgba(255,74,74,0.1)",
                      color: Number(trendGrowth) >= 0 ? "#B8FF4A" : "#FF4A4A",
                      border: `1px solid ${Number(trendGrowth) >= 0 ? "rgba(184,255,74,0.3)" : "rgba(255,74,74,0.3)"}`,
                    }}
                  >
                    {Number(trendGrowth) >= 0 ? "+" : ""}
                    {trendGrowth}% overall
                  </span>
                )}
              </div>

              {trendData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#1A2230" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9AA6B2", fontSize: 11 }}
                      axisLine={{ stroke: "#24303A" }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) => formatINR(v)}
                      tick={{ fill: "#9AA6B2", fontSize: 11 }}
                      axisLine={{ stroke: "#24303A" }}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip content={<TrendTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#B8FF4A"
                      strokeWidth={2.5}
                      dot={{ fill: "#B8FF4A", r: 4, strokeWidth: 0 }}
                      activeDot={{ fill: "#B8FF4A", r: 6, strokeWidth: 0 }}
                      style={{
                        filter: "drop-shadow(0 0 6px rgba(184,255,74,0.5))",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-3 py-16"
                  data-ocid="trends.empty_state"
                >
                  <TrendingUp size={40} style={{ color: "#24303A" }} />
                  <p
                    className="text-sm text-center"
                    style={{ color: "#9AA6B2" }}
                  >
                    No trend data yet.{" "}
                    <span style={{ color: "#B8FF4A" }}>
                      Analyze your portfolio
                    </span>{" "}
                    at least twice to see the net worth trend.
                  </p>
                  <p className="text-xs" style={{ color: "#9AA6B2" }}>
                    Current net worth:{" "}
                    <span
                      style={{
                        color: netWorth >= 0 ? "#B8FF4A" : "#FF4A4A",
                        fontWeight: 700,
                      }}
                    >
                      {formatINR(netWorth)}
                    </span>
                  </p>
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-6">
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "#9AA6B2" }}
                  >
                    History ({history.length} snapshots)
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[...history].reverse().map((h, i) => (
                      <div
                        key={h.timestamp}
                        data-ocid={`trends.item.${i + 1}`}
                        className="flex items-center justify-between text-xs px-3 py-2 rounded-lg"
                        style={{
                          background: "#0F141B",
                          border: "1px solid #24303A",
                        }}
                      >
                        <span style={{ color: "#9AA6B2" }}>
                          {new Date(h.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span
                          className="font-bold"
                          style={{
                            color: h.netWorth >= 0 ? "#B8FF4A" : "#FF4A4A",
                          }}
                        >
                          {formatINR(h.netWorth)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── INVESTOR PROTECTION TAB ── */}
            <TabsContent value="investor-protection">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
                data-ocid="investor_protection.section"
              >
                {/* Disclaimer Banner */}
                <div
                  className="rounded-xl p-5 flex gap-4 items-start"
                  style={{
                    background: "rgba(255,190,11,0.1)",
                    border: "1px solid rgba(255,190,11,0.35)",
                  }}
                  data-ocid="disclaimer.panel"
                >
                  <AlertTriangle
                    size={22}
                    style={{ color: "#FFBE0B", flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "#FFBE0B" }}
                    >
                      SEBI Disclaimer
                    </p>
                    <p className="text-sm mb-1" style={{ color: "#EAF0F6" }}>
                      This app provides educational insights only and not
                      investment advice.
                    </p>
                    <p className="text-sm" style={{ color: "#9AA6B2" }}>
                      Investments are subject to market risks. Please read all
                      scheme related documents carefully.
                    </p>
                  </div>
                </div>

                {/* Risk Awareness Module */}
                <div className="fintech-card p-6">
                  <h3
                    className="text-base font-bold mb-4 flex items-center gap-2"
                    style={{ color: "#EAF0F6" }}
                  >
                    <AlertTriangle size={17} style={{ color: "#B8FF4A" }} />
                    Risk Awareness Module
                  </h3>
                  {entries.length === 0 ? (
                    <p className="text-sm" style={{ color: "#9AA6B2" }}>
                      Add portfolio entries to see risk awareness signals.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {equityPct > 60 && (
                        <span
                          className="px-3 py-2 rounded-lg text-sm font-semibold"
                          style={{
                            background: "rgba(255,120,0,0.15)",
                            color: "#FF7800",
                            border: "1px solid rgba(255,120,0,0.35)",
                          }}
                        >
                          ⚠ High Volatility Risk — Equity {equityPct.toFixed(0)}
                          %
                        </span>
                      )}
                      {(totalAssets > 0
                        ? (entries
                            .filter(
                              (e) =>
                                e.type === "Asset" && e.category === "Debt",
                            )
                            .reduce((s, e) => s + e.amount, 0) /
                            totalAssets) *
                          100
                        : 0) > 50 && (
                        <span
                          className="px-3 py-2 rounded-lg text-sm font-semibold"
                          style={{
                            background: "rgba(56,140,255,0.15)",
                            color: "#388CFF",
                            border: "1px solid rgba(56,140,255,0.35)",
                          }}
                        >
                          ⚠ Interest Rate Risk — High Debt Allocation
                        </span>
                      )}
                      {new Set(
                        entries
                          .filter((e) => e.type === "Asset")
                          .map((e) => e.category),
                      ).size < 3 && (
                        <span
                          className="px-3 py-2 rounded-lg text-sm font-semibold"
                          style={{
                            background: "rgba(255,60,60,0.15)",
                            color: "#FF4B4B",
                            border: "1px solid rgba(255,60,60,0.35)",
                          }}
                        >
                          ⚠ Concentration Risk — Low Diversification
                        </span>
                      )}
                      {equityPct <= 60 &&
                        (totalAssets > 0
                          ? (entries
                              .filter(
                                (e) =>
                                  e.type === "Asset" && e.category === "Debt",
                              )
                              .reduce((s, e) => s + e.amount, 0) /
                              totalAssets) *
                            100
                          : 0) <= 50 &&
                        new Set(
                          entries
                            .filter((e) => e.type === "Asset")
                            .map((e) => e.category),
                        ).size >= 3 && (
                          <span
                            className="px-3 py-2 rounded-lg text-sm font-semibold"
                            style={{
                              background: "rgba(184,255,74,0.1)",
                              color: "#B8FF4A",
                              border: "1px solid rgba(184,255,74,0.3)",
                            }}
                          >
                            ✓ Risk profile looks balanced
                          </span>
                        )}
                    </div>
                  )}
                </div>

                {/* Suitability Check */}
                <div className="fintech-card p-6">
                  <h3
                    className="text-base font-bold mb-5 flex items-center gap-2"
                    style={{ color: "#EAF0F6" }}
                  >
                    <CheckCircle size={17} style={{ color: "#B8FF4A" }} />
                    Suitability Check
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <p
                        className="text-xs font-semibold mb-3 uppercase tracking-wide"
                        style={{ color: "#9AA6B2" }}
                      >
                        Risk Appetite
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {(["Low", "Medium", "High"] as const).map((v) => (
                          <button
                            type="button"
                            key={v}
                            onClick={() => setRiskAppetite(v)}
                            data-ocid={`suitability.risk_${v.toLowerCase()}.button`}
                            className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                            style={{
                              background:
                                riskAppetite === v
                                  ? "#B8FF4A"
                                  : "rgba(255,255,255,0.05)",
                              color: riskAppetite === v ? "#060A10" : "#9AA6B2",
                              border: `1px solid ${riskAppetite === v ? "#B8FF4A" : "#24303A"}`,
                            }}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold mb-3 uppercase tracking-wide"
                        style={{ color: "#9AA6B2" }}
                      >
                        Investment Horizon
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {(
                          [
                            ["Short", "< 3 yrs"],
                            ["Medium", "3–7 yrs"],
                            ["Long", "> 7 yrs"],
                          ] as const
                        ).map(([v, label]) => (
                          <button
                            type="button"
                            key={v}
                            onClick={() => setInvestmentHorizon(v)}
                            data-ocid={`suitability.horizon_${v.toLowerCase()}.button`}
                            className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                            style={{
                              background:
                                investmentHorizon === v
                                  ? "#B8FF4A"
                                  : "rgba(255,255,255,0.05)",
                              color:
                                investmentHorizon === v ? "#060A10" : "#9AA6B2",
                              border: `1px solid ${investmentHorizon === v ? "#B8FF4A" : "#24303A"}`,
                            }}
                          >
                            {v}{" "}
                            <span className="opacity-70 text-xs">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mismatch Alert */}
                    {entries.length > 0 &&
                      riskAppetite &&
                      investmentHorizon &&
                      (() => {
                        const portfolioRisk =
                          equityPct > 60
                            ? "High"
                            : equityPct > 30
                              ? "Medium"
                              : "Low";
                        const riskMismatch =
                          (riskAppetite === "Low" &&
                            (portfolioRisk === "High" ||
                              portfolioRisk === "Medium")) ||
                          (riskAppetite === "Medium" &&
                            portfolioRisk === "High");
                        const horizonMismatch =
                          equityPct > 60 && investmentHorizon === "Short";
                        const hasMismatch = riskMismatch || horizonMismatch;
                        return (
                          <div
                            className="mt-4 p-4 rounded-xl text-sm font-semibold flex gap-3 items-start"
                            style={{
                              background: hasMismatch
                                ? "rgba(255,60,60,0.1)"
                                : "rgba(184,255,74,0.08)",
                              border: `1px solid ${hasMismatch ? "rgba(255,60,60,0.35)" : "rgba(184,255,74,0.3)"}`,
                              color: hasMismatch ? "#FF4B4B" : "#B8FF4A",
                            }}
                            data-ocid="suitability.alert.panel"
                          >
                            {hasMismatch ? (
                              <AlertTriangle
                                size={16}
                                style={{ flexShrink: 0, marginTop: 2 }}
                              />
                            ) : (
                              <CheckCircle
                                size={16}
                                style={{ flexShrink: 0, marginTop: 2 }}
                              />
                            )}
                            {hasMismatch
                              ? "⚠ Your allocation may not match your risk profile. Consider rebalancing your portfolio."
                              : "✓ Your portfolio aligns with your risk profile."}
                          </div>
                        );
                      })()}
                  </div>
                </div>

                {/* Fraud Awareness Tips */}
                <div className="fintech-card p-6">
                  <h3
                    className="text-base font-bold mb-4 flex items-center gap-2"
                    style={{ color: "#EAF0F6" }}
                  >
                    <Info size={17} style={{ color: "#B8FF4A" }} />
                    Fraud Awareness Tips
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(255,60,60,0.07)",
                        border: "1px solid rgba(255,60,60,0.2)",
                      }}
                      data-ocid="fraud.tip.1"
                    >
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "#FF4B4B" }}
                      >
                        🚫 Avoid Guaranteed Return Schemes
                      </p>
                      <p className="text-sm" style={{ color: "#9AA6B2" }}>
                        No SEBI-registered product can guarantee fixed returns.
                        Be wary of schemes promising assured profits.
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(184,255,74,0.07)",
                        border: "1px solid rgba(184,255,74,0.2)",
                      }}
                      data-ocid="fraud.tip.2"
                    >
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "#B8FF4A" }}
                      >
                        ✅ Verify SEBI Registration
                      </p>
                      <p className="text-sm" style={{ color: "#9AA6B2" }}>
                        Always check the SEBI registration of your advisor or
                        investment product at{" "}
                        <a
                          href="https://sebi.gov.in"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#B8FF4A",
                            textDecoration: "underline",
                          }}
                        >
                          sebi.gov.in
                        </a>{" "}
                        before investing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transparency Section */}
                <div className="fintech-card p-6">
                  <h3
                    className="text-base font-bold mb-4 flex items-center gap-2"
                    style={{ color: "#EAF0F6" }}
                  >
                    <BarChart3 size={17} style={{ color: "#B8FF4A" }} />
                    Portfolio Transparency
                  </h3>
                  {entries.length === 0 ? (
                    <p className="text-sm" style={{ color: "#9AA6B2" }}>
                      Add portfolio entries to view your asset allocation and
                      risk level.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            background:
                              equityPct > 60
                                ? "rgba(255,60,60,0.15)"
                                : equityPct > 30
                                  ? "rgba(255,190,11,0.15)"
                                  : "rgba(184,255,74,0.1)",
                            color:
                              equityPct > 60
                                ? "#FF4B4B"
                                : equityPct > 30
                                  ? "#FFBE0B"
                                  : "#B8FF4A",
                            border: `1px solid ${equityPct > 60 ? "rgba(255,60,60,0.35)" : equityPct > 30 ? "rgba(255,190,11,0.35)" : "rgba(184,255,74,0.3)"}`,
                          }}
                        >
                          Risk Level:{" "}
                          {equityPct > 60
                            ? "High"
                            : equityPct > 30
                              ? "Medium"
                              : "Low"}
                        </span>
                      </div>
                      {(
                        [
                          "Equity",
                          "Mutual Funds",
                          "Debt",
                          "Cash",
                          "Gold",
                        ] as const
                      ).map((cat) => {
                        const amt = entries
                          .filter(
                            (e) => e.type === "Asset" && e.category === cat,
                          )
                          .reduce((s, e) => s + e.amount, 0);
                        const pct =
                          totalAssets > 0 ? (amt / totalAssets) * 100 : 0;
                        if (pct === 0) return null;
                        return (
                          <div key={cat}>
                            <div
                              className="flex justify-between text-xs mb-1"
                              style={{ color: "#9AA6B2" }}
                            >
                              <span>{cat}</span>
                              <span style={{ color: "#B8FF4A" }}>
                                {pct.toFixed(1)}%
                              </span>
                            </div>
                            <div
                              className="w-full rounded-full h-2"
                              style={{ background: "#1A2530" }}
                            >
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  background: "#B8FF4A",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </TabsContent>

          {/* ── SIP CALCULATOR TAB ── */}
          <SipCalculatorTab />

          {/* ── KYC CHECKLIST TAB ── */}
          <KycChecklistTab />
          {/* -- TOOLS TAB -- */}
          <TabsContent value="tools">
            <div className="mb-4 flex flex-wrap gap-2" data-ocid="tools.panel">
              {[
                { id: "stress-test", label: "Stress Test" },
                { id: "inflation", label: "Inflation" },
                { id: "rebalancing", label: "Rebalance" },
                { id: "tax", label: "Tax Optimizer" },
                { id: "lifestage", label: "Life Stage" },
                { id: "gold-sgb", label: "Gold vs SGB" },
                { id: "investment", label: "Investment Calc" },
                { id: "loan", label: "Loan Prepayment" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setToolsSubTab(t.id)}
                  data-ocid={`tools.${t.id}.tab`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: toolsSubTab === t.id ? "#B8FF4A" : "#0F141B",
                    color: toolsSubTab === t.id ? "#060A10" : "#9AA6B2",
                    border: `1px solid ${toolsSubTab === t.id ? "#B8FF4A" : "#24303A"}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {toolsSubTab === "stress-test" && (
              <StressTestTab entries={entries} />
            )}
            {toolsSubTab === "inflation" && (
              <InflationTrackerTab entries={entries} />
            )}
            {toolsSubTab === "rebalancing" && (
              <RebalancingSimulatorTab entries={entries} />
            )}
            {toolsSubTab === "tax" && <TaxOptimizerTab entries={entries} />}
            {toolsSubTab === "lifestage" && (
              <LifeStageRoadmapTab entries={entries} />
            )}
            {toolsSubTab === "gold-sgb" && <GoldSgbTab entries={entries} />}
            {toolsSubTab === "investment" && (
              <InvestmentCalculatorTab entries={entries} />
            )}
            {toolsSubTab === "loan" && <LoanPrepaymentTab entries={entries} />}
          </TabsContent>

          {/* -- DNA REPORT TAB -- */}
          <TabsContent value="reports">
            <DnaReportTab entries={entries} healthScore={score} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #24303A",
          padding: "24px 0",
          marginTop: "auto",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
            style={{ color: "#9AA6B2" }}
          >
            <div className="flex gap-4">
              <span>Support</span>
              <span>Privacy</span>
              <span>Legal</span>
            </div>
            <p>
              © {new Date().getFullYear()}. Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#B8FF4A" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
