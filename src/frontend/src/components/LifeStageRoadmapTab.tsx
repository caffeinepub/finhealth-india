import {
  CheckCircle,
  Clock,
  Home,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
type EntryType = "Asset" | "Liability";
interface Entry {
  id: string;
  type: EntryType;
  category: Category;
  amount: number;
}

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000)
    return `${sign}\u20b9${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}\u20b9${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}\u20b9${(abs / 1_000).toFixed(1)}K`;
  return `${sign}\u20b9${abs.toLocaleString("en-IN")}`;
}

const STAGES = [
  { id: "emergency", name: "Emergency Fund", Icon: Home, color: "#B8FF4A" },
  { id: "insurance", name: "Insurance", Icon: Shield, color: "#4AB8FF" },
  { id: "debtfree", name: "Debt-Free", Icon: Zap, color: "#FFD74A" },
  { id: "wealth", name: "Wealth Building", Icon: TrendingUp, color: "#C74AFF" },
  { id: "retirement", name: "Retirement", Icon: CheckCircle, color: "#FF9A4A" },
];

export default function LifeStageRoadmapTab({ entries }: { entries: Entry[] }) {
  const [age, setAge] = useState(30);
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const assets = entries.filter((e) => e.type === "Asset");
  const totalAssets = assets.reduce((s, e) => s + e.amount, 0);
  const totalLiabilities = entries
    .filter((e) => e.type === "Liability")
    .reduce((s, e) => s + e.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  const income = Number.parseFloat(monthlyIncome) || 0;
  const monthlyExpenses = income * 0.6;
  const annualIncome = income * 12;
  const monthlySavings = income * 0.2;

  const cashAmt = assets
    .filter((e) => e.category === "Cash")
    .reduce((s, e) => s + e.amount, 0);
  const equityAmt = assets
    .filter((e) => e.category === "Equity")
    .reduce((s, e) => s + e.amount, 0);
  const mfAmt = assets
    .filter((e) => e.category === "Mutual Funds")
    .reduce((s, e) => s + e.amount, 0);
  const hasInsurance = entries.some(
    (e) => e.type === "Asset" && e.category === "Debt",
  );
  const liabRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0;
  const growthAssets = equityAmt + mfAmt;
  const growthPct = totalAssets > 0 ? growthAssets / totalAssets : 0;
  const r25Corpus = annualIncome * 25;

  const emergencyTarget = monthlyExpenses * 6;
  const stages = [
    {
      id: "emergency",
      done: emergencyTarget > 0 && cashAmt >= emergencyTarget,
      tip:
        income > 0
          ? `Build ${formatINR(emergencyTarget)} emergency fund (6\u00d7 monthly expenses). You have ${formatINR(cashAmt)} in cash.`
          : "Set your monthly income to get personalized guidance.",
      yearsToComplete:
        monthlySavings > 0
          ? Math.ceil(
              Math.max(0, emergencyTarget - cashAmt) / monthlySavings / 12,
            )
          : null,
    },
    {
      id: "insurance",
      done: hasInsurance,
      tip: hasInsurance
        ? "Good \u2014 you have coverage. Review your term + health cover annually."
        : "No insurance detected. Get term life cover (10\u201315\u00d7 annual income) and health insurance min \u20b910L.",
      yearsToComplete: hasInsurance ? 0 : null,
    },
    {
      id: "debtfree",
      done: liabRatio < 0.3,
      tip:
        liabRatio < 0.3
          ? `Excellent \u2014 liabilities are ${(liabRatio * 100).toFixed(0)}% of assets, below the 30% target.`
          : `Reduce liabilities by ${formatINR(Math.max(0, totalLiabilities - totalAssets * 0.3))} to reach 30% target.`,
      yearsToComplete:
        monthlySavings > 0 && liabRatio >= 0.3
          ? Math.ceil(
              Math.max(0, totalLiabilities - totalAssets * 0.3) /
                (monthlySavings * 12),
            )
          : null,
    },
    {
      id: "wealth",
      done: growthPct > 0.4,
      tip:
        growthPct > 0.4
          ? `Strong portfolio. Equity + MF is ${(growthPct * 100).toFixed(0)}% of assets.`
          : `Increase Equity + MF to 40%+ of assets. Need ${formatINR(Math.max(0, totalAssets * 0.4 - growthAssets))} more.`,
      yearsToComplete:
        monthlySavings > 0 && growthPct <= 0.4
          ? Math.ceil(
              Math.max(0, totalAssets * 0.4 - growthAssets) /
                (monthlySavings * 12),
            )
          : null,
    },
    {
      id: "retirement",
      done: annualIncome > 0 && netWorth >= r25Corpus,
      tip:
        annualIncome > 0
          ? netWorth >= r25Corpus
            ? `\ud83c\udf89 Retirement corpus achieved! Net worth (${formatINR(netWorth)}) exceeds 25\u00d7 annual income.`
            : `Need ${formatINR(Math.max(0, r25Corpus - netWorth))} more for \u20b9${formatINR(r25Corpus)} corpus (Rule of 25).`
          : "Set your monthly income to calculate your retirement target.",
      yearsToComplete:
        monthlySavings > 0 && annualIncome > 0 && netWorth < r25Corpus
          ? Math.ceil(Math.max(0, r25Corpus - netWorth) / (monthlySavings * 12))
          : null,
    },
  ];

  const firstIncompleteIdx = stages.findIndex((s) => !s.done);
  const currentStageIdx =
    firstIncompleteIdx === -1 ? stages.length - 1 : firstIncompleteIdx;

  return (
    <div className="space-y-6">
      <div className="fintech-card p-6">
        <h2
          className="text-base font-bold mb-1 flex items-center gap-2"
          style={{ color: "#EAF0F6" }}
        >
          <TrendingUp size={18} style={{ color: "#B8FF4A" }} />
          Life Stage Financial Roadmap
        </h2>
        <p className="text-xs mb-5" style={{ color: "#9AA6B2" }}>
          Personalized milestones based on your age and income. Track your
          financial journey stage by stage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div
              className="text-xs mb-1 flex justify-between"
              style={{ color: "#9AA6B2" }}
            >
              <span>Your Age</span>
              <span style={{ color: "#B8FF4A" }}>{age} years</span>
            </div>
            <input
              id="age-slider"
              type="range"
              min={20}
              max={65}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-[#B8FF4A]"
              data-ocid="lifestage.age.input"
              aria-label="Your age"
            />
          </div>
          <div>
            <label
              htmlFor="monthly-income"
              className="text-xs mb-1 block"
              style={{ color: "#9AA6B2" }}
            >
              Monthly Income (\u20b9)
            </label>
            <input
              id="monthly-income"
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 100000"
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{
                background: "#0F141B",
                border: "1px solid #24303A",
                color: "#EAF0F6",
                outline: "none",
              }}
              data-ocid="lifestage.income.input"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-6">
          <div
            className="absolute top-8 left-8 right-8 h-0.5"
            style={{ background: "#1F2A38" }}
          />
          <div
            className="absolute top-8 left-8 h-0.5 transition-all duration-700"
            style={{
              width: `${(currentStageIdx / (STAGES.length - 1)) * 80}%`,
              background: "#B8FF4A",
            }}
          />
          <div className="flex justify-between relative z-10">
            {STAGES.map((stage, idx) => {
              const stageData = stages[idx];
              const { Icon } = stage;
              const isDone = stageData.done;
              const isCurrent = idx === currentStageIdx;
              return (
                <div
                  key={stage.id}
                  className="flex flex-col items-center"
                  style={{ width: 64 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    style={{
                      background: isDone
                        ? stage.color
                        : isCurrent
                          ? `${stage.color}22`
                          : "#1F2A38",
                      border: `2px solid ${isDone ? stage.color : isCurrent ? stage.color : "#24303A"}`,
                    }}
                    animate={{ scale: isCurrent ? [1, 1.05, 1] : 1 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                  >
                    {isDone ? (
                      <CheckCircle size={20} style={{ color: "#060A10" }} />
                    ) : isCurrent ? (
                      <Icon size={20} style={{ color: stage.color }} />
                    ) : (
                      <Lock size={16} style={{ color: "#9AA6B2" }} />
                    )}
                  </motion.div>
                  <span
                    className="text-center leading-tight"
                    style={{
                      color: isDone
                        ? stage.color
                        : isCurrent
                          ? "#EAF0F6"
                          : "#9AA6B2",
                      fontSize: 9,
                    }}
                  >
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="p-4 rounded-xl mb-4"
          style={{
            background: `${STAGES[currentStageIdx].color}11`,
            border: `1px solid ${STAGES[currentStageIdx].color}44`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} style={{ color: STAGES[currentStageIdx].color }} />
            <span
              className="text-xs font-bold"
              style={{ color: STAGES[currentStageIdx].color }}
            >
              {firstIncompleteIdx === -1
                ? "All Milestones Complete! \ud83c\udf89"
                : `Current Stage: ${STAGES[currentStageIdx].name}`}
            </span>
          </div>
          <p className="text-xs" style={{ color: "#EAF0F6" }}>
            {stages[currentStageIdx].tip}
          </p>
          {stages[currentStageIdx].yearsToComplete !== null &&
            (stages[currentStageIdx].yearsToComplete ?? 0) > 0 && (
              <p className="text-xs mt-2" style={{ color: "#9AA6B2" }}>
                \ud83d\udcc5 At 20% savings rate, estimated completion:{" "}
                <span style={{ color: "#B8FF4A" }}>
                  {stages[currentStageIdx].yearsToComplete} years
                </span>
              </p>
            )}
        </div>

        <div className="space-y-2">
          {stages.map((s, idx) => (
            <div
              key={s.id}
              className="p-3 rounded-xl flex items-center gap-3"
              style={{ background: "#0F141B", border: "1px solid #24303A" }}
              data-ocid={`lifestage.item.${idx + 1}`}
            >
              {s.done ? (
                <CheckCircle size={16} style={{ color: "#B8FF4A" }} />
              ) : idx === currentStageIdx ? (
                <Clock size={16} style={{ color: STAGES[idx].color }} />
              ) : (
                <Lock size={16} style={{ color: "#9AA6B2" }} />
              )}
              <div className="flex-1">
                <div
                  className="text-xs font-semibold"
                  style={{ color: STAGES[idx].color }}
                >
                  {STAGES[idx].name}
                </div>
                <div className="text-xs" style={{ color: "#9AA6B2" }}>
                  {s.tip.slice(0, 80)}...
                </div>
              </div>
              {s.done && (
                <span className="text-xs" style={{ color: "#B8FF4A" }}>
                  \u2713 Done
                </span>
              )}
              {!s.done && s.yearsToComplete && (
                <span className="text-xs" style={{ color: "#9AA6B2" }}>
                  ~{s.yearsToComplete}yr
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
