import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle,
  Info,
  Plus,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SidebarPage } from "./AppLayout";

interface Props {
  setActivePage: (p: SidebarPage) => void;
}

function getUserData() {
  const uid = localStorage.getItem("finhealth_current_user_id") || "";
  try {
    return JSON.parse(localStorage.getItem(`finhealth_user_${uid}`) || "{}");
  } catch {
    return {};
  }
}

const chartData = [
  { month: "Jan", income: 85000, expense: 52000 },
  { month: "Feb", income: 85000, expense: 48000 },
  { month: "Mar", income: 90000, expense: 55000 },
  { month: "Apr", income: 85000, expense: 50000 },
  { month: "May", income: 92000, expense: 53000 },
  { month: "Jun", income: 85000, expense: 49000 },
];

const subScores = [
  { label: "Savings", value: 80, color: "#2FE6FF" },
  { label: "Investments", value: 75, color: "#31E981" },
  { label: "Debt", value: 65, color: "#2D7BFF" },
  { label: "Risk", value: 70, color: "#B05CFF" },
];

interface GaugeProps {
  score: number;
}
function GaugeRing({ score }: GaugeProps) {
  const r = 72;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * r;
  const startAngle = 225;
  const scoreColor =
    score >= 75 ? "#31E981" : score >= 50 ? "#FBCE24" : "#F87171";
  const label = score >= 75 ? "Good" : score >= 50 ? "Fair" : "Needs Work";

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        aria-label="Financial Health Score Gauge"
        role="img"
      >
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2FE6FF" />
            <stop offset="50%" stopColor="#2D7BFF" />
            <stop offset="100%" stopColor="#7A3CFF" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeDasharray={`${circumference * 0.75 * (score / 100)} ${circumference * (1 - 0.75 * (score / 100))}`}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          style={{ filter: "drop-shadow(0 0 8px rgba(47,230,255,0.5))" }}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="#F2F5FF"
          fontSize="32"
          fontWeight="800"
          fontFamily="Bricolage Grotesque, sans-serif"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="#9AA6BF"
          fontSize="12"
        >
          out of 100
        </text>
        <text
          x={cx}
          y={cy + 34}
          textAnchor="middle"
          fill={scoreColor}
          fontSize="13"
          fontWeight="700"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function NetWorthCard() {
  const netWorth = 425000;
  const assets = 680000;
  const liabilities = 255000;

  const fmt = (v: number) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
    return `₹${(v / 1000).toFixed(1)}K`;
  };

  return (
    <div
      className="glass-card p-6 h-full"
      style={{
        background: "rgba(18,24,42,0.7)",
        border: "1px solid transparent",
        backgroundClip: "padding-box",
        boxShadow:
          "0 0 0 1px rgba(47,230,255,0.18), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Wallet size={16} style={{ color: "#2FE6FF" }} />
        <h3 className="font-semibold text-white text-sm">Net Worth Summary</h3>
      </div>
      <div className="text-center mb-6">
        <div className="text-xs mb-1" style={{ color: "#9AA6BF" }}>
          Total Net Worth
        </div>
        <div
          className="text-3xl font-extrabold"
          style={{
            background: "linear-gradient(90deg, #2FE6FF, #7A3CFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "Bricolage Grotesque, sans-serif",
          }}
        >
          {fmt(netWorth)}
        </div>
        <div className="text-xs mt-1" style={{ color: "#31E981" }}>
          +4.2% this month
        </div>
      </div>
      <div className="space-y-3">
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{
            background: "rgba(49,233,129,0.07)",
            border: "1px solid rgba(49,233,129,0.15)",
          }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={14} style={{ color: "#31E981" }} />
            <span className="text-xs" style={{ color: "#9AA6BF" }}>
              Total Assets
            </span>
          </div>
          <span className="text-sm font-bold" style={{ color: "#31E981" }}>
            {fmt(assets)}
          </span>
        </div>
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{
            background: "rgba(248,113,113,0.07)",
            border: "1px solid rgba(248,113,113,0.15)",
          }}
        >
          <div className="flex items-center gap-2">
            <TrendingDown size={14} style={{ color: "#F87171" }} />
            <span className="text-xs" style={{ color: "#9AA6BF" }}>
              Total Liabilities
            </span>
          </div>
          <span className="text-sm font-bold" style={{ color: "#F87171" }}>
            {fmt(liabilities)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ setActivePage }: Props) {
  const [user, setUser] = useState(getUserData());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(getUserData());
    setTimeout(() => setLoaded(true), 300);
  }, []);

  const score = 72;
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const alerts = [
    {
      icon: Shield,
      color: "#FBCE24",
      bgClass: "alert-amber",
      title: "Your insurance coverage appears weak",
      desc: "Based on your profile, your life cover may be insufficient.",
      action: "Analyze Policy",
      page: "insurance" as SidebarPage,
    },
    {
      icon: AlertTriangle,
      color: "#2FE6FF",
      bgClass: "alert-cyan",
      title: "You may be able to save more tax",
      desc: "Potential ₹18,000+ in additional deductions available.",
      action: "Open Tax Optimizer",
      page: "tax" as SidebarPage,
    },
    {
      icon: TrendingUp,
      color: "#B05CFF",
      bgClass: "alert-purple",
      title: "Improve your score by +15",
      desc: "3 quick actions can significantly boost your health score.",
      action: "View Financial Health",
      page: "health" as SidebarPage,
    },
    {
      icon: CheckCircle,
      color: "#31E981",
      bgClass: "alert-green",
      title: "Your savings rate is strong — keep it up!",
      desc: "38% savings rate puts you in the top 20% of users.",
      action: undefined,
      page: undefined,
    },
  ];

  const recommendations = [
    {
      icon: Shield,
      color: "#B05CFF",
      title: "Analyze Insurance",
      desc: "Upload policy for real IRR",
      page: "insurance" as SidebarPage,
    },
    {
      icon: Bot,
      color: "#2FE6FF",
      title: "Optimize Tax",
      desc: "Save more with deductions",
      page: "tax" as SidebarPage,
    },
    {
      icon: Sparkles,
      color: "#31E981",
      title: "Improve Score",
      desc: "Boost your health score",
      page: "health" as SidebarPage,
    },
  ];

  if (!loaded) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card h-32 animate-pulse"
            style={{ background: "rgba(18,24,42,0.4)" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Greeting */}
      <div>
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          {greeting()}, {user.name || "User"} 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: "#9AA6BF" }}>
          Here's your financial snapshot for today.
        </p>
      </div>

      {/* Row 1: Health Score + Net Worth */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Health Score Card */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-sm">
                Financial Health Score
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#9AA6BF" }}>
                Based on 4 financial dimensions
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActivePage("health")}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(47,230,255,0.1)", color: "#2FE6FF" }}
            >
              View Details <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <GaugeRing score={score} />
            <div className="flex-1 space-y-3 w-full">
              {subScores.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "#9AA6BF" }}>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: 600 }}>
                      {s.value}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${s.value}%`,
                        background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-xs" style={{ color: "#9AA6BF" }}>
                  💡 You can improve score by{" "}
                  <span style={{ color: "#2FE6FF", fontWeight: 600 }}>
                    +15 points
                  </span>{" "}
                  with 3 actions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Net Worth */}
        <NetWorthCard />
      </div>

      {/* Row 2: Income vs Expense Chart */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white text-sm mb-4">
          Income vs Expenses
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2FE6FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2FE6FF" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A3CFF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7A3CFF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#9AA6BF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9AA6BF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "#121828",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#F2F5FF",
                fontSize: "12px",
              }}
              formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#2FE6FF"
              strokeWidth={2}
              fill="url(#incGrad)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#7A3CFF"
              strokeWidth={2}
              fill="url(#expGrad)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "#9AA6BF" }}
          >
            <span
              className="w-3 h-0.5 inline-block rounded"
              style={{ background: "#2FE6FF" }}
            />{" "}
            Income
          </span>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "#9AA6BF" }}
          >
            <span
              className="w-3 h-0.5 inline-block rounded"
              style={{ background: "#7A3CFF" }}
            />{" "}
            Expenses
          </span>
        </div>
      </div>

      {/* Row 3: Smart Alerts + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Insights — spans 2 cols */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bot size={16} style={{ color: "#2FE6FF" }} />
            <h3 className="font-semibold text-white text-sm">
              Smart Alerts & AI Insights
            </h3>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(47,230,255,0.12)", color: "#2FE6FF" }}
            >
              4 insights
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.title} className={`${a.bgClass} p-3`}>
                <div className="flex items-start gap-2">
                  <a.icon
                    size={15}
                    style={{ color: a.color, marginTop: 1, flexShrink: 0 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-xs mb-0.5">
                      {a.title}
                    </div>
                    <div
                      className="text-xs mb-2"
                      style={{ color: "#9AA6BF", lineHeight: 1.4 }}
                    >
                      {a.desc}
                    </div>
                    {a.action && a.page && (
                      <button
                        type="button"
                        onClick={() => setActivePage(a.page!)}
                        className="flex items-center gap-1 text-xs font-semibold"
                        style={{ color: a.color }}
                        data-ocid={`dashboard.${a.page}_button`}
                      >
                        {a.action} <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-2 text-xs text-center"
            style={{ color: "#9AA6BF" }}
          >
            For informational purposes only · Not personalized financial advice
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white text-sm mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                {
                  icon: Upload,
                  label: "Upload Policy",
                  page: "insurance" as SidebarPage,
                  color: "#2FE6FF",
                },
                {
                  icon: Plus,
                  label: "Add Investment",
                  page: "investments" as SidebarPage,
                  color: "#2D7BFF",
                },
                {
                  icon: TrendingUp,
                  label: "View Portfolio",
                  page: "investments" as SidebarPage,
                  color: "#7A3CFF",
                },
              ].map((qa) => (
                <button
                  type="button"
                  key={qa.label}
                  onClick={() => setActivePage(qa.page)}
                  className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: `${qa.color}12`,
                    border: `1px solid ${qa.color}25`,
                    color: "#F2F5FF",
                  }}
                  data-ocid={`dashboard.${qa.label.toLowerCase().replace(/\s/g, "_")}_button`}
                >
                  <qa.icon size={16} style={{ color: qa.color }} />
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex items-start gap-2 p-3 rounded-xl"
            style={{
              background: "rgba(251,191,36,0.05)",
              border: "1px solid rgba(251,191,36,0.15)",
            }}
          >
            <Info
              size={14}
              style={{ color: "#FBCE24", marginTop: 2, flexShrink: 0 }}
            />
            <p
              className="text-xs"
              style={{ color: "#9AA6BF", lineHeight: 1.5 }}
            >
              All insights are based on available data and assumptions. Not
              personalized financial advice.
            </p>
          </div>
        </div>
      </div>

      {/* Smart Recommendation Strip */}
      <div>
        <h3 className="font-semibold text-white text-sm mb-3">
          Recommended Next Steps
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {recommendations.map((r) => (
            <div
              key={r.title}
              className="glass-card-hover p-5 flex items-center gap-4"
              style={{ background: "rgba(18,24,42,0.65)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${r.color}18`,
                  border: `1px solid ${r.color}30`,
                }}
              >
                <r.icon size={18} style={{ color: r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">
                  {r.title}
                </div>
                <div className="text-xs" style={{ color: "#9AA6BF" }}>
                  {r.desc}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePage(r.page)}
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${r.color}18`, color: r.color }}
                data-ocid={`dashboard.recommend_${r.page}_button`}
              >
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
