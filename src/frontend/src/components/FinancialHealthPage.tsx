import { CheckCircle, Info, TrendingUp } from "lucide-react";

const dimensions = [
  {
    label: "Savings Rate",
    score: 80,
    color: "#2FE6FF",
    tip: "You save 38% of income. Target is 30%+. Keep it up!",
  },
  {
    label: "Goal Progress",
    score: 65,
    color: "#2D7BFF",
    tip: "You have goals set but 35% gap to target. Add more savings.",
  },
  {
    label: "Risk Alignment",
    score: 70,
    color: "#7A3CFF",
    tip: "Portfolio risk matches your moderate risk profile.",
  },
  {
    label: "Tool Activity",
    score: 55,
    color: "#B05CFF",
    tip: "Use financial tools regularly to stay on track.",
  },
  {
    label: "Investment Mix",
    score: 75,
    color: "#31E981",
    tip: "Good diversification across equity and debt instruments.",
  },
];

const tips = [
  "Increase monthly SIP by ₹2,000 to improve investment score.",
  "Review your insurance coverage annually.",
  "Optimize deductions under Section 80C to reduce tax liability.",
  "Build a 6-month emergency fund if not already done.",
];

export default function FinancialHealthPage() {
  const overall = Math.round(
    dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length,
  );
  const scoreColor =
    overall >= 75 ? "#31E981" : overall >= 50 ? "#FBCE24" : "#F87171";

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Financial Health
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          Your comprehensive financial wellness breakdown.
        </p>
      </div>

      {/* Overall score */}
      <div className="glass-card p-6 flex items-center gap-6">
        <div className="text-center">
          <div
            className="text-5xl font-extrabold"
            style={{
              color: scoreColor,
              fontFamily: "Bricolage Grotesque, sans-serif",
            }}
          >
            {overall}
          </div>
          <div className="text-xs mt-1" style={{ color: "#9AA6BF" }}>
            out of 100
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold text-white mb-1">
            FinHealth Score
          </div>
          <div className="text-sm mb-2" style={{ color: "#9AA6BF" }}>
            Based on 5 financial dimensions
          </div>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{
              background: `${scoreColor}18`,
              color: scoreColor,
              fontWeight: 600,
            }}
          >
            {overall >= 75
              ? "✓ Good Shape"
              : overall >= 50
                ? "⚠ Needs Attention"
                : "✗ At Risk"}
          </span>
        </div>
      </div>

      {/* Dimensions */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4">Score Breakdown</h3>
        <div className="space-y-5">
          {dimensions.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  {d.label}
                </span>
                <span className="font-bold text-sm" style={{ color: d.color }}>
                  {d.score}/100
                </span>
              </div>
              <div className="progress-bar mb-2">
                <div
                  className="progress-fill"
                  style={{
                    width: `${d.score}%`,
                    background: `linear-gradient(90deg, ${d.color}, ${d.color}88)`,
                  }}
                />
              </div>
              <div className="flex items-start gap-1.5">
                <Info
                  size={12}
                  style={{ color: "#9AA6BF", marginTop: 2, flexShrink: 0 }}
                />
                <p className="text-xs" style={{ color: "#9AA6BF" }}>
                  {d.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement tips */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: "#2FE6FF" }} />
          <h3 className="font-semibold text-white">Improvement Tips</h3>
        </div>
        <div className="space-y-3">
          {tips.map((t) => (
            <div
              key={t}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(47,230,255,0.05)",
                border: "1px solid rgba(47,230,255,0.1)",
              }}
            >
              <CheckCircle
                size={15}
                style={{ color: "#2FE6FF", marginTop: 1, flexShrink: 0 }}
              />
              <p className="text-sm" style={{ color: "#F2F5FF" }}>
                {t}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: "#9AA6BF" }}>
          For informational purposes only. Not personalized financial advice.
        </p>
      </div>
    </div>
  );
}
