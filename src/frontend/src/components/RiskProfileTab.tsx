import { motion } from "motion/react";
import { useEffect, useState } from "react";

type EntryType = "Asset" | "Liability";
type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
interface Entry {
  id: string;
  type: EntryType;
  category: Category;
  amount: number;
}

const CARD = {
  background: "#0F141B",
  border: "1px solid #24303A",
  borderRadius: 14,
};
const LS_KEY = "finhealth_risk_profile";

const QUESTIONS = [
  {
    q: "What is your investment horizon?",
    options: ["< 2 years", "2–5 years", "5+ years"],
  },
  {
    q: "If your portfolio drops 20%, you would:",
    options: [
      "Sell all to stop losses",
      "Hold and wait",
      "Buy more (opportunity)",
    ],
  },
  {
    q: "Your primary investment goal:",
    options: ["Capital protection", "Balanced growth", "Maximum returns"],
  },
  {
    q: "Your income stability:",
    options: [
      "Variable / freelance",
      "Moderate / semi-stable",
      "Stable / salaried",
    ],
  },
  {
    q: "Your emergency fund coverage:",
    options: [
      "< 3 months expenses",
      "3–6 months expenses",
      "6+ months expenses",
    ],
  },
];

const PROFILES = {
  Conservative: {
    icon: "🛡️",
    color: "#4AB8FF",
    allocation: { equity: 30, debt: 50, cash: 20, gold: 0 },
    description:
      "You prefer capital safety over high returns. Focus on FDs, debt funds, and liquid investments.",
  },
  Balanced: {
    icon: "⚖️",
    color: "#FFD74A",
    allocation: { equity: 50, debt: 30, cash: 10, gold: 10 },
    description:
      "You seek a balance of growth and stability. A mix of equity MFs, debt, and gold is ideal.",
  },
  Aggressive: {
    icon: "🚀",
    color: "#B8FF4A",
    allocation: { equity: 70, debt: 20, cash: 5, gold: 5 },
    description:
      "You're comfortable with volatility and seek maximum long-term growth. Focus on equity and MFs.",
  },
};

