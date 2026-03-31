import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  years: number;
}

function GoalPlanner() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Retirement Corpus",
      target: 30000000,
      saved: 2000000,
      years: 28,
    },
    {
      id: "2",
      name: "Child Education",
      target: 5000000,
      saved: 500000,
      years: 15,
    },
  ]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState(1000000);
  const [saved, setSaved] = useState(0);
  const [years, setYears] = useState(10);

  const addGoal = () => {
    if (!name) return;
    setGoals((g) => [
      ...g,
      { id: Date.now().toString(), name, target, saved, years },
    ]);
    setName("");
    setTarget(1000000);
    setSaved(0);
    setYears(10);
  };

  const monthly = (g: Goal) => {
    const r = 0.12 / 12;
    const n = g.years * 12;
    const remaining = g.target - g.saved * (1 + 0.12) ** g.years;
    return Math.max(0, (remaining * r) / ((1 + r) ** n - 1));
  };

  return (
    <div className="space-y-6">
      {/* Existing goals */}
      <div className="space-y-3">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          const m = monthly(g);
          return (
            <div
              key={g.id}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(18,24,42,0.6)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-white text-sm">{g.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#9AA6BF" }}>
                    {g.years} years • Target: ₹
                    {g.target.toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGoals((gs) => gs.filter((x) => x.id !== g.id))
                  }
                  style={{ color: "#9AA6BF" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="progress-bar mb-1">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#9AA6BF" }}>
                  {pct}% saved (₹{g.saved.toLocaleString("en-IN")})
                </span>
                <span style={{ color: "#2FE6FF", fontWeight: 600 }}>
                  Save ₹{Math.round(m).toLocaleString("en-IN")}/mo
                </span>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="text-center py-8" style={{ color: "#9AA6BF" }}>
            <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              No goals yet. Add your first financial goal below.
            </p>
          </div>
        )}
      </div>

      {/* Add goal form */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: "rgba(47,230,255,0.05)",
          border: "1px solid rgba(47,230,255,0.15)",
        }}
      >
        <div className="font-medium text-white text-sm mb-3">Add New Goal</div>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <div className="fin-label">Goal Name</div>
            <input
              className="fin-input"
              placeholder="e.g. Home Purchase"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div className="fin-label">Target Amount (₹)</div>
            <input
              type="number"
              className="fin-input"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>
          <div>
            <div className="fin-label">Amount Saved (₹)</div>
            <input
              type="number"
              className="fin-input"
              value={saved}
              onChange={(e) => setSaved(Number(e.target.value))}
            />
          </div>
          <div>
            <div className="fin-label">Time Horizon (years)</div>
            <input
              type="number"
              className="fin-input"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={addGoal}
          className="gradient-btn px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Goal
        </button>
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        Monthly savings estimate assumes 12% annual return. For informational
        purposes only.
      </p>
    </div>
  );
}

function RetirementPlanner() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthly, setMonthly] = useState(80000);
  const [existing, setExisting] = useState(500000);

  const years = retireAge - age;
  const lifeExp = 85;
  const retireYears = lifeExp - retireAge;
  const inflAdj = monthly * 12 * 1.06 ** years;
  const corpus = inflAdj * ((1 - (1 / 1.07) ** retireYears) / 0.07);
  const futureExisting = existing * 1.12 ** years;
  const remaining = Math.max(0, corpus - futureExisting);
  const r = 0.12 / 12;
  const n = years * 12;
  const sipNeeded = (remaining * r) / ((1 + r) ** n - 1);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["Current Age", age, setAge, 18, 60],
          ["Retirement Age", retireAge, setRetireAge, 40, 75],
          ["Monthly Expenses (₹)", monthly, setMonthly, 10000, 500000],
          ["Existing Savings (₹)", existing, setExisting, 0, 100000000],
        ].map(([l, v, s, min, max]) => (
          <div key={l as string}>
            <div className="fin-label">{l as string}</div>
            <input
              type="number"
              className="fin-input"
              value={v as number}
              min={min as number}
              max={max as number}
              onChange={(e) =>
                (s as (n: number) => void)(Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          [
            "Retirement Corpus Needed",
            `₹${Math.round(corpus).toLocaleString("en-IN")}`,
            "#2FE6FF",
          ],
          [
            "Monthly SIP Required",
            `₹${Math.round(sipNeeded).toLocaleString("en-IN")}`,
            "#31E981",
          ],
        ].map(([l, v, c]) => (
          <div key={l as string} className="glass-card p-4 text-center">
            <div className="text-xs mb-1" style={{ color: "#9AA6BF" }}>
              {l as string}
            </div>
            <div className="text-2xl font-bold" style={{ color: c as string }}>
              {v as string}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs" style={{ color: "#9AA6BF" }}>
        Assumptions: 6% inflation, 12% investment return, 7% post-retirement
        returns. Indicative only.
      </p>
    </div>
  );
}

export default function PlanningPage() {
  const [tab, setTab] = useState<"goals" | "retirement">("goals");
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Financial Planning
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          Plan your goals and retirement with precision.
        </p>
      </div>
      <div className="flex gap-2">
        {[
          ["goals", "Goal Planner"],
          ["retirement", "Retirement Planner"],
        ].map(([id, l]) => (
          <button
            type="button"
            key={id}
            onClick={() => setTab(id as "goals" | "retirement")}
            className={tab === id ? "fin-tab-active" : "fin-tab"}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="glass-card p-6">
        {tab === "goals" && <GoalPlanner />}
        {tab === "retirement" && <RetirementPlanner />}
      </div>
    </div>
  );
}
