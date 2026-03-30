import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronRight,
  Info,
  Lock,
  Pin,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

interface Props {
  userId: string;
  userProfile: {
    name?: string;
    income?: number;
    savings?: number;
    goals?: string[];
    riskProfile?: string;
    plan?: string;
  } | null;
  equityPct: number;
  totalAssets: number;
  setActiveTab: (tab: string) => void;
  setToolsSubTab: (tab: string) => void;
  setAnalysisSubTab: (tab: string) => void;
  isLoading?: boolean;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function calcSavingsScore(income?: number, savings?: number): number {
  if (!income || income === 0) return 10;
  const ratio = (savings ?? 0) / income;
  if (ratio > 0.3) return 20;
  if (ratio >= 0.2) return 15;
  return 10;
}

function calcGoalScore(goals?: string[]): number {
  if (!goals || goals.length === 0) return 5;
  if (goals.length <= 2) return 15;
  return 20;
}

function calcRiskScore(riskProfile?: string, equityPct?: number): number {
  if (!riskProfile || equityPct === undefined) return 10;
  const ep = equityPct;
  const rp = riskProfile.toLowerCase();
  if (rp === "low" && ep <= 40) return 20;
  if (rp === "medium" && ep >= 30 && ep <= 70) return 20;
  if (rp === "high" && ep >= 50) return 20;
  return 10;
}

function calcActivityScore(userId: string): number {
  try {
    const raw = localStorage.getItem(`finhealth_events_${userId}`);
    if (!raw) return 5;
    const events: {
      eventType: string;
      toolName?: string;
      timestamp?: number;
    }[] = JSON.parse(raw);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = events.filter((e) => (e.timestamp ?? 0) > thirtyDaysAgo);
    if (recent.length === 0) return 5;
    if (recent.length <= 3) return 10;
    if (recent.length <= 7) return 15;
    return 20;
  } catch {
    return 5;
  }
}

function calcInvestmentScore(
  userId: string,
  totalAssets: number,
  equityPct: number,
): number {
  try {
    const raw = localStorage.getItem(`finhealth_events_${userId}`);
    let base = 5;
    if (raw) {
      const events: { toolName?: string }[] = JSON.parse(raw);
      const keywords = ["sip", "goal-planner", "investment", "ulip"];
      const found = events.some((e) =>
        keywords.some((k) => (e.toolName ?? "").toLowerCase().includes(k)),
      );
      if (found) base = 20;
    }
    if (base < 20 && totalAssets > 0 && equityPct > 10)
      base = Math.min(base + 5, 20);
    return base;
  } catch {
    return 5;
  }
}

const SCORE_DIMS: [string, keyof ReturnType<typeof buildScores>][] = [
  ["Savings", "savings"],
  ["Goals", "goals"],
  ["Risk", "risk"],
  ["Activity", "activity"],
  ["Invest", "investment"],
];

function buildScores(
  userProfile: Props["userProfile"],
  equityPct: number,
  totalAssets: number,
  userId: string,
) {
  const savings = calcSavingsScore(userProfile?.income, userProfile?.savings);
  const goals = calcGoalScore(userProfile?.goals);
  const risk = calcRiskScore(userProfile?.riskProfile, equityPct);
  const activity = calcActivityScore(userId);
  const investment = calcInvestmentScore(userId, totalAssets, equityPct);
  const total = savings + goals + risk + activity + investment;
  return { savings, goals, risk, activity, investment, total };
}

const MOCK_PCTS = [20, 35, 60, 75];
const TARGET_AMOUNT = 500000;

function loadPinnedInsights(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`finhealth_pinned_${userId}`);
    if (raw) return JSON.parse(raw) as string[];
  } catch {}
  return [];
}

function savePinnedInsights(userId: string, pins: string[]) {
  localStorage.setItem(`finhealth_pinned_${userId}`, JSON.stringify(pins));
}

// Loading skeleton for the panel
function PanelSkeleton() {
  return (
    <div className="mb-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl"
          style={{
            background: "#0F141B",
            border: "1px solid rgba(184,255,74,0.15)",
          }}
        >
          <Skeleton
            className="h-4 w-32 mb-4"
            style={{ background: "#1A2030" }}
          />
          <Skeleton className="h-16 w-full" style={{ background: "#1A2030" }} />
        </div>
      ))}
    </div>
  );
}

