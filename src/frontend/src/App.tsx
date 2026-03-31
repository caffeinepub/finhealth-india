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
  Share2,
  Shield,
  Sparkles,
  Trash2,
  TrendingUp,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
// papaparse loaded via CDN
declare const Papa: typeof import("papaparse").default;
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
// xlsx loaded via CDN
declare const XLSX: typeof import("xlsx");
import AdvisoryPage from "./components/AdvisoryPage";
import BackButton from "./components/BackButton";
import CardAnalysisTab from "./components/CardAnalysisTab";
import type { Transaction } from "./components/CardAnalysisTab";
import ClientChatBox from "./components/ClientChatBox";
import ContactModal from "./components/ContactModal";
import DashboardInsights from "./components/DashboardInsights";
import DnaReportTab from "./components/DnaReportTab";
import FinancialAIPage from "./components/FinancialAIPage";
import FinancialIntelligencePanel from "./components/FinancialIntelligencePanel";
import GlobalNav from "./components/GlobalNav";
import GoalPlannerTab from "./components/GoalPlannerTab";
import GoldSgbTab from "./components/GoldSgbTab";
import InflationTrackerTab from "./components/InflationTrackerTab";
import InfoModal from "./components/InfoModal";
import InvestmentCalculatorTab from "./components/InvestmentCalculatorTab";
import KycChecklistTab from "./components/KycChecklistTab";
import LandingPage from "./components/LandingPage";
import LifeStageRoadmapTab from "./components/LifeStageRoadmapTab";
import LoanPrepaymentTab from "./components/LoanPrepaymentTab";
import MyAccountPage from "./components/MyAccountPage";
import OnboardingWizard from "./components/OnboardingWizard";
import PolicyAnalyzerTab from "./components/PolicyAnalyzerTab";
import RebalancingSimulatorTab from "./components/RebalancingSimulatorTab";
import ReferralCard from "./components/ReferralCard";
import RiskProfileTab from "./components/RiskProfileTab";
import SipCalculatorTab from "./components/SipCalculatorTab";
import SitemapModal from "./components/SitemapModal";
import StressTestTab from "./components/StressTestTab";
import TaxOptimizerTab from "./components/TaxOptimizerTab";
import UlipVsSipTab from "./components/UlipVsSipTab";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserTracking } from "./hooks/useUserTracking";

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

  insights.push({
    message: `Net Worth: ${formatINR(netWorth)} (Assets: ${formatINR(totalAssets)}, Liabilities: ${formatINR(totalLiabilities)})`,
    severity: netWorth >= 0 ? "success" : "danger",
  });

  if (equityAmt > 0) {
    if (equityPct > 75) {
      insights.push({
        message: `Equity is ${equityPct.toFixed(1)}% (${formatINR(equityAmt)}) — above recommended 60–70%, indicating high risk`,
        severity: "warning",
      });
    } else if (equityPct < 40) {
      insights.push({
        message: `Equity is only ${equityPct.toFixed(1)}% (${formatINR(equityAmt)}) — below recommended 40% minimum, limiting growth`,
        severity: "info",
      });
    } else {
      insights.push({
        message: `Equity is ${equityPct.toFixed(1)}% (${formatINR(equityAmt)}) — within the healthy 40–70% range ✓`,
        severity: "success",
      });
    }
  } else {
    insights.push({
      message:
        "No equity holdings — consider adding equity for long-term growth",
      severity: "info",
    });
  }

  if (cashPct > 30) {
    insights.push({
      message: `Cash is ${cashPct.toFixed(1)}% (${formatINR(cashAmt)}) — too idle; loses ${formatINR(cashAmt * 0.06)}/year to inflation at 6%`,
      severity: "warning",
    });
  } else if (cashPct < 5) {
    insights.push({
      message: `Cash is only ${cashPct.toFixed(1)}% (${formatINR(cashAmt)}) — insufficient emergency fund; aim for at least 10%`,
      severity: "danger",
    });
  } else if (cashPct >= 10 && cashPct <= 20) {
    insights.push({
      message: `Cash/Emergency fund is ${cashPct.toFixed(1)}% (${formatINR(cashAmt)}) — ideal 10–20% range ✓`,
      severity: "success",
    });
  } else {
    insights.push({
      message: `Cash is ${cashPct.toFixed(1)}% — slightly outside ideal 10–20% range`,
      severity: "info",
    });
  }

  if (liabRatioPct > 60) {
    insights.push({
      message: `Debt-to-asset ratio is ${liabRatioPct.toFixed(1)}% (${formatINR(totalLiabilities)}) — critical; safe threshold < 30%`,
      severity: "danger",
    });
  } else if (liabRatioPct > 40) {
    insights.push({
      message: `Debt-to-asset ratio is ${liabRatioPct.toFixed(1)}% — above 40% safe threshold; reduce liabilities`,
      severity: "warning",
    });
  } else if (liabRatioPct > 0) {
    insights.push({
      message: `Debt-to-asset ratio is ${liabRatioPct.toFixed(1)}% — within safe range (< 40%) ✓`,
      severity: "success",
    });
  }

  if (goldAmt > 0)
    insights.push({
      message: `Gold is ${goldPct.toFixed(1)}% (${formatINR(goldAmt)}) — good inflation hedge`,
      severity: "info",
    });

  if (mfAmt > 0)
    insights.push({
      message: `Mutual Funds is ${mfPct.toFixed(1)}% (${formatINR(mfAmt)}) — well-suited for systematic investing`,
      severity: "info",
    });

  if (distinctCats < 3) {
    insights.push({
      message: `Only ${distinctCats} asset ${distinctCats === 1 ? "category" : "categories"} — poor diversification; aim for 3+ categories`,
      severity: "warning",
    });
  } else {
    insights.push({
      message: `Portfolio spans ${distinctCats} asset categories — good diversification ✓`,
      severity: "success",
    });
  }

  if (cashAmt > 0 && cashPct <= 30) {
    insights.push({
      message: `Cash ₹${formatINR(cashAmt)} loses ~${formatINR(cashAmt * 0.06)}/year to inflation at 6%`,
      severity: cashPct > 20 ? "warning" : "info",
    });
  }

  // Enhanced insights
  if (cashPct > 25 && totalAssets > 0) {
    insights.push({
      message: `₹${formatINR(cashAmt)} idle in cash losing ${formatINR(cashAmt * 0.06)}/year to inflation — consider deploying into SIP or debt funds`,
      severity: "warning",
    });
  }

  const eqMfPct =
    ((getCatAmt("Equity") + getCatAmt("Mutual Funds")) / (totalAssets || 1)) *
    100;
  if (eqMfPct > 75) {
    insights.push({
      message: `Growth assets (Equity+MF) at ${eqMfPct.toFixed(0)}% — consider partial shift to debt for stability`,
      severity: "warning",
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
    const rowNum = i + 2;

    const normalised: Record<string, string> = {};
    for (const k of Object.keys(raw)) {
      normalised[k.trim().toLowerCase()] = String(raw[k] ?? "").trim();
    }

    const typeRaw = normalised.type ?? "";
    const catRaw = normalised.category ?? "";
    const amtRaw = normalised.amount ?? "";

    if (!typeRaw && !catRaw && !amtRaw) continue;

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
}: { label: string; value: string; color?: string }) {
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
}: { active?: boolean; payload?: { name: string; value: number }[] }) => {
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
}: { active?: boolean; payload?: { value: number }[] }) => {
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

// ─── Upload Section ───────────────────────────────────────────────────────────
function UploadSection({
  onImport,
}: { onImport: (rows: ParsedRow[]) => void }) {
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
            setErrors([{ row: 0, message: "Failed to parse Excel file." }]);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrors([
          {
            row: 0,
            message: "Unsupported file format. Please upload .csv or .xlsx.",
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
  const { identity, clear, isInitializing } = useInternetIdentity();
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [analysisSubTab, setAnalysisSubTab] = useState("financial-analysis");
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
  const [userProfile, setUserProfile] = useState<{
    name: string;
    onboardingComplete: boolean;
    income: number;
    goals: string[];
    riskProfile: string;
  } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [_showProfileMenu, _setShowProfileMenu] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "home" | "app" | "advisory" | "financialai"
  >("home");
  const [_googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const [googlePhotoURL, setGooglePhotoURL] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const dataLoadedRef = useRef(false);

  // Policies analyzed counter
  const [policiesAnalyzed, setPoliciesAnalyzed] = useState<number>(() => {
    try {
      const googleId = localStorage.getItem("finhealth_google_user_id") ?? "";
      const uid = googleId || "guest";
      const raw = localStorage.getItem(`finhealth_stats_${uid}`);
      if (raw) return JSON.parse(raw).policiesAnalyzed || 0;
    } catch {}
    return 0;
  });

  // Auto-login with Google if stored
  useEffect(() => {
    const gId = localStorage.getItem("finhealth_google_user_id");
    if (gId) {
      const raw = localStorage.getItem(`finhealth_user_${gId}`);
      if (raw) {
        try {
          const gUser = JSON.parse(raw) as { name?: string; photoURL?: string };
          setGoogleLoggedIn(true);
          if (gUser.photoURL) setGooglePhotoURL(gUser.photoURL);
          if (gUser.name) {
            setUserProfile({
              name: gUser.name,
              onboardingComplete: true,
              income: 0,
              goals: [],
              riskProfile: "Medium",
            });
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (identity && actor && !actorFetching && !portfolioLoadedRef.current) {
      portfolioLoadedRef.current = true;
      Promise.all([
        actor.getPortfolio(),
        actor.getTransactions(),
        actor.getCallerUserProfile(),
      ])
        .then(([portfolioData, txData, profile]) => {
          try {
            const parsed = JSON.parse(portfolioData) as Entry[];
            if (Array.isArray(parsed) && parsed.length > 0) setEntries(parsed);
          } catch {}
          try {
            const parsedTx = JSON.parse(txData) as Transaction[];
            if (Array.isArray(parsedTx)) setTransactions(parsedTx);
          } catch {}
          if (profile) {
            setUserProfile({ ...profile, income: Number(profile.income) });
            if (!profile.onboardingComplete) setShowOnboarding(true);
          } else {
            setShowOnboarding(true);
          }
          toast.success("Account loaded!");
        })
        .catch(() => {});
    }
  }, [identity, actor, actorFetching]);

  useEffect(() => {
    if (!identity) {
      portfolioLoadedRef.current = false;
      dataLoadedRef.current = false;
      setUserProfile(null);
      setShowOnboarding(false);
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

  const handleTransactionsChange = async (txns: Transaction[]) => {
    setTransactions(txns);
    if (actor && identity) {
      try {
        await actor.saveTransactions(JSON.stringify(txns));
      } catch {}
    }
  };

  const handleOnboardingComplete = async (data: {
    income: number;
    riskProfile: string;
    goals: string[];
  }) => {
    const profile = {
      name: userProfile?.name ?? "",
      onboardingComplete: true,
      income: BigInt(data.income),
      goals: data.goals,
      riskProfile: data.riskProfile,
    };
    setUserProfile({ ...data, name: profile.name, onboardingComplete: true });
    setShowOnboarding(false);
    localStorage.setItem(
      `finhealth_goals_updated_${userId}`,
      String(Date.now()),
    );
    if (actor && identity) {
      try {
        await actor.saveCallerUserProfile(profile);
      } catch {}
    }
  };

  const totalAssets = entries
    .filter((e) => e.type === "Asset")
    .reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const _scoreBreakdown = computeScoreBreakdown(entries);

  // 5-Dimension FinHealth Score (20 pts each = 100 total)
  const fhDimensionScores = (() => {
    const assets = entries.filter((e) => e.type === "Asset");
    const totalA = assets.reduce((s, e) => s + e.amount, 0);
    if (totalA === 0)
      return {
        diversification: 0,
        inflation: 0,
        insurance: 0,
        goalReadiness: 0,
        expenseControl: 0,
        total: 0,
      };
    const cats = new Set(assets.map((e) => e.category)).size;
    const diversification =
      cats >= 4 ? 20 : cats === 3 ? 15 : cats === 2 ? 10 : cats === 1 ? 5 : 0;
    const eqMfPct =
      (assets
        .filter((e) => e.category === "Equity" || e.category === "Mutual Funds")
        .reduce((s, e) => s + e.amount, 0) /
        totalA) *
      100;
    const inflation =
      eqMfPct > 40 ? 20 : eqMfPct >= 30 ? 15 : eqMfPct >= 20 ? 10 : 5;
    const loanRatio = totalA > 0 ? totalLiabilities / totalA : 0;
    const insurance = loanRatio > 0.5 ? 5 : cats >= 4 ? 15 : cats >= 3 ? 10 : 5;
    const goalReadiness =
      userProfile?.goals && userProfile.goals.length > 0 && totalA > 0 ? 18 : 5;
    const cPct =
      totalA > 0
        ? (assets
            .filter((e) => e.category === "Cash")
            .reduce((s, e) => s + e.amount, 0) /
            totalA) *
          100
        : 0;
    const expenseControl =
      cPct >= 10 && cPct <= 20
        ? 20
        : cPct >= 5 && cPct < 10
          ? 15
          : cPct < 5
            ? 5
            : cPct > 30
              ? 10
              : 12;
    return {
      diversification,
      inflation,
      insurance,
      goalReadiness,
      expenseControl,
      total: Math.min(
        100,
        diversification +
          inflation +
          insurance +
          goalReadiness +
          expenseControl,
      ),
    };
  })();
  const score = fhDimensionScores.total;
  const baseInsights = computeInsights(entries);
  const insights = [
    ...baseInsights,
    ...(!userProfile?.goals || userProfile.goals.length === 0
      ? [
          {
            message:
              "💡 Set specific goals in your profile to track goal readiness and improve your FinHealth Score",
            severity: "info" as const,
          },
        ]
      : []),
  ];
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

  const scoreItems = [
    {
      label: "Diversification",
      score: fhDimensionScores.diversification,
      maxScore: 20,
    },
    {
      label: "Inflation Returns",
      score: fhDimensionScores.inflation,
      maxScore: 20,
    },
    { label: "Insurance", score: fhDimensionScores.insurance, maxScore: 20 },
    {
      label: "Goal Readiness",
      score: fhDimensionScores.goalReadiness,
      maxScore: 20,
    },
    {
      label: "Expense Control",
      score: fhDimensionScores.expenseControl,
      maxScore: 20,
    },
  ];

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
      trackEvent("analysis_run", "financial-analysis");
      setActiveTab("analysis");
      setAnalysisSubTab("financial-analysis");
    }, 1200);
  };

  const googleUserId = localStorage.getItem("finhealth_google_user_id") ?? "";
  const userId = identity
    ? identity.getPrincipal().toString()
    : googleUserId || "guest";
  const { trackEvent } = useUserTracking(userId);

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

  const principal = identity ? identity.getPrincipal().toString() : "guest";
  const shortPrincipal = userProfile?.name
    ? userProfile.name
    : identity
      ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
      : "Guest";

  // Sub-nav button helper
  const SubNavBtn = ({
    id,
    label,
    current,
    onClick,
  }: { id: string; label: string; current: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`analysis.${id}.tab`}
      className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: current === id ? "#B8FF4A" : "#0F141B",
        color: current === id ? "#060A10" : "#9AA6B2",
        border: `1px solid ${current === id ? "#B8FF4A" : "#24303A"}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="neon-bg min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <Toaster />

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* My Account Page */}
      <AnimatePresence>
        {showMyAccount && (
          <MyAccountPage
            onClose={() => setShowMyAccount(false)}
            onStartOnboarding={() => {
              setShowMyAccount(false);
              setShowOnboarding(true);
            }}
            userId={
              googleUserId ||
              btoa(identity?.getPrincipal().toString() || "guest")
                .replace(/[^a-zA-Z0-9]/g, "")
                .substring(0, 12)
            }
          />
        )}
      </AnimatePresence>

      {/* Global Navigation */}
      <GlobalNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        shortPrincipal={shortPrincipal}
        photoURL={
          googlePhotoURL ||
          (() => {
            const uid = identity
              ? btoa(identity.getPrincipal().toString())
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .substring(0, 12)
              : "";
            const raw = uid
              ? localStorage.getItem(`finhealth_user_${uid}`)
              : null;
            return raw
              ? ((JSON.parse(raw) as { photoURL?: string }).photoURL ?? "")
              : "";
          })()
        }
        onMyAccount={() => setShowMyAccount(true)}
        onCloseMyAccount={() => setShowMyAccount(false)}
        onLogout={() => {
          const gId = localStorage.getItem("finhealth_google_user_id");
          if (gId) {
            localStorage.removeItem("finhealth_google_user_id");
            setGoogleLoggedIn(false);
            setGooglePhotoURL("");
            setUserProfile(null);
          } else {
            clear();
          }
        }}
        isSaving={isSaving}
        onSave={savePortfolio}
        setToolsSubTab={setToolsSubTab}
        setAnalysisSubTab={setAnalysisSubTab}
      />

      {currentPage === "home" && (
        <LandingPage
          onEnterApp={() => setCurrentPage("app")}
          onGoAdvisory={() => setCurrentPage("advisory")}
          onGoFinancialAI={() => setCurrentPage("financialai")}
        />
      )}
      {currentPage === "advisory" && (
        <>
          <div className="pt-4 pl-4">
            <BackButton defaultFallback={() => setCurrentPage("home")} />
          </div>
          <AdvisoryPage
            onBack={() => setCurrentPage("home")}
            onOpenChat={() => setCurrentPage("app")}
          />
        </>
      )}
      {currentPage === "financialai" && (
        <FinancialAIPage onBack={() => setCurrentPage("home")} />
      )}
      {currentPage === "app" && (
        <>
          <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 pt-24">
            <div style={{ marginBottom: 8 }}>
              <BackButton defaultFallback={() => setCurrentPage("home")} />
            </div>
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
              <p
                className="text-sm max-w-md mx-auto"
                style={{ color: "#9AA6B2" }}
              >
                Upload your portfolio, add entries, then click Analyze for
                AI-powered insights.
              </p>
              {!userProfile && (
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(255,184,74,0.1)",
                    border: "1px solid rgba(255,184,74,0.3)",
                    color: "#FFB84A",
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    marginTop: 8,
                  }}
                >
                  Complete profile for full access
                </div>
              )}
            </div>

            {/* ── 4 Top-Level Tabs ── */}
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
                  value="dashboard"
                  data-ocid="dashboard.tab"
                  className="flex-1 data-[state=active]:bg-[#B8FF4A] data-[state=active]:text-[#060A10] data-[state=active]:font-bold"
                  style={{ borderRadius: 10, fontSize: 14 }}
                >
                  Dashboard
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
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* ── DASHBOARD TAB ── */}
              <TabsContent value="dashboard">
                {!userProfile && (
                  <div
                    style={{
                      background: "rgba(255,184,74,0.08)",
                      border: "1px solid rgba(255,184,74,0.3)",
                      borderRadius: 14,
                      padding: "16px 20px",
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                    data-ocid="dashboard.onboarding_warning.panel"
                  >
                    <div>
                      <div
                        style={{
                          color: "#FFB84A",
                          fontWeight: 700,
                          fontSize: 15,
                          marginBottom: 4,
                        }}
                      >
                        No profile found
                      </div>
                      <div style={{ color: "#9AA6B2", fontSize: 13 }}>
                        Complete onboarding to unlock full features
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOnboarding(true)}
                      data-ocid="dashboard.complete_onboarding.button"
                      style={{
                        background: "#FFB84A",
                        color: "#060A10",
                        border: "none",
                        borderRadius: 10,
                        padding: "8px 18px",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Complete Onboarding
                    </button>
                  </div>
                )}
                {/* ── Financial Overview Card ── */}
                <div
                  className="mb-5 rounded-2xl p-5"
                  style={{ background: "#0F141B", border: "1px solid #24303A" }}
                  data-ocid="dashboard.financial_overview.card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="text-sm font-bold"
                      style={{ color: "#EAF0F6" }}
                    >
                      Financial Overview
                    </h2>
                    <span
                      className="text-xs italic"
                      style={{ color: "#4A5568" }}
                    >
                      For informational purposes only
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Net Worth",
                        value: formatINR(netWorth),
                        accent: netWorth >= 0 ? "#B8FF4A" : "#FF4A4A",
                        glow: netWorth >= 0,
                      },
                      {
                        label: "Total Assets",
                        value: formatINR(totalAssets),
                        accent: "#4AB8FF",
                        glow: false,
                      },
                      {
                        label: "Liabilities",
                        value: formatINR(totalLiabilities),
                        accent: "#FF4A4A",
                        glow: false,
                      },
                      {
                        label: "Policies Analyzed",
                        value: String(policiesAnalyzed),
                        accent: "#C74AFF",
                        glow: false,
                      },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="p-3 rounded-xl"
                        style={{
                          background: "#0A0F15",
                          border: "1px solid #1A2230",
                        }}
                      >
                        <div
                          className="text-xs mb-1"
                          style={{ color: "#9AA6B2" }}
                        >
                          {metric.label}
                        </div>
                        <div
                          className="text-xl font-bold"
                          style={{
                            color: metric.accent,
                            textShadow: metric.glow
                              ? `0 0 12px ${metric.accent}60`
                              : "none",
                          }}
                        >
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Key Insights Strip ── */}
                <div className="mb-5" data-ocid="dashboard.key_insights.panel">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={15} style={{ color: "#B8FF4A" }} />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#EAF0F6" }}
                    >
                      Key Insights
                    </span>
                    <span
                      className="text-xs italic"
                      style={{ color: "#4A5568" }}
                    >
                      · Not a recommendation
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(() => {
                      const chips: { msg: string; type: "info" | "warn" }[] =
                        [];
                      if (entries.length === 0) {
                        chips.push({
                          msg: "Add your investments to see personalized insights",
                          type: "info",
                        });
                        chips.push({
                          msg: "Upload a policy to analyze your returns",
                          type: "info",
                        });
                      } else {
                        if (equityPct > 60)
                          chips.push({
                            msg: "Equity allocation is high — consider diversifying",
                            type: "warn",
                          });
                        if (equityPct >= 40 && equityPct <= 60)
                          chips.push({
                            msg: "Your overall returns appear moderate",
                            type: "info",
                          });
                        if (
                          userProfile &&
                          userProfile.income > 0 &&
                          totalAssets > 0
                        ) {
                          const savings = userProfile.income * 0.3;
                          if (savings < userProfile.income * 0.2)
                            chips.push({
                              msg: "Your savings rate appears low",
                              type: "warn",
                            });
                        }
                        if (totalLiabilities > totalAssets * 0.4)
                          chips.push({
                            msg: "Insurance allocation is high relative to assets",
                            type: "warn",
                          });
                        if (chips.length === 0)
                          chips.push({
                            msg: "Portfolio appears balanced across categories",
                            type: "info",
                          });
                        if (chips.length < 2)
                          chips.push({
                            msg: "Analyze portfolio for detailed insights",
                            type: "info",
                          });
                      }
                      return chips.slice(0, 3).map((chip) => (
                        <div
                          key={chip.msg}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                          style={{
                            background:
                              chip.type === "warn"
                                ? "rgba(255,184,74,0.08)"
                                : "rgba(74,184,255,0.08)",
                            borderLeft: `3px solid ${chip.type === "warn" ? "#FFB84A" : "#4AB8FF"}`,
                            border: `1px solid ${chip.type === "warn" ? "rgba(255,184,74,0.2)" : "rgba(74,184,255,0.2)"}`,
                            color: chip.type === "warn" ? "#FFB84A" : "#4AB8FF",
                          }}
                        >
                          {chip.msg}
                        </div>
                      ));
                    })()}
                  </div>
                  <p
                    className="text-xs italic mt-2"
                    style={{ color: "#4A5568" }}
                  >
                    For informational purposes only · Not a recommendation ·
                    Estimates based on assumptions
                  </p>
                </div>

                {/* ── Quick Actions Row ── */}
                <div className="mb-5" data-ocid="dashboard.quick_actions.panel">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={15} style={{ color: "#B8FF4A" }} />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#EAF0F6" }}
                    >
                      Quick Actions
                    </span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      {
                        label: "📋 Upload Policy",
                        ocid: "dashboard.upload_policy.button",
                        action: () => {
                          setActiveTab("tools");
                          setToolsSubTab("policy-analyzer");
                        },
                      },
                      {
                        label: "➕ Add Investment",
                        ocid: "dashboard.add_investment.button",
                        action: () => {
                          setActiveTab("analysis");
                          setAnalysisSubTab("financial-analysis");
                        },
                      },
                      {
                        label: "📊 View Portfolio",
                        ocid: "dashboard.view_portfolio.button",
                        action: () => {
                          setActiveTab("analysis");
                          setAnalysisSubTab("financial-analysis");
                        },
                      },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        data-ocid={btn.ocid}
                        onClick={btn.action}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                        style={{
                          background: "transparent",
                          border: "1px solid #B8FF4A",
                          color: "#B8FF4A",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            "#B8FF4A";
                          (e.currentTarget as HTMLElement).style.color =
                            "#060A10";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            "#B8FF4A";
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Recent Activity Section ── */}
                <div
                  className="mb-5 p-4 rounded-2xl"
                  style={{ background: "#0F141B", border: "1px solid #24303A" }}
                  data-ocid="dashboard.recent_activity.panel"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={15} style={{ color: "#B8FF4A" }} />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#EAF0F6" }}
                    >
                      Recent Activity
                    </span>
                  </div>
                  {(() => {
                    try {
                      const raw = localStorage.getItem(
                        `finhealth_events_${userId}`,
                      );
                      if (!raw) throw new Error("no events");
                      const events = JSON.parse(raw) as {
                        eventType: string;
                        toolName: string;
                        timestamp: number;
                      }[];
                      const relevant = events
                        .filter(
                          (e) =>
                            e.eventType === "tool_used" ||
                            e.eventType === "analysis_run",
                        )
                        .slice(-2)
                        .reverse();
                      if (relevant.length === 0) throw new Error("no relevant");
                      return (
                        <div className="space-y-2">
                          {relevant.map((evt, evtIdx) => {
                            const ago = Date.now() - evt.timestamp;
                            const mins = Math.floor(ago / 60000);
                            const hrs = Math.floor(mins / 60);
                            const days = Math.floor(hrs / 24);
                            const timeStr =
                              days > 0
                                ? `${days}d ago`
                                : hrs > 0
                                  ? `${hrs}h ago`
                                  : mins > 0
                                    ? `${mins}m ago`
                                    : "just now";
                            return (
                              <div
                                key={evt.timestamp}
                                data-ocid={`dashboard.recent_activity.item.${evtIdx + 1}`}
                                className="flex items-center justify-between rounded-lg px-3 py-2"
                                style={{
                                  background: "#0A0F15",
                                  border: "1px solid #1A2230",
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {evt.eventType === "analysis_run"
                                      ? "📊"
                                      : "🔧"}
                                  </span>
                                  <span
                                    className="text-xs font-medium capitalize"
                                    style={{ color: "#EAF0F6" }}
                                  >
                                    {evt.toolName
                                      ? evt.toolName.replace(/-/g, " ")
                                      : evt.eventType.replace(/_/g, " ")}
                                  </span>
                                </div>
                                <span
                                  className="text-xs"
                                  style={{ color: "#4A5568" }}
                                >
                                  {timeStr}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    } catch {
                      return (
                        <div
                          className="text-xs text-center py-3"
                          style={{ color: "#4A5568" }}
                          data-ocid="dashboard.recent_activity.empty_state"
                        >
                          No recent activity — start by uploading a policy
                        </div>
                      );
                    }
                  })()}
                </div>

                <UploadSection onImport={handleImportRows} />

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
                {/* Analysis Sub-Navigation */}
                <div
                  className="mb-5 flex flex-wrap gap-2"
                  data-ocid="analysis.panel"
                >
                  {[
                    {
                      id: "financial-analysis",
                      label: "📊 Financial Analysis",
                    },
                    { id: "trends", label: "📈 Trends" },
                    {
                      id: "investor-protection",
                      label: "🛡 Investor Protection",
                    },
                    { id: "sip-calculator", label: "💰 SIP Calculator" },
                    { id: "kyc-checklist", label: "✅ KYC Checklist" },
                    { id: "risk-profile", label: "🧠 Risk Profile" },
                  ].map((t) => (
                    <SubNavBtn
                      key={t.id}
                      id={t.id}
                      label={t.label}
                      current={analysisSubTab}
                      onClick={() => setAnalysisSubTab(t.id)}
                    />
                  ))}
                </div>

                {/* Financial Analysis Sub-Tab */}
                {analysisSubTab === "financial-analysis" &&
                  (!analyzed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="fintech-card p-12 flex flex-col items-center justify-center gap-4 text-center"
                      data-ocid="analysis.empty_state"
                    >
                      <BarChart3 size={48} style={{ color: "#24303A" }} />
                      <p className="text-sm" style={{ color: "#9AA6B2" }}>
                        Go to Dashboard tab and click{" "}
                        <span style={{ color: "#B8FF4A" }}>
                          Analyze Portfolio
                        </span>{" "}
                        to see your results.
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
                        {/* Summary Cards */}
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
                        {/* Metrics */}
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
                                          CATEGORY_COLORS[
                                            entry.name as Category
                                          ] || "#B8FF4A"
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
                                {pieData.map((d) => (
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
                                      {((d.value / totalAssets) * 100).toFixed(
                                        1,
                                      )}
                                      %
                                    </span>
                                  </div>
                                ))}
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
                            <AlertTriangle
                              size={16}
                              style={{ color: "#B8FF4A" }}
                            />
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
                                    style={{
                                      color: "#EAF0F6",
                                      lineHeight: 1.5,
                                    }}
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
                            <TrendingUp
                              size={16}
                              style={{ color: "#B8FF4A" }}
                            />
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
                                    style={{
                                      color: "#9AA6B2",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {action.message}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Financial Intelligence Panel */}
                      <FinancialIntelligencePanel
                        userId={userId}
                        userProfile={userProfile}
                        equityPct={equityPct}
                        totalAssets={totalAssets}
                        setActiveTab={setActiveTab}
                        setToolsSubTab={setToolsSubTab}
                        setAnalysisSubTab={setAnalysisSubTab}
                      />
                      {/* Activity Insights Panel */}
                      <DashboardInsights
                        userId={userId}
                        goalsCount={userProfile?.goals?.length ?? 0}
                        lastGoalsUpdate={(() => {
                          const v = localStorage.getItem(
                            `finhealth_goals_updated_${userId}`,
                          );
                          return v ? Number(v) : undefined;
                        })()}
                      />

                      {/* Share FinHealth Score */}
                      <div
                        className="fintech-card p-5 mb-6"
                        data-ocid="dashboard.share.panel"
                      >
                        <h3
                          className="text-base font-bold mb-3 flex items-center gap-2"
                          style={{ color: "#EAF0F6" }}
                        >
                          <Share2 size={18} style={{ color: "#B8FF4A" }} />{" "}
                          Share My FinHealth Score
                        </h3>
                        <div className="flex gap-3 flex-wrap">
                          <button
                            type="button"
                            data-ocid="dashboard.share.whatsapp.button"
                            onClick={() => {
                              window.open(
                                `https://wa.me/?text=${encodeURIComponent(`My FinHealth Score is ${score}/100. Check yours on FinHealth India 🚀`)}`,
                                "_blank",
                              );
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: "rgba(37,211,102,0.12)",
                              color: "#25D366",
                              border: "1px solid rgba(37,211,102,0.3)",
                              cursor: "pointer",
                            }}
                          >
                            📱 Share on WhatsApp
                          </button>
                          <button
                            type="button"
                            data-ocid="dashboard.share.copy.button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `My FinHealth Score is ${score}/100. Check yours at FinHealth India!`,
                              );
                              toast.success("Copied to clipboard!");
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: "rgba(184,255,74,0.12)",
                              color: "#B8FF4A",
                              border: "1px solid rgba(184,255,74,0.3)",
                              cursor: "pointer",
                            }}
                          >
                            🔗 Copy Link
                          </button>
                        </div>
                      </div>

                      {/* Alerts Panel */}
                      <div
                        className="fintech-card p-5 mb-6"
                        data-ocid="dashboard.alerts.panel"
                      >
                        <h2
                          className="text-sm font-bold mb-4 flex items-center gap-2"
                          style={{ color: "#EAF0F6" }}
                        >
                          <AlertTriangle
                            size={16}
                            style={{ color: "#FFBE0B" }}
                          />
                          Portfolio Alerts
                        </h2>
                        <div className="space-y-2">
                          {cashPct < 10 && totalAssets > 0 && (
                            <div
                              className="flex items-start gap-3 p-3 rounded-xl text-xs"
                              style={{
                                background: "rgba(255,190,11,0.08)",
                                border: "1px solid rgba(255,190,11,0.25)",
                              }}
                            >
                              <span style={{ color: "#FFBE0B" }}>⚠️</span>
                              <span style={{ color: "#EAF0F6" }}>
                                Low emergency fund — less than 10% in cash. Add
                                at least{" "}
                                {formatINR(
                                  totalAssets * 0.1 - getCatAmt("Cash"),
                                )}{" "}
                                to reach safety threshold.
                              </span>
                            </div>
                          )}
                          {(!userProfile?.goals ||
                            userProfile.goals.length === 0) && (
                            <div
                              className="flex items-start gap-3 p-3 rounded-xl text-xs"
                              style={{
                                background: "rgba(74,184,255,0.08)",
                                border: "1px solid rgba(74,184,255,0.25)",
                              }}
                            >
                              <span style={{ color: "#4AB8FF" }}>⚠️</span>
                              <span style={{ color: "#EAF0F6" }}>
                                You have no financial goals. Start with Goal
                                Planner.
                              </span>
                            </div>
                          )}
                          {equityPct > 70 && (
                            <div
                              className="flex items-start gap-3 p-3 rounded-xl text-xs"
                              style={{
                                background: "rgba(255,74,74,0.08)",
                                border: "1px solid rgba(255,74,74,0.25)",
                              }}
                            >
                              <span style={{ color: "#FF4A4A" }}>⚠️</span>
                              <span style={{ color: "#EAF0F6" }}>
                                Your equity allocation is too high (
                                {equityPct.toFixed(0)}%). Consider rebalancing
                                to reduce risk.
                              </span>
                            </div>
                          )}
                          {cashPct >= 10 &&
                            (userProfile?.goals?.length ?? 0) > 0 &&
                            equityPct <= 70 && (
                              <div
                                className="flex items-center gap-3 p-3 rounded-xl text-xs"
                                style={{
                                  background: "rgba(184,255,74,0.06)",
                                  border: "1px solid rgba(184,255,74,0.2)",
                                }}
                              >
                                <span>✅</span>
                                <span style={{ color: "#B8FF4A" }}>
                                  No critical alerts — your portfolio looks
                                  well-structured.
                                </span>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Referral Card */}
                      <div className="mb-6">
                        <ReferralCard />
                      </div>

                      {/* Portfolio Breakdown */}
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
                              totalAssets > 0
                                ? (d.value / totalAssets) * 100
                                : 0;
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
                                      color:
                                        CATEGORY_COLORS[d.name as Category],
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
                                      background:
                                        CATEGORY_COLORS[d.name as Category],
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

                      {/* Peer Benchmarks */}
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
                          const assets2 = entries.filter(
                            (e) => e.type === "Asset",
                          );
                          const total2 = assets2.reduce(
                            (s, e) => s + e.amount,
                            0,
                          );
                          const liabilities2 = entries
                            .filter((e) => e.type === "Liability")
                            .reduce((s, e) => s + e.amount, 0);
                          const cats2 = new Set(assets2.map((e) => e.category))
                            .size;
                          const nw2 = total2 - liabilities2;
                          const divPct =
                            cats2 >= 5
                              ? 92
                              : cats2 >= 4
                                ? 78
                                : cats2 >= 3
                                  ? 55
                                  : cats2 >= 2
                                    ? 35
                                    : 15;
                          const scorePct =
                            score >= 75
                              ? 88
                              : score >= 60
                                ? 65
                                : score >= 45
                                  ? 42
                                  : 22;
                          const nwPct =
                            nw2 >= 5000000
                              ? 85
                              : nw2 >= 2000000
                                ? 68
                                : nw2 >= 500000
                                  ? 45
                                  : nw2 >= 100000
                                    ? 28
                                    : 12;
                          const bc = (p: number) =>
                            p >= 75
                              ? "#B8FF4A"
                              : p >= 50
                                ? "#FFD74A"
                                : "#FF4A4A";
                          const bl = (p: number) =>
                            p >= 75
                              ? `Top ${100 - p}%`
                              : p >= 50
                                ? "Above Average"
                                : "Room to Grow";
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {[
                                {
                                  label: "Diversification",
                                  pct: divPct,
                                  detail: `${cats2} asset classes`,
                                },
                                {
                                  label: "Health Score",
                                  pct: scorePct,
                                  detail: `${score}/100`,
                                },
                                {
                                  label: "Net Worth",
                                  pct: nwPct,
                                  detail: formatINR(nw2),
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
                                      background: `${bc(b.pct)}22`,
                                      color: bc(b.pct),
                                      border: `1.5px solid ${bc(b.pct)}55`,
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
                                      style={{ color: bc(b.pct) }}
                                    >
                                      {bl(b.pct)}
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
                        <p
                          className="text-xs mt-3"
                          style={{ color: "#9AA6B2" }}
                        >
                          * Based on anonymized FinHealth India user data
                          (percentile rankings)
                        </p>
                      </div>
                    </AnimatePresence>
                  ))}

                {/* Trends Sub-Tab */}
                {analysisSubTab === "trends" && (
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
                            color:
                              Number(trendGrowth) >= 0 ? "#B8FF4A" : "#FF4A4A",
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
                          <CartesianGrid
                            stroke="#1A2230"
                            strokeDasharray="3 3"
                          />
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
                            activeDot={{
                              fill: "#B8FF4A",
                              r: 6,
                              strokeWidth: 0,
                            }}
                            style={{
                              filter:
                                "drop-shadow(0 0 6px rgba(184,255,74,0.5))",
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
                          History
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {[...history].reverse().map((h, i) => (
                            <div
                              key={h.timestamp}
                              data-ocid={`trends.item.${i + 1}`}
                              className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                              style={{
                                background: "#0F141B",
                                border: "1px solid #24303A",
                              }}
                            >
                              <span
                                className="text-xs"
                                style={{ color: "#9AA6B2" }}
                              >
                                {new Date(h.timestamp).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                              <span
                                className="font-bold text-sm"
                                style={{
                                  color:
                                    h.netWorth >= 0 ? "#B8FF4A" : "#FF4A4A",
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
                )}

                {/* Investor Protection Sub-Tab */}
                {analysisSubTab === "investor-protection" && (
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
                        style={{
                          color: "#FFBE0B",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      <div>
                        <p
                          className="text-sm font-semibold mb-1"
                          style={{ color: "#FFBE0B" }}
                        >
                          SEBI Disclaimer
                        </p>
                        <p
                          className="text-sm mb-1"
                          style={{ color: "#EAF0F6" }}
                        >
                          This app provides educational insights only and not
                          investment advice.
                        </p>
                        <p className="text-sm" style={{ color: "#9AA6B2" }}>
                          Investments are subject to market risks. Please read
                          all scheme related documents carefully.
                        </p>
                      </div>
                    </div>

                    {/* Risk Awareness */}
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
                              ⚠ High Volatility Risk — Equity{" "}
                              {equityPct.toFixed(0)}%
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
                                      e.type === "Asset" &&
                                      e.category === "Debt",
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
                                  color:
                                    riskAppetite === v ? "#060A10" : "#9AA6B2",
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
                            {(["Short", "Medium", "Long"] as const).map((v) => (
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
                                    investmentHorizon === v
                                      ? "#060A10"
                                      : "#9AA6B2",
                                  border: `1px solid ${investmentHorizon === v ? "#B8FF4A" : "#24303A"}`,
                                }}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                        {entries.length > 0 &&
                          riskAppetite &&
                          investmentHorizon &&
                          (() => {
                            const pRisk =
                              equityPct > 60
                                ? "High"
                                : equityPct > 30
                                  ? "Medium"
                                  : "Low";
                            const riskMismatch =
                              (riskAppetite === "Low" &&
                                (pRisk === "High" || pRisk === "Medium")) ||
                              (riskAppetite === "Medium" && pRisk === "High");
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
                                  ? "⚠ Your allocation may not match your risk profile. Consider rebalancing."
                                  : "✓ Your portfolio aligns with your risk profile."}
                              </div>
                            );
                          })()}
                      </div>
                    </div>

                    {/* Fraud Awareness */}
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
                            No SEBI-registered product can guarantee fixed
                            returns. Be wary of schemes promising assured
                            profits.
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
                            Always check the SEBI registration of your advisor
                            at{" "}
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

                    {/* Transparency */}
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
                          Add portfolio entries to view your asset allocation
                          and risk level.
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
                )}

                {/* SIP Calculator Sub-Tab */}
                {analysisSubTab === "sip-calculator" && (
                  <Tabs defaultValue="sip-calculator">
                    <SipCalculatorTab />
                  </Tabs>
                )}

                {/* KYC Checklist Sub-Tab */}
                {analysisSubTab === "kyc-checklist" && (
                  <Tabs defaultValue="kyc-checklist">
                    <KycChecklistTab />
                  </Tabs>
                )}

                {/* Risk Profile Sub-Tab */}
                {analysisSubTab === "risk-profile" && (
                  <RiskProfileTab entries={entries} />
                )}
              </TabsContent>

              {/* ── TOOLS TAB ── */}
              <TabsContent value="tools">
                <div
                  className="mb-4 flex flex-wrap gap-2"
                  data-ocid="tools.panel"
                >
                  {[
                    { id: "stress-test", label: "🔥 Stress Test" },
                    { id: "inflation", label: "📉 Inflation" },
                    { id: "rebalancing", label: "⚖️ Rebalance" },
                    { id: "tax", label: "🧾 Tax Optimizer" },
                    { id: "lifestage", label: "🗺 Life Stage" },
                    { id: "gold-sgb", label: "🥇 Gold vs SGB" },
                    { id: "investment", label: "📈 Investment Calc" },
                    { id: "loan", label: "🏠 Loan Prepayment" },
                    { id: "policy-analyzer", label: "📋 Policy Analyzer" },
                    { id: "ulip-sip", label: "⚖️ ULIP vs SIP" },
                    { id: "goal-planner", label: "🎯 Goal Planner" },
                    { id: "spending-analysis", label: "💳 Spending Analysis" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setToolsSubTab(t.id);
                        trackEvent("tool_used", t.id);
                      }}
                      data-ocid={`tools.${t.id}.tab`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background:
                          toolsSubTab === t.id ? "#B8FF4A" : "#0F141B",
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
                {toolsSubTab === "loan" && (
                  <LoanPrepaymentTab entries={entries} />
                )}
                {toolsSubTab === "policy-analyzer" && (
                  <PolicyAnalyzerTab
                    entries={entries}
                    onPolicyAnalyzed={() => {
                      setPoliciesAnalyzed((n) => {
                        const next = n + 1;
                        localStorage.setItem(
                          `finhealth_stats_${userId}`,
                          JSON.stringify({ policiesAnalyzed: next }),
                        );
                        return next;
                      });
                    }}
                  />
                )}
                {toolsSubTab === "ulip-sip" && (
                  <UlipVsSipTab entries={entries} />
                )}
                {toolsSubTab === "goal-planner" && (
                  <GoalPlannerTab entries={entries} />
                )}
                {toolsSubTab === "spending-analysis" && (
                  <CardAnalysisTab
                    transactions={transactions}
                    onTransactionsChange={handleTransactionsChange}
                    monthlyIncome={userProfile?.income ?? 0}
                  />
                )}
              </TabsContent>

              {/* ── REPORTS TAB ── */}
              <TabsContent value="reports">
                <DnaReportTab entries={entries} healthScore={score} />
              </TabsContent>
            </Tabs>
          </main>

          {/* Footer */}
          <footer
            style={{
              borderTop: "1px solid #24303A",
              marginTop: "auto",
              background: "#060A10",
            }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                {/* Col 1 */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <Zap
                      size={20}
                      style={{
                        color: "#B8FF4A",
                        filter: "drop-shadow(0 0 5px #B8FF4A80)",
                      }}
                    />
                    <span
                      style={{
                        color: "#EAF0F6",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      FinPulse
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#9AA6B2",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      margin: "0 0 12px",
                    }}
                  >
                    India's Advanced Financial Intelligence Platform
                  </p>
                  <div
                    style={{
                      background: "rgba(255,180,0,0.08)",
                      border: "1px solid rgba(255,180,0,0.2)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                    }}
                  >
                    <p
                      style={{
                        color: "#FFA500",
                        fontSize: "12px",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      ⚠️ For educational purposes only. Not investment advice.
                      Investments are subject to market risks.
                    </p>
                  </div>
                </div>
                {/* Col 2 - Quick Links */}
                <div>
                  <h4
                    style={{
                      color: "#EAF0F6",
                      fontWeight: 700,
                      fontSize: "14px",
                      marginBottom: "14px",
                    }}
                  >
                    Quick Links
                  </h4>
                  <nav
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {[
                      {
                        label: "About Us",
                        action: () => setShowAbout(true),
                        ocid: "footer.about.link",
                      },
                      {
                        label: "Contact Us",
                        action: () => setShowContact(true),
                        ocid: "footer.contact.link",
                      },
                      {
                        label: "Sitemap",
                        action: () => setShowSitemap(true),
                        ocid: "footer.sitemap.link",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        data-ocid={item.ocid}
                        onClick={item.action}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9AA6B2",
                          fontSize: "13px",
                          textAlign: "left",
                          padding: 0,
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.color =
                            "#B8FF4A";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.color =
                            "#9AA6B2";
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
                {/* Col 3 - Legal */}
                <div>
                  <h4
                    style={{
                      color: "#EAF0F6",
                      fontWeight: 700,
                      fontSize: "14px",
                      marginBottom: "14px",
                    }}
                  >
                    Legal
                  </h4>
                  <nav
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {[
                      {
                        label: "Privacy Policy",
                        action: () => setShowPrivacy(true),
                        ocid: "footer.privacy.link",
                      },
                      {
                        label: "Terms of Use",
                        action: () => setShowTerms(true),
                        ocid: "footer.terms.link",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        data-ocid={item.ocid}
                        onClick={item.action}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9AA6B2",
                          fontSize: "13px",
                          textAlign: "left",
                          padding: 0,
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLButtonElement).style.color =
                            "#B8FF4A";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.color =
                            "#9AA6B2";
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid #24303A",
                  paddingTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#4A5568", fontSize: "12px", margin: 0 }}>
                  © {new Date().getFullYear()} FinHealth India. Built with ♥
                  using{" "}
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

          {/* Modals & Chat */}
          <ClientChatBox
            userId={shortPrincipal}
            onNavigate={(tab, subTab) => {
              setActiveTab(tab);
              if (subTab) setToolsSubTab(subTab);
            }}
            onChatQuery={() => trackEvent("chat_query")}
          />
          <ContactModal
            open={showContact}
            onClose={() => setShowContact(false)}
          />
          <SitemapModal
            open={showSitemap}
            onClose={() => setShowSitemap(false)}
          />
          <InfoModal
            open={showAbout}
            onClose={() => setShowAbout(false)}
            title="About FinHealth India"
          >
            <p>
              FinHealth India is India's most advanced personal financial
              intelligence platform. We help users analyze their investments,
              detect mis-selling, plan goals, and make informed financial
              decisions — all with zero data sharing with third parties.
            </p>
            <p style={{ marginTop: "12px" }}>
              Built for the Indian investor, by people who understand Indian
              financial markets, regulations, and challenges. Our platform
              covers everything from portfolio stress testing to SEBI
              compliance, policy mis-selling detection, and tax optimization.
            </p>
          </InfoModal>
          <InfoModal
            open={showPrivacy}
            onClose={() => setShowPrivacy(false)}
            title="Privacy Policy"
          >
            <p>
              We take your privacy seriously. All financial data you enter is
              stored securely and never shared with third parties.
            </p>
            <p style={{ marginTop: "12px" }}>
              We use Internet Identity for decentralized authentication. Your
              data is stored on the Internet Computer blockchain, ensuring
              transparency and security.
            </p>
            <p style={{ marginTop: "12px" }}>
              We do not sell, rent, or share your personal financial data with
              advertisers or data brokers. Ever.
            </p>
          </InfoModal>
          <InfoModal
            open={showTerms}
            onClose={() => setShowTerms(false)}
            title="Terms of Use"
          >
            <p>
              This platform is for educational and informational purposes only.
              FinHealth India does not provide investment advice, and nothing on
              this platform should be construed as such.
            </p>
            <p style={{ marginTop: "12px" }}>
              Use of this platform is subject to Indian laws and regulations. By
              using FinHealth India, you agree to use the platform responsibly
              and acknowledge that all financial decisions are your own.
            </p>
            <p style={{ marginTop: "12px" }}>
              Unauthorized reproduction, distribution, or modification of
              platform content is strictly prohibited.
            </p>
          </InfoModal>
        </>
      )}
    </div>
  );
}
