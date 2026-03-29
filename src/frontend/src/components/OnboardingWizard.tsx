import { ChevronRight, Shield, Target, TrendingUp, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type RiskProfile = "Conservative" | "Balanced" | "Aggressive";

const GOALS = [
  "Retirement",
  "Home Purchase",
  "Child Education",
  "Emergency Fund",
  "Wealth Growth",
  "Travel",
];

const ALLOCATIONS: Record<
  RiskProfile,
  { Equity: number; Debt: number; Cash: number; Gold: number }
> = {
  Conservative: { Equity: 20, Debt: 50, Cash: 20, Gold: 10 },
  Balanced: { Equity: 50, Debt: 25, Cash: 15, Gold: 10 },
  Aggressive: { Equity: 70, Debt: 15, Cash: 10, Gold: 5 },
};

const ALLOC_COLORS = {
  Equity: "#B8FF4A",
  Debt: "#4AB8FF",
  Cash: "#FFD74A",
  Gold: "#FF9A4A",
};

interface OnboardingWizardProps {
  onComplete: (data: {
    income: number;
    riskProfile: RiskProfile;
    goals: string[];
  }) => void;
}

export default function OnboardingWizard({
  onComplete,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (g: string) =>
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const canProceedStep1 =
    income !== "" &&
    Number(income) > 0 &&
    riskProfile !== null &&
    selectedGoals.length > 0;

  const allocation = riskProfile
    ? ALLOCATIONS[riskProfile]
    : ALLOCATIONS.Balanced;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(6,10,16,0.97)", backdropFilter: "blur(12px)" }}
      data-ocid="onboarding.modal"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-lg"
          style={{
            background: "linear-gradient(135deg, #0F141B 0%, #1A2332 100%)",
            border: "1px solid #24303A",
            borderRadius: 20,
            padding: 32,
          }}
        >
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background:
                      s === step
                        ? "#B8FF4A"
                        : s < step
                          ? "rgba(184,255,74,0.2)"
                          : "rgba(255,255,255,0.05)",
                    color:
                      s === step ? "#060A10" : s < step ? "#B8FF4A" : "#9AA6B2",
                    border: `1px solid ${s <= step ? "#B8FF4A" : "#24303A"}`,
                  }}
                  data-ocid={`onboarding.step_${s}.button`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className="w-10 h-px"
                    style={{ background: s < step ? "#B8FF4A" : "#24303A" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} style={{ color: "#B8FF4A" }} />
                <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
                  Welcome to FinPulse
                </h2>
              </div>
              <p className="text-sm mb-6" style={{ color: "#9AA6B2" }}>
                Tell us about yourself to personalise your experience
              </p>

              <div className="mb-5">
                <label
                  htmlFor="onboarding-income"
                  className="block text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: "#9AA6B2" }}
                >
                  Monthly Income (₹)
                </label>
                <input
                  id="onboarding-income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 75000"
                  className="dark-input w-full"
                  data-ocid="onboarding.income.input"
                  style={{
                    background: "#0F141B",
                    border: "1px solid #24303A",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#EAF0F6",
                    fontSize: 14,
                    outline: "none",
                    width: "100%",
                  }}
                />
              </div>

              <div className="mb-5">
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-wide"
                  style={{ color: "#9AA6B2" }}
                >
                  Risk Appetite
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(
                    ["Conservative", "Balanced", "Aggressive"] as RiskProfile[]
                  ).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRiskProfile(r)}
                      data-ocid={`onboarding.risk_${r.toLowerCase()}.button`}
                      className="px-5 py-2 rounded-full text-sm font-semibold transition-all flex-1"
                      style={{
                        background:
                          riskProfile === r
                            ? "#B8FF4A"
                            : "rgba(255,255,255,0.05)",
                        color: riskProfile === r ? "#060A10" : "#9AA6B2",
                        border: `1px solid ${riskProfile === r ? "#B8FF4A" : "#24303A"}`,
                      }}
                    >
                      {r === "Conservative"
                        ? "🛡️"
                        : r === "Balanced"
                          ? "⚖️"
                          : "🚀"}{" "}
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p
                  className="text-xs font-semibold mb-3 uppercase tracking-wide"
                  style={{ color: "#9AA6B2" }}
                >
                  Financial Goals (select all that apply)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGoal(g)}
                      data-ocid={`onboarding.goal_${g.toLowerCase().replace(/ /g, "_")}.button`}
                      className="px-3 py-2 rounded-xl text-xs font-medium transition-all text-left"
                      style={{
                        background: selectedGoals.includes(g)
                          ? "rgba(184,255,74,0.12)"
                          : "rgba(255,255,255,0.03)",
                        color: selectedGoals.includes(g)
                          ? "#B8FF4A"
                          : "#9AA6B2",
                        border: `1px solid ${selectedGoals.includes(g) ? "rgba(184,255,74,0.4)" : "#24303A"}`,
                      }}
                    >
                      {selectedGoals.includes(g) ? "✓ " : ""}
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                data-ocid="onboarding.next_step1.button"
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: canProceedStep1
                    ? "#B8FF4A"
                    : "rgba(184,255,74,0.2)",
                  color: canProceedStep1 ? "#060A10" : "#4A5568",
                  cursor: canProceedStep1 ? "pointer" : "not-allowed",
                }}
              >
                Next: See Your Allocation <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} style={{ color: "#B8FF4A" }} />
                <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
                  Suggested Allocation
                </h2>
              </div>
              <p className="text-sm mb-1" style={{ color: "#9AA6B2" }}>
                Based on your{" "}
                <span style={{ color: "#B8FF4A" }}>{riskProfile}</span> profile
              </p>
              <p className="text-xs mb-6" style={{ color: "#4A5568" }}>
                This is a suggested starting allocation. You can customize in
                your portfolio.
              </p>

              <div className="space-y-3 mb-6">
                {(
                  Object.entries(allocation) as [
                    keyof typeof allocation,
                    number,
                  ][]
                ).map(([asset, pct]) => (
                  <div key={asset}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: ALLOC_COLORS[asset] }}>
                        {asset}
                      </span>
                      <span style={{ color: "#EAF0F6", fontWeight: 700 }}>
                        {pct}%
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: "#0F141B" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: 0.1,
                        }}
                        className="h-full rounded-full"
                        style={{ background: ALLOC_COLORS[asset] }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="p-3 rounded-xl mb-6"
                style={{
                  background: "rgba(184,255,74,0.06)",
                  border: "1px solid rgba(184,255,74,0.15)",
                }}
              >
                <p className="text-xs" style={{ color: "#9AA6B2" }}>
                  💡 <span style={{ color: "#B8FF4A" }}>Pro tip:</span> Review
                  and rebalance your portfolio every 6 months to stay aligned
                  with your goals.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  data-ocid="onboarding.back_step2.button"
                  className="px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#9AA6B2",
                    border: "1px solid #24303A",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  data-ocid="onboarding.next_step2.button"
                  className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: "#B8FF4A", color: "#060A10" }}
                >
                  Looks Good! <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-5xl mb-4"
              >
                🎯
              </motion.div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "#EAF0F6" }}
              >
                You're all set!
              </h2>
              <p className="text-sm mb-2" style={{ color: "#9AA6B2" }}>
                Your personalised FinPulse dashboard is ready.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {selectedGoals.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(184,255,74,0.12)",
                      color: "#B8FF4A",
                      border: "1px solid rgba(184,255,74,0.3)",
                    }}
                  >
                    <Target size={10} className="inline mr-1" />
                    {g}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: "#0F141B", border: "1px solid #24303A" }}
                >
                  <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                    Monthly Income
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "#B8FF4A" }}
                  >
                    ₹{Number(income).toLocaleString("en-IN")}
                  </div>
                </div>
                <div
                  className="p-3 rounded-xl"
                  style={{ background: "#0F141B", border: "1px solid #24303A" }}
                >
                  <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                    Risk Profile
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "#B8FF4A" }}
                  >
                    {riskProfile}
                  </div>
                </div>
                <div
                  className="p-3 rounded-xl"
                  style={{ background: "#0F141B", border: "1px solid #24303A" }}
                >
                  <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                    Goals
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "#B8FF4A" }}
                  >
                    {selectedGoals.length} Set
                  </div>
                </div>
              </div>
              <div
                className="flex items-start gap-2 p-3 rounded-xl mb-6"
                style={{
                  background: "rgba(255,190,10,0.07)",
                  border: "1px solid rgba(255,190,10,0.2)",
                }}
              >
                <Shield
                  size={14}
                  style={{ color: "#FFBE0B", flexShrink: 0, marginTop: 2 }}
                />
                <p className="text-xs text-left" style={{ color: "#9AA6B2" }}>
                  For educational purposes only. Not investment advice.
                  Investments are subject to market risks.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onComplete({
                    income: Number(income),
                    riskProfile: riskProfile!,
                    goals: selectedGoals,
                  })
                }
                data-ocid="onboarding.dashboard.button"
                className="w-full py-3 rounded-xl text-sm font-bold"
                style={{ background: "#B8FF4A", color: "#060A10" }}
              >
                🚀 Go to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