export default function FinancialIntelligencePanel({
  userId,
  userProfile,
  equityPct,
  totalAssets,
  setActiveTab,
  setToolsSubTab,
  setAnalysisSubTab,
  isLoading = false,
}: Props) {
  const [pinnedInsights, setPinnedInsights] = useState<string[]>(() =>
    loadPinnedInsights(userId),
  );
  const [scoreError, setScoreError] = useState(false);

  const scores = useMemo(() => {
    try {
      return buildScores(userProfile, equityPct, totalAssets, userId);
    } catch {
      setScoreError(true);
      return {
        savings: 0,
        goals: 0,
        risk: 0,
        activity: 0,
        investment: 0,
        total: 0,
      };
    }
  }, [userId, userProfile, equityPct, totalAssets]);

  const scoreColor =
    scores.total < 50 ? "#FF4A4A" : scores.total <= 75 ? "#FFB84A" : "#B8FF4A";
  const scoreLabel =
    scores.total < 50
      ? "Needs Attention"
      : scores.total <= 75
        ? "Good"
        : "Excellent";

  const plan = userProfile?.plan ?? "free";
  const income = userProfile?.income ?? 0;
  const savings = userProfile?.savings ?? 0;
  const goals = userProfile?.goals ?? [];

  // Money loss
  let moneyLossNode: React.ReactNode = null;
  if (totalAssets > 0 && equityPct < 30) {
    const lossPerYear = totalAssets * 0.06;
    moneyLossNode = (
      <p className="text-sm" style={{ color: "#FF4A4A" }}>
        You are losing approximately{" "}
        <span className="font-bold">{formatINR(lossPerYear)}/year</span> due to
        low-return investments
      </p>
    );
  } else if (totalAssets === 0) {
    const r = 0.01;
    const n = 120;
    const sipGrowth = 5000 * (((1 + r) ** n - 1) / r) * (1 + r);
    moneyLossNode = (
      <p className="text-sm" style={{ color: "#FFB84A" }}>
        No investments detected. If you invested ₹5,000/month in SIP, you&apos;d
        grow <span className="font-bold">{formatINR(sipGrowth)}</span> in 10
        years
      </p>
    );
  } else {
    moneyLossNode = (
      <p className="text-sm" style={{ color: "#B8FF4A" }}>
        ✓ Your portfolio is on a healthy growth track
      </p>
    );
  }

  // Alerts
  const alerts: { type: "amber" | "blue" | "green"; message: string }[] = [];
  if (equityPct > 70)
    alerts.push({
      type: "amber",
      message: "Your portfolio is too aggressive — equity is too high",
    });
  if (income > 0 && savings / income < 0.2)
    alerts.push({
      type: "amber",
      message:
        "Increase your savings rate — you're saving less than 20% of income",
    });
  if (goals.length === 0)
    alerts.push({
      type: "blue",
      message: "Set financial goals — use Goal Planner to get started",
    });
  if (alerts.length === 0)
    alerts.push({
      type: "green",
      message: "All clear — your portfolio health looks good!",
    });

  const firstAlert = alerts[0];

  const pinInsight = (msg: string) => {
    const updated = pinnedInsights.includes(msg)
      ? pinnedInsights
      : [...pinnedInsights, msg];
    setPinnedInsights(updated);
    savePinnedInsights(userId, updated);
  };

  const unpinInsight = (msg: string) => {
    const updated = pinnedInsights.filter((p) => p !== msg);
    setPinnedInsights(updated);
    savePinnedInsights(userId, updated);
  };

  const cardStyle = {
    background: "#0F141B",
    border: "1px solid rgba(184,255,74,0.15)",
    borderRadius: "1rem",
  };

  if (isLoading) return <PanelSkeleton />;

  return (
    <div className="mb-6 space-y-4" data-ocid="financial.intelligence.panel">
      {/* DASHBOARD SUMMARY CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6"
        style={{
          background: "linear-gradient(135deg, #0F141B 0%, #0A1408 100%)",
          border: `2px solid ${scoreColor}44`,
          borderRadius: "1rem",
          boxShadow: `0 0 32px ${scoreColor}18`,
        }}
        data-ocid="dashboard.summary.card"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Score circle */}
          <div
            className="relative flex items-center justify-center rounded-full shrink-0"
            style={{
              width: 100,
              height: 100,
              background: `conic-gradient(${scoreColor} ${scores.total * 3.6}deg, #1A2030 0deg)`,
              boxShadow: `0 0 24px ${scoreColor}44`,
            }}
          >
            <div
              className="flex flex-col items-center justify-center rounded-full"
              style={{ width: 76, height: 76, background: "#0F141B" }}
            >
              {scoreError ? (
                <span className="text-xs" style={{ color: "#FF4A4A" }}>
                  Error
                </span>
              ) : (
                <>
                  <span
                    className="text-2xl font-black"
                    style={{ color: scoreColor }}
                  >
                    {scores.total}
                  </span>
                  <span className="text-xs" style={{ color: "#7A8A9A" }}>
                    /100
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
              <span className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
                FinHealth Score
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: `${scoreColor}22`, color: scoreColor }}
              >
                {scoreLabel}
              </span>
            </div>

            {scoreError ? (
              <p className="text-xs mb-3" style={{ color: "#FF4A4A" }}>
                Unable to load score. Please try again.
              </p>
            ) : (
              <p className="text-xs mb-3" style={{ color: "#7A8A9A" }}>
                Your overall financial health index
              </p>
            )}

            {/* Key alert */}
            <div
              className="flex items-center gap-2 text-xs mb-3 px-3 py-2 rounded-lg"
              style={{
                background:
                  firstAlert.type === "green"
                    ? "rgba(184,255,74,0.08)"
                    : firstAlert.type === "amber"
                      ? "rgba(255,184,74,0.08)"
                      : "rgba(74,144,255,0.08)",
                border: `1px solid ${
                  firstAlert.type === "green"
                    ? "rgba(184,255,74,0.25)"
                    : firstAlert.type === "amber"
                      ? "rgba(255,184,74,0.25)"
                      : "rgba(74,144,255,0.25)"
                }`,
                color:
                  firstAlert.type === "green"
                    ? "#B8FF4A"
                    : firstAlert.type === "amber"
                      ? "#FFB84A"
                      : "#4A90FF",
                maxWidth: 320,
              }}
            >
              {firstAlert.type === "green" ? (
                <CheckCircle size={12} />
              ) : firstAlert.type === "amber" ? (
                <AlertTriangle size={12} />
              ) : (
                <Info size={12} />
              )}
              {firstAlert.message}
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActiveTab("tools");
                setToolsSubTab("risk-profile");
              }}
              data-ocid="dashboard.summary.primary_button"
              style={{
                background: scoreColor,
                color: "#060A10",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ✨ Improve Score
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Section 1: FinHealth Score detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.04 }}
        style={cardStyle}
        className="p-6"
        data-ocid="finhealth.score.card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} style={{ color: "#B8FF4A" }} />
          <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
            Financial Health Index
          </span>
        </div>
        {totalAssets === 0 ? (
          <div
            className="flex flex-col items-center py-4 text-center"
            data-ocid="finhealth.score.empty_state"
          >
            <p className="text-2xl mb-2">💼</p>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "#EAF0F6" }}
            >
              Add your portfolio to get insights
            </p>
            <p className="text-xs mb-3" style={{ color: "#7A8A9A" }}>
              Your score improves as you add portfolio and set goals
            </p>
            <Button
              size="sm"
              onClick={() => setActiveTab("dashboard")}
              style={{ background: "#B8FF4A", color: "#060A10" }}
              data-ocid="finhealth.score.primary_button"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="relative flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 120,
                height: 120,
                background: `conic-gradient(${scoreColor} ${scores.total * 3.6}deg, #1A2030 0deg)`,
                boxShadow: `0 0 30px ${scoreColor}33`,
              }}
            >
              <div
                className="flex flex-col items-center justify-center rounded-full"
                style={{ width: 94, height: 94, background: "#0F141B" }}
              >
                <span
                  className="text-2xl font-black"
                  style={{ color: scoreColor }}
                >
                  {scores.total}
                </span>
                <span className="text-xs" style={{ color: "#7A8A9A" }}>
                  /100
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-lg font-bold"
                  style={{ color: "#EAF0F6" }}
                >
                  FinHealth Score
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${scoreColor}22`, color: scoreColor }}
                >
                  {scoreLabel}
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: "#7A8A9A" }}>
                Your Financial Health Index
              </p>
              <div className="grid grid-cols-5 gap-2">
                {SCORE_DIMS.map(([label, key]) => {
                  const val = scores[key];
                  return (
                    <div key={label} className="text-center">
                      <div
                        className="text-sm font-bold"
                        style={{
                          color:
                            val >= 15
                              ? "#B8FF4A"
                              : val >= 10
                                ? "#FFB84A"
                                : "#FF4A4A",
                        }}
                      >
                        {val}
                      </div>
                      <div className="text-xs" style={{ color: "#7A8A9A" }}>
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Section 2: Money Loss Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        style={cardStyle}
        className="p-6 relative overflow-hidden"
        data-ocid="money.loss.card"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown size={18} style={{ color: "#FF4A4A" }} />
          <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
            Money Loss Tracker
          </span>
        </div>
        {plan === "free" ? (
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none">
              <p className="text-sm" style={{ color: "#7A8A9A" }}>
                You are losing approximately ₹2,40,000/year due to low-return
                investments
              </p>
              <div
                className="mt-2 h-2 rounded-full"
                style={{ background: "#FF4A4A44", width: "60%" }}
              />
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
              style={{ background: "rgba(6,10,16,0.85)" }}
            >
              <Lock size={20} style={{ color: "#B8FF4A" }} className="mb-2" />
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#EAF0F6" }}
              >
                Upgrade to Pro to unlock full financial insights
              </p>
              <Button
                size="sm"
                className="mt-2"
                style={{ background: "#B8FF4A", color: "#060A10" }}
                onClick={() => alert("Coming soon!")}
                data-ocid="money.loss.upgrade.button"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        ) : (
          moneyLossNode
        )}
      </motion.div>

      {/* Section 3: Goal Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        style={cardStyle}
        className="p-6"
        data-ocid="goal.tracking.card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} style={{ color: "#B8FF4A" }} />
          <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
            Goal Tracking
          </span>
        </div>
        {goals.length === 0 ? (
          <div
            className="flex flex-col items-center py-4 text-center"
            data-ocid="goal.tracking.empty_state"
          >
            <p className="text-2xl mb-2">🎯</p>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "#EAF0F6" }}
            >
              Start your first financial goal
            </p>
            <p className="text-xs mb-3" style={{ color: "#7A8A9A" }}>
              Track retirement, education, home, and more
            </p>
            <Button
              size="sm"
              style={{ background: "#B8FF4A", color: "#060A10" }}
              onClick={() => {
                setActiveTab("tools");
                setToolsSubTab("goal-planner");
              }}
              data-ocid="goal.tracking.open_modal_button"
            >
              Open Goal Planner
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 4).map((goal, idx) => {
              const pct = MOCK_PCTS[idx % MOCK_PCTS.length];
              const saved = (pct / 100) * TARGET_AMOUNT;
              const gap = TARGET_AMOUNT - saved;
              return (
                <div key={goal} data-ocid={`goal.tracking.item.${idx + 1}`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: "#EAF0F6" }}>
                      {goal}
                    </span>
                    <span style={{ color: "#B8FF4A" }}>{pct}% complete</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="text-xs mt-1" style={{ color: "#7A8A9A" }}>
                    Gap: {formatINR(gap)} remaining
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Section 4: Smart Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        style={cardStyle}
        className="p-6"
        data-ocid="smart.alerts.card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} style={{ color: "#FFB84A" }} />
          <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
            Smart Alerts
          </span>
        </div>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.message}
              className="flex items-start gap-2 rounded-lg p-3 text-sm"
              style={{
                background:
                  alert.type === "amber"
                    ? "rgba(255,184,74,0.1)"
                    : alert.type === "blue"
                      ? "rgba(74,144,255,0.1)"
                      : "rgba(184,255,74,0.1)",
                borderLeft: `3px solid ${
                  alert.type === "amber"
                    ? "#FFB84A"
                    : alert.type === "blue"
                      ? "#4A90FF"
                      : "#B8FF4A"
                }`,
              }}
              data-ocid="smart.alerts.item.1"
            >
              {alert.type === "amber" ? (
                <AlertTriangle
                  size={14}
                  style={{ color: "#FFB84A", marginTop: 1, flexShrink: 0 }}
                />
              ) : alert.type === "blue" ? (
                <Info
                  size={14}
                  style={{ color: "#4A90FF", marginTop: 1, flexShrink: 0 }}
                />
              ) : (
                <CheckCircle
                  size={14}
                  style={{ color: "#B8FF4A", marginTop: 1, flexShrink: 0 }}
                />
              )}
              <span
                className="flex-1"
                style={{
                  color:
                    alert.type === "amber"
                      ? "#FFB84A"
                      : alert.type === "blue"
                        ? "#4A90FF"
                        : "#B8FF4A",
                }}
              >
                {alert.message}
              </span>
              {/* Pin button */}
              <button
                type="button"
                title="Pin this insight"
                onClick={() => pinInsight(alert.message)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: pinnedInsights.includes(alert.message)
                    ? "#B8FF4A"
                    : "#4A5568",
                  padding: 2,
                  flexShrink: 0,
                  transition: "color 0.2s",
                }}
                data-ocid="smart.alerts.toggle"
              >
                <Pin size={12} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 5: Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        style={cardStyle}
        className="p-6"
        data-ocid="action.buttons.card"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} style={{ color: "#B8FF4A" }} />
          <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
            Quick Actions
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Goal Planner",
              sub: "Set financial goals",
              color: "#B8FF4A",
              bg: "rgba(184,255,74,0.08)",
              border: "rgba(184,255,74,0.25)",
              ocid: "action.goal_planner.button",
              action: () => {
                setActiveTab("tools");
                setToolsSubTab("goal-planner");
              },
            },
            {
              label: "Policy Analyzer",
              sub: "Review insurance",
              color: "#FFB84A",
              bg: "rgba(255,184,74,0.08)",
              border: "rgba(255,184,74,0.25)",
              ocid: "action.policy_analyzer.button",
              action: () => {
                setActiveTab("tools");
                setToolsSubTab("policy-analyzer");
              },
            },
            {
              label: "SIP Calculator",
              sub: "Plan investments",
              color: "#4A90FF",
              bg: "rgba(74,144,255,0.08)",
              border: "rgba(74,144,255,0.25)",
              ocid: "action.sip_calculator.button",
              action: () => {
                setActiveTab("analysis");
                setAnalysisSubTab("sip-calculator");
              },
            },
            {
              label: "Analyze Policy",
              sub: "Check ULIP/policy returns",
              color: "#C74AFF",
              bg: "rgba(199,74,255,0.08)",
              border: "rgba(199,74,255,0.25)",
              ocid: "action.analyze_policy.button",
              action: () => {
                setActiveTab("tools");
                setToolsSubTab("policy-analyzer");
              },
            },
            {
              label: "Plan SIP",
              sub: "Start systematic investing",
              color: "#4AB8FF",
              bg: "rgba(74,184,255,0.08)",
              border: "rgba(74,184,255,0.25)",
              ocid: "action.plan_sip.button",
              action: () => {
                setActiveTab("analysis");
                setAnalysisSubTab("sip-calculator");
              },
            },
            {
              label: "Risk Profile",
              sub: "Know your risk tolerance",
              color: "#FF6B4A",
              bg: "rgba(255,107,74,0.08)",
              border: "rgba(255,107,74,0.25)",
              ocid: "action.risk_profile.button",
              action: () => {
                setActiveTab("tools");
                setToolsSubTab("risk-profile");
              },
            },
          ].map((item) => (
            <motion.button
              key={item.label}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={item.action}
              className="flex items-center justify-between rounded-xl p-4 text-left"
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              data-ocid={item.ocid}
            >
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: item.color }}
                >
                  {item.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#7A8A9A" }}>
                  {item.sub}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: item.color }} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Section 6: Pinned Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={cardStyle}
        className="p-6"
        data-ocid="pinned.insights.card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Pin size={16} style={{ color: "#B8FF4A" }} />
          <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
            Pinned Insights
          </span>
        </div>
        {pinnedInsights.length === 0 ? (
          <div
            className="flex flex-col items-center py-4 text-center"
            data-ocid="pinned.insights.empty_state"
          >
            <p className="text-lg mb-1">📌</p>
            <p className="text-sm" style={{ color: "#7A8A9A" }}>
              No pinned insights yet. Click 📌 on any alert to pin it.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pinnedInsights.map((msg) => (
              <div
                key={msg}
                className="flex items-center gap-2 rounded-lg p-3 text-sm"
                style={{
                  background: "rgba(184,255,74,0.06)",
                  border: "1px solid rgba(184,255,74,0.2)",
                }}
                data-ocid="pinned.insights.item.1"
              >
                <Pin size={12} style={{ color: "#B8FF4A", flexShrink: 0 }} />
                <span className="flex-1 text-xs" style={{ color: "#EAF0F6" }}>
                  {msg}
                </span>
                <button
                  type="button"
                  onClick={() => unpinInsight(msg)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4A5568",
                    padding: 2,
                    flexShrink: 0,
                    transition: "color 0.2s",
                  }}
                  data-ocid="pinned.insights.delete_button"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
