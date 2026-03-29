import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState } from "react";

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000)
    return `${sign}\u20b9${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}\u20b9${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}\u20b9${(abs / 1_000).toFixed(1)}K`;
  return `${sign}\u20b9${abs.toLocaleString("en-IN")}`;
}

const CARD = {
  background: "#0F141B",
  border: "1px solid #24303A",
  borderRadius: 14,
};

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  timeHorizon: number;
  inflationRate: number;
}

const LS_KEY = "finhealth_goals";

function calcGoal(goal: Goal, currentNetWorth: number) {
  const inflation = goal.inflationRate / 100;
  const adjustedAmount =
    goal.targetAmount * (1 + inflation) ** goal.timeHorizon;
  // Required SIP at 12% to reach adjusted amount
  const r = 0.12 / 12;
  const n = goal.timeHorizon * 12;
  const requiredSIP =
    n > 0
      ? (adjustedAmount * r) / (((1 + r) ** n - 1) * (1 + r))
      : adjustedAmount;
  const progressPct = Math.min(100, (currentNetWorth / adjustedAmount) * 100);
  return { adjustedAmount, requiredSIP, progressPct };
}

export default function GoalPlannerTab({
  entries,
}: { entries: { type: string; amount: number }[] }) {
  const uid = useId();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({
    name: "",
    targetAmount: 1000000,
    timeHorizon: 5,
    inflationRate: 6,
  });

  const currentNetWorth = entries.reduce(
    (s, e) => s + (e.type === "Asset" ? e.amount : -e.amount),
    0,
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setGoals(JSON.parse(raw));
    } catch {}
  }, []);

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  const addGoal = () => {
    if (!form.name.trim() || form.targetAmount <= 0 || form.timeHorizon <= 0)
      return;
    const newGoal: Goal = { id: `${uid}-${Date.now()}`, ...form };
    saveGoals([...goals, newGoal]);
    setForm({
      name: "",
      targetAmount: 1000000,
      timeHorizon: 5,
      inflationRate: 6,
    });
  };

  const deleteGoal = (id: string) =>
    saveGoals(goals.filter((g) => g.id !== id));

  const totalSIPRequired = goals.reduce(
    (s, g) => s + calcGoal(g, currentNetWorth).requiredSIP,
    0,
  );

  const GOAL_ICONS: Record<string, string> = {
    home: "🏠",
    car: "🚗",
    education: "🎓",
    retirement: "🌴",
    travel: "✈️",
    wedding: "💍",
  };
  function goalIcon(name: string) {
    const lower = name.toLowerCase();
    for (const [k, v] of Object.entries(GOAL_ICONS))
      if (lower.includes(k)) return v;
    return "🎯";
  }

  return (
    <div className="space-y-6" data-ocid="goal_planner.section">
      <div className="flex items-center gap-3 mb-2">
        <div
          style={{
            background: "linear-gradient(135deg, #B8FF4A22, #B8FF4A11)",
            border: "1px solid #B8FF4A44",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span style={{ fontSize: 20 }}>🎯</span>
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
            Goal Planner
          </h2>
          <p className="text-xs" style={{ color: "#9AA6B2" }}>
            Plan financial goals with inflation-adjusted SIP calculations
          </p>
        </div>
      </div>

      {/* Add Goal Form */}
      <div className="p-5 rounded-xl" style={CARD}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#EAF0F6" }}>
          Add New Goal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Goal Name
            </div>
            <input
              type="text"
              placeholder="e.g. Home Down Payment, Retirement..."
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="goal_planner.input"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Goal Amount (₹)
            </div>
            <input
              type="number"
              min={1000}
              step={10000}
              value={form.targetAmount}
              onChange={(e) =>
                setForm((p) => ({ ...p, targetAmount: Number(e.target.value) }))
              }
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="goal_planner.amount.input"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Time Horizon:{" "}
              <span style={{ color: "#B8FF4A" }}>{form.timeHorizon} yrs</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={form.timeHorizon}
              onChange={(e) =>
                setForm((p) => ({ ...p, timeHorizon: Number(e.target.value) }))
              }
              className="w-full accent-[#B8FF4A]"
              data-ocid="goal_planner.horizon.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>1yr</span>
              <span>30yrs</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Inflation Rate:{" "}
              <span style={{ color: "#FFD74A" }}>{form.inflationRate}%</span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={form.inflationRate}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  inflationRate: Number(e.target.value),
                }))
              }
              className="w-full accent-[#FFD74A]"
              data-ocid="goal_planner.inflation.input"
            />
            <div
              className="flex justify-between text-xs"
              style={{ color: "#4A5568" }}
            >
              <span>3%</span>
              <span>10%</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={addGoal}
          data-ocid="goal_planner.primary_button"
          className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: "#B8FF4A", color: "#060A10" }}
        >
          + Add Goal
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div
          className="p-10 rounded-xl text-center"
          style={CARD}
          data-ocid="goal_planner.empty_state"
        >
          <div className="text-3xl mb-3">🎯</div>
          <p className="text-sm" style={{ color: "#9AA6B2" }}>
            No goals added yet. Start by adding your first financial goal above.
          </p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {goals.map((goal, idx) => {
            const { adjustedAmount, requiredSIP, progressPct } = calcGoal(
              goal,
              currentNetWorth,
            );
            return (
              <motion.div
                key={goal.id}
                data-ocid={`goal_planner.item.${idx + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 rounded-xl"
                style={CARD}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goalIcon(goal.name)}</span>
                    <div>
                      <div className="font-bold" style={{ color: "#EAF0F6" }}>
                        {goal.name}
                      </div>
                      <div className="text-xs" style={{ color: "#9AA6B2" }}>
                        Target: {formatINR(goal.targetAmount)} in{" "}
                        {goal.timeHorizon} years
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteGoal(goal.id)}
                    data-ocid={`goal_planner.delete_button.${idx + 1}`}
                    className="text-xs px-3 py-1 rounded-lg"
                    style={{
                      color: "#FF4A4A",
                      background: "rgba(255,74,74,0.1)",
                      border: "1px solid rgba(255,74,74,0.2)",
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: "#060A10" }}
                  >
                    <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                      Inflation-Adjusted Target
                    </div>
                    <div className="font-bold" style={{ color: "#FFD74A" }}>
                      {formatINR(Math.round(adjustedAmount))}
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: "#060A10" }}
                  >
                    <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                      Required Monthly SIP
                    </div>
                    <div className="font-bold" style={{ color: "#B8FF4A" }}>
                      {formatINR(Math.round(requiredSIP))}/mo
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: "#060A10" }}
                  >
                    <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
                      Inflation Rate
                    </div>
                    <div className="font-bold" style={{ color: "#FF9A4A" }}>
                      {goal.inflationRate}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "#9AA6B2" }}>
                      Progress (Net Worth vs Adjusted Target)
                    </span>
                    <span style={{ color: "#B8FF4A" }}>
                      {progressPct.toFixed(1)}%
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
                          progressPct >= 80
                            ? "#B8FF4A"
                            : progressPct >= 40
                              ? "#FFD74A"
                              : "#FF9A4A",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Total Summary */}
      {goals.length > 0 && (
        <div
          className="p-5 rounded-xl"
          style={{ ...CARD, border: "1px solid #B8FF4A44" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{ color: "#9AA6B2" }}>
                Total Monthly SIP Required (all goals)
              </div>
              <div
                className="text-2xl font-bold mt-1"
                style={{ color: "#B8FF4A" }}
              >
                {formatINR(Math.round(totalSIPRequired))}/month
              </div>
            </div>
            <div className="text-3xl">📈</div>
          </div>
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
        ⚠️ For educational purposes only. SIP calculations assume 12% annual
        returns. Actual returns may vary.
      </p>
    </div>
  );
}
