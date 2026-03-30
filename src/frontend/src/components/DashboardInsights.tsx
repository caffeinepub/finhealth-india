import { Activity } from "lucide-react";
import { useMemo } from "react";
import type { TrackingEvent } from "../hooks/useUserTracking";

interface DashboardInsightsProps {
  userId: string;
  goalsCount: number;
  lastGoalsUpdate?: number;
}

function loadEvents(userId: string): TrackingEvent[] {
  try {
    const raw = localStorage.getItem(`finhealth_events_${userId}`);
    if (raw) return JSON.parse(raw) as TrackingEvent[];
  } catch {}
  return [];
}

export default function DashboardInsights({
  userId,
  goalsCount,
  lastGoalsUpdate,
}: DashboardInsightsProps) {
  const insights = useMemo(() => {
    const now = Date.now();
    const sevenDaysCutoff = now - 7 * 24 * 60 * 60 * 1000;
    const threeDaysCutoff = now - 3 * 24 * 60 * 60 * 1000;
    const events = loadEvents(userId);
    const recentWeek = events.filter((e) => e.timestamp >= sevenDaysCutoff);
    const recentThreeDays = events.filter(
      (e) => e.timestamp >= threeDaysCutoff,
    );

    const policyCount = recentWeek.filter(
      (e) => e.eventType === "tool_used" && e.toolName === "policy-analyzer",
    ).length;
    const goalPlannerCount = recentWeek.filter(
      (e) => e.eventType === "tool_used" && e.toolName === "goal-planner",
    ).length;
    const anyToolRecent = recentThreeDays.some(
      (e) => e.eventType === "tool_used",
    );

    const result: {
      key: string;
      icon: string;
      text: string;
      color: string;
      bg: string;
      border: string;
    }[] = [];

    if (policyCount > 0) {
      result.push({
        key: "policy",
        icon: "📋",
        text: `You used Policy Analyzer ${policyCount} ${policyCount === 1 ? "time" : "times"} this week`,
        color: "#B8FF4A",
        bg: "rgba(184,255,74,0.06)",
        border: "rgba(184,255,74,0.2)",
      });
    }

    if (goalPlannerCount > 0) {
      result.push({
        key: "goal-planner",
        icon: "🎯",
        text: `You used Goal Planner ${goalPlannerCount} ${goalPlannerCount === 1 ? "time" : "times"} this week`,
        color: "#B8FF4A",
        bg: "rgba(184,255,74,0.06)",
        border: "rgba(184,255,74,0.2)",
      });
    }

    if (!anyToolRecent && recentWeek.length === 0) {
      result.push({
        key: "no-tools",
        icon: "🔍",
        text: "You haven't explored any tools recently. Try the Policy Analyzer or SIP Calculator.",
        color: "#9AA6B2",
        bg: "rgba(74,184,255,0.06)",
        border: "rgba(74,184,255,0.2)",
      });
    }

    if (goalsCount === 0) {
      result.push({
        key: "no-goals",
        icon: "🎯",
        text: "You have no financial goals. Start with Goal Planner.",
        color: "#4AB8FF",
        bg: "rgba(74,184,255,0.08)",
        border: "rgba(74,184,255,0.25)",
      });
    } else if (
      lastGoalsUpdate &&
      now - lastGoalsUpdate > 7 * 24 * 60 * 60 * 1000
    ) {
      result.push({
        key: "goals-stale",
        icon: "📅",
        text: "You have not updated goals in 7 days. Review your Goal Planner.",
        color: "#FFBE0B",
        bg: "rgba(255,190,11,0.08)",
        border: "rgba(255,190,11,0.25)",
      });
    }

    if (result.length === 0) {
      result.push({
        key: "all-good",
        icon: "✅",
        text: "Keep up the great financial habits! You're actively using your tools.",
        color: "#B8FF4A",
        bg: "rgba(184,255,74,0.06)",
        border: "rgba(184,255,74,0.2)",
      });
    }

    return result.slice(0, 3);
  }, [userId, goalsCount, lastGoalsUpdate]);

  // Check if there are any real events at all
  const hasActivity = useMemo(() => {
    const events = loadEvents(userId);
    return events.length > 0;
  }, [userId]);

  return (
    <div
      className="fintech-card p-5 mb-6"
      data-ocid="dashboard.insights.panel"
      style={{ background: "#0F141B" }}
    >
      <h2
        className="text-sm font-bold mb-4 flex items-center gap-2"
        style={{ color: "#EAF0F6" }}
      >
        <span>📊</span>
        Activity Insights
      </h2>

      {!hasActivity ? (
        <div
          className="flex flex-col items-center justify-center py-6 text-center"
          data-ocid="dashboard.insights.empty_state"
        >
          <Activity size={32} style={{ color: "#24303A", marginBottom: 12 }} />
          <p
            className="text-sm font-semibold"
            style={{ color: "#EAF0F6", marginBottom: 4 }}
          >
            No activity yet
          </p>
          <p className="text-xs" style={{ color: "#7A8A9A" }}>
            Start using tools to see your activity insights here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((ins) => (
            <div
              key={ins.key}
              className="flex items-start gap-3 p-3 rounded-xl text-xs"
              data-ocid="dashboard.insights.item"
              style={{
                background: ins.bg,
                border: `1px solid ${ins.border}`,
              }}
            >
              <span>{ins.icon}</span>
              <span style={{ color: ins.color }}>{ins.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