export default function RiskProfileTab({ entries }: { entries: Entry[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setAnswers(JSON.parse(raw));
    } catch {}
  }, []);

  const setAnswer = (qIdx: number, aIdx: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIdx] = aIdx;
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const allAnswered = answers.every((a) => a !== null);
  const totalScore: number = answers.reduce(
    (sum: number, a) => sum + ((a ?? 0) + 1),
    0,
  );
  const profileName: keyof typeof PROFILES =
    totalScore <= 8
      ? "Conservative"
      : totalScore <= 12
        ? "Balanced"
        : "Aggressive";
  const profile = PROFILES[profileName];

  // Portfolio allocation
  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const getCatPct = (cat: string) =>
    totalAssets > 0
      ? (assets
          .filter((e) => e.category === cat)
          .reduce((s, e) => s + e.amount, 0) /
          totalAssets) *
        100
      : 0;
  const actualEquity = getCatPct("Equity") + getCatPct("Mutual Funds");
  const actualDebt = getCatPct("Debt");
  const actualCash = getCatPct("Cash");

  const mismatches: { msg: string; color: string }[] = [];
  if (allAnswered && totalAssets > 0) {
    const recEquity = profile.allocation.equity;
    const recDebt = profile.allocation.debt;
    const recCash = profile.allocation.cash;
    if (Math.abs(actualEquity - recEquity) > 15)
      mismatches.push({
        msg: `Equity is ${actualEquity.toFixed(0)}%, recommended ${recEquity}% for ${profileName} profile`,
        color: actualEquity > recEquity ? "#FF4A4A" : "#FFD74A",
      });
    if (Math.abs(actualDebt - recDebt) > 15)
      mismatches.push({
        msg: `Debt is ${actualDebt.toFixed(0)}%, recommended ${recDebt}% for ${profileName} profile`,
        color: "#FFD74A",
      });
    if (Math.abs(actualCash - recCash) > 15)
      mismatches.push({
        msg: `Cash is ${actualCash.toFixed(0)}%, recommended ${recCash}% for ${profileName} profile`,
        color: "#4AB8FF",
      });
  }

  return (
    <div className="space-y-6" data-ocid="risk_profile.section">
      <div className="flex items-center gap-3 mb-2">
        <div
          style={{
            background: "linear-gradient(135deg, #4AB8FF22, #4AB8FF11)",
            border: "1px solid #4AB8FF44",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span style={{ fontSize: 20 }}>🧠</span>
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
            Risk Profile Engine
          </h2>
          <p className="text-xs" style={{ color: "#9AA6B2" }}>
            Discover your investor personality and detect portfolio mismatches
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS.map((q, qIdx) => (
          <div key={q.q} className="p-5 rounded-xl" style={CARD}>
            <div
              className="text-sm font-semibold mb-3"
              style={{ color: "#EAF0F6" }}
            >
              <span style={{ color: "#B8FF4A" }}>{qIdx + 1}. </span>
              {q.q}
            </div>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, aIdx) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswer(qIdx, aIdx)}
                  data-ocid={`risk_profile.q${qIdx + 1}.toggle`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: answers[qIdx] === aIdx ? "#B8FF4A" : "#0A0F15",
                    color: answers[qIdx] === aIdx ? "#060A10" : "#9AA6B2",
                    border: `1px solid ${answers[qIdx] === aIdx ? "#B8FF4A" : "#24303A"}`,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Profile Result */}
      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Profile Card */}
          <div
            className="p-6 rounded-xl"
            style={{ ...CARD, border: `1px solid ${profile.color}44` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{profile.icon}</span>
              <div>
                <div
                  className="text-xl font-black"
                  style={{ color: profile.color }}
                >
                  {profileName}
                </div>
                <div className="text-xs" style={{ color: "#9AA6B2" }}>
                  Investor Profile · Score: {totalScore}/15
                </div>
              </div>
            </div>
            <p
              className="text-sm"
              style={{ color: "#9AA6B2", lineHeight: 1.6 }}
            >
              {profile.description}
            </p>

            {/* Recommended Allocation */}
            <div className="mt-4">
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: "#9AA6B2" }}
              >
                Recommended Allocation
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    label: "Equity",
                    pct: profile.allocation.equity,
                    color: "#B8FF4A",
                  },
                  {
                    label: "Debt",
                    pct: profile.allocation.debt,
                    color: "#4AB8FF",
                  },
                  {
                    label: "Cash",
                    pct: profile.allocation.cash,
                    color: "#FFD74A",
                  },
                  {
                    label: "Gold",
                    pct: profile.allocation.gold,
                    color: "#FF9A4A",
                  },
                ].map((a) => (
                  <div
                    key={a.label}
                    className="text-center p-3 rounded-xl"
                    style={{
                      background: `${a.color}15`,
                      border: `1px solid ${a.color}33`,
                    }}
                  >
                    <div className="font-bold" style={{ color: a.color }}>
                      {a.pct}%
                    </div>
                    <div className="text-xs" style={{ color: "#9AA6B2" }}>
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mismatch Alerts */}
          {totalAssets > 0 && (
            <div className="p-5 rounded-xl" style={CARD}>
              <h3
                className="text-sm font-bold mb-3"
                style={{ color: "#EAF0F6" }}
              >
                Portfolio Mismatch Alerts
              </h3>
              {mismatches.length === 0 ? (
                <div
                  className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg"
                  style={{
                    background: "rgba(184,255,74,0.1)",
                    color: "#B8FF4A",
                    border: "1px solid rgba(184,255,74,0.3)",
                  }}
                >
                  ✓ Portfolio aligns with your {profileName} risk profile
                </div>
              ) : (
                <div className="space-y-2">
                  {mismatches.map((m) => (
                    <div
                      key={m.msg}
                      className="flex items-start gap-2 text-sm font-semibold px-3 py-2 rounded-lg"
                      data-ocid="risk_profile.mismatch.item"
                      style={{
                        background: `${m.color}18`,
                        color: m.color,
                        border: `1px solid ${m.color}33`,
                      }}
                    >
                      ⚠ {m.msg}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {!allAnswered && (
        <div className="p-5 rounded-xl text-center" style={CARD}>
          <p className="text-sm" style={{ color: "#9AA6B2" }}>
            Answer all {QUESTIONS.length} questions above to discover your risk
            profile.
          </p>
        </div>
      )}

      <p
        className="text-xs text-center px-4 py-3 rounded-xl"
        style={{
          color: "#9AA6B2",
          background: "#0F141B",
          border: "1px solid #24303A",
        }}
      >
        ⚠️ For educational purposes only. Risk profiling is indicative and not a
        substitute for financial advice.
      </p>
    </div>
  );
}
