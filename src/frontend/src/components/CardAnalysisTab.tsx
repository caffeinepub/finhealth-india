import {
  AlertTriangle,
  Plus,
  Trash2,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORIES = [
  "Food",
  "Travel",
  "EMI",
  "Shopping",
  "Investments",
  "Subscriptions",
  "Other",
] as const;
type TxCategory = (typeof CATEGORIES)[number];

const CAT_COLORS: Record<TxCategory, string> = {
  Food: "#B8FF4A",
  Travel: "#4AB8FF",
  EMI: "#FF4A4A",
  Shopping: "#FF9A4A",
  Investments: "#C74AFF",
  Subscriptions: "#FFD74A",
  Other: "#9AA6B2",
};

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: TxCategory;
  date: string;
}

interface CardAnalysisTabProps {
  transactions: Transaction[];
  onTransactionsChange: (txns: Transaction[]) => void;
  monthlyIncome: number;
}

function formatINR(amount: number): string {
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function CardAnalysisTab({
  transactions,
  onTransactionsChange,
  monthlyIncome,
}: CardAnalysisTabProps) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food" as TxCategory,
    date: new Date().toISOString().slice(0, 10),
  });

  const addTransaction = () => {
    const amt = Number.parseFloat(form.amount);
    if (!amt || Number.isNaN(amt) || amt <= 0 || !form.description.trim())
      return;
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      description: form.description.trim(),
      amount: amt,
      category: form.category,
      date: form.date,
    };
    onTransactionsChange([...transactions, newTx]);
    setForm((f) => ({ ...f, description: "", amount: "" }));
  };

  const deleteTransaction = (id: string) => {
    onTransactionsChange(transactions.filter((t) => t.id !== id));
  };

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyTxns = transactions.filter((t) => t.date.startsWith(thisMonth));
  const totalSpend = monthlyTxns.reduce((s, t) => s + t.amount, 0);

  const catTotals = useMemo(() => {
    const map: Record<TxCategory, number> = {
      Food: 0,
      Travel: 0,
      EMI: 0,
      Shopping: 0,
      Investments: 0,
      Subscriptions: 0,
      Other: 0,
    };
    for (const t of monthlyTxns)
      map[t.category] = (map[t.category] || 0) + t.amount;
    return map;
  }, [monthlyTxns]);

  const topCat = (Object.entries(catTotals) as [TxCategory, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const subscriptions = catTotals.Subscriptions;
  const emiPct = monthlyIncome > 0 ? (catTotals.EMI / monthlyIncome) * 100 : 0;
  const wasteful =
    catTotals.Subscriptions +
    (catTotals.Shopping > totalSpend * 0.3 ? catTotals.Shopping * 0.3 : 0);

  const pieData = (Object.entries(catTotals) as [TxCategory, number][])
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const insights: { text: string; type: "warn" | "info" | "good" }[] = [];
  if (monthlyIncome > 0 && catTotals.Food > 0)
    insights.push({
      text: `You spent ${formatINR(catTotals.Food)} on Food (${((catTotals.Food / monthlyIncome) * 100).toFixed(0)}% of income)`,
      type: catTotals.Food / monthlyIncome > 0.25 ? "warn" : "info",
    });
  if (subscriptions > 0)
    insights.push({
      text: `Subscriptions: ${formatINR(subscriptions)}/month detected`,
      type: subscriptions > 2000 ? "warn" : "info",
    });
  if (emiPct > 0)
    insights.push({
      text: `EMI burden is ${emiPct.toFixed(0)}% of income${emiPct > 40 ? " — dangerously high!" : ""}`,
      type: emiPct > 40 ? "warn" : emiPct > 25 ? "info" : "good",
    });
  if (totalSpend > monthlyIncome * 0.8 && monthlyIncome > 0)
    insights.push({
      text: `Spending ${((totalSpend / monthlyIncome) * 100).toFixed(0)}% of income this month — reduce discretionary spend`,
      type: "warn",
    });
  if (catTotals.Investments > 0 && monthlyIncome > 0)
    insights.push({
      text: `Investing ${formatINR(catTotals.Investments)} (${((catTotals.Investments / monthlyIncome) * 100).toFixed(0)}% of income) — great habit!`,
      type: "good",
    });

  return (
    <div className="space-y-5" data-ocid="spending.panel">
      {/* Add Transaction */}
      <div className="fintech-card p-6">
        <h3
          className="text-base font-bold mb-4 flex items-center gap-2"
          style={{ color: "#EAF0F6" }}
        >
          <Plus size={16} style={{ color: "#B8FF4A" }} /> Add Transaction
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            data-ocid="spending.description.input"
            style={{
              background: "#0F141B",
              border: "1px solid #24303A",
              borderRadius: 10,
              padding: "9px 12px",
              color: "#EAF0F6",
              fontSize: 13,
              outline: "none",
            }}
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            data-ocid="spending.amount.input"
            style={{
              background: "#0F141B",
              border: "1px solid #24303A",
              borderRadius: 10,
              padding: "9px 12px",
              color: "#EAF0F6",
              fontSize: 13,
              outline: "none",
            }}
          />
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as TxCategory }))
            }
            data-ocid="spending.category.select"
            style={{
              background: "#0F141B",
              border: "1px solid #24303A",
              borderRadius: 10,
              padding: "9px 12px",
              color: "#EAF0F6",
              fontSize: 13,
              outline: "none",
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            data-ocid="spending.date.input"
            style={{
              background: "#0F141B",
              border: "1px solid #24303A",
              borderRadius: 10,
              padding: "9px 12px",
              color: "#EAF0F6",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
        <button
          type="button"
          onClick={addTransaction}
          data-ocid="spending.add.button"
          className="w-full py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#B8FF4A", color: "#060A10" }}
        >
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Spend (Month)",
            value: formatINR(totalSpend),
            color: "#EAF0F6",
          },
          {
            label: "Top Category",
            value: topCat ? `${topCat[0]} (${formatINR(topCat[1])})` : "—",
            color: topCat ? CAT_COLORS[topCat[0] as TxCategory] : "#9AA6B2",
          },
          {
            label: "Wasteful Spend Est.",
            value: formatINR(wasteful),
            color: wasteful > 3000 ? "#FF4A4A" : "#B8FF4A",
          },
          {
            label: "Transactions",
            value: String(monthlyTxns.length),
            color: "#4AB8FF",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="fintech-card p-4"
            data-ocid="spending.summary.card"
          >
            <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
              {m.label}
            </div>
            <div className="text-base font-bold" style={{ color: m.color }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="fintech-card p-5">
          <div
            className="text-sm font-semibold mb-3"
            style={{ color: "#EAF0F6" }}
          >
            Spending Breakdown
          </div>
          {pieData.length > 0 ? (
            <>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((d) => (
                        <Cell
                          key={d.name}
                          fill={CAT_COLORS[d.name as TxCategory]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => formatINR(v)}
                      contentStyle={{
                        background: "#0F141B",
                        border: "1px solid #24303A",
                        borderRadius: 8,
                        color: "#EAF0F6",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {pieData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "#9AA6B2" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: CAT_COLORS[d.name as TxCategory] }}
                    />
                    {d.name}: {formatINR(d.value)}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              className="flex items-center justify-center h-44"
              style={{ color: "#9AA6B2" }}
            >
              <p className="text-xs">Add transactions to see chart</p>
            </div>
          )}
        </div>

        <div className="fintech-card p-5">
          <div
            className="text-sm font-semibold mb-3"
            style={{ color: "#EAF0F6" }}
          >
            Smart Insights
          </div>
          {insights.length > 0 ? (
            <div className="space-y-2">
              {insights.map((ins) => (
                <div
                  key={ins.text}
                  className="p-3 rounded-xl text-xs"
                  style={{
                    background:
                      ins.type === "warn"
                        ? "rgba(255,74,74,0.08)"
                        : ins.type === "good"
                          ? "rgba(184,255,74,0.08)"
                          : "rgba(74,184,255,0.08)",
                    border: `1px solid ${ins.type === "warn" ? "rgba(255,74,74,0.2)" : ins.type === "good" ? "rgba(184,255,74,0.2)" : "rgba(74,184,255,0.2)"}`,
                    color:
                      ins.type === "warn"
                        ? "#FF4A4A"
                        : ins.type === "good"
                          ? "#B8FF4A"
                          : "#4AB8FF",
                  }}
                >
                  {ins.type === "warn"
                    ? "⚠️ "
                    : ins.type === "good"
                      ? "✅ "
                      : "💡 "}
                  {ins.text}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center h-32 gap-2"
              style={{ color: "#9AA6B2" }}
              data-ocid="spending.insights.empty_state"
            >
              <Wallet size={24} style={{ opacity: 0.4 }} />
              <p className="text-xs">
                Add transactions this month to see insights
              </p>
            </div>
          )}

          {emiPct > 40 && (
            <div
              className="mt-3 p-3 rounded-xl flex items-start gap-2"
              style={{
                background: "rgba(255,74,74,0.1)",
                border: "1px solid rgba(255,74,74,0.3)",
              }}
            >
              <AlertTriangle
                size={14}
                style={{ color: "#FF4A4A", flexShrink: 0, marginTop: 1 }}
              />
              <p className="text-xs" style={{ color: "#FF4A4A" }}>
                EMI exceeds 40% of income — financial stress risk! Consider
                prepaying high-interest loans.
              </p>
            </div>
          )}

          {totalSpend > 0 && monthlyIncome > 0 && (
            <div
              className="mt-3 p-3 rounded-xl"
              style={{
                background: "rgba(184,255,74,0.06)",
                border: "1px solid rgba(184,255,74,0.15)",
              }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#B8FF4A" }}
              >
                💰 Savings Suggestions
              </p>
              <ul className="space-y-1">
                {subscriptions > 1500 && (
                  <li className="text-xs" style={{ color: "#9AA6B2" }}>
                    • Review {formatINR(subscriptions)} in subscriptions —
                    cancel unused ones
                  </li>
                )}
                {catTotals.Food / monthlyIncome > 0.2 && (
                  <li className="text-xs" style={{ color: "#9AA6B2" }}>
                    • Cook at home 3 more days/week to save ~
                    {formatINR(catTotals.Food * 0.25)}/month
                  </li>
                )}
                {catTotals.Shopping / monthlyIncome > 0.15 && (
                  <li className="text-xs" style={{ color: "#9AA6B2" }}>
                    • Set a shopping budget at 10% of income (
                    {formatINR(monthlyIncome * 0.1)})
                  </li>
                )}
                {catTotals.Investments / monthlyIncome < 0.1 && (
                  <li className="text-xs" style={{ color: "#9AA6B2" }}>
                    • Aim to invest at least 10% of income per month
                  </li>
                )}
                <li className="text-xs" style={{ color: "#9AA6B2" }}>
                  • Redirect {formatINR(Math.max(0, totalSpend * 0.1))} monthly
                  into a SIP
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="fintech-card p-5">
        <div
          className="text-sm font-semibold mb-3"
          style={{ color: "#EAF0F6" }}
        >
          Recent Transactions ({transactions.length})
        </div>
        {transactions.length === 0 ? (
          <div
            className="text-center py-8"
            style={{ color: "#9AA6B2" }}
            data-ocid="spending.transactions.empty_state"
          >
            <TrendingDown
              size={28}
              style={{ margin: "0 auto 8px", opacity: 0.4 }}
            />
            <p className="text-xs">
              No transactions yet. Add your first one above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...transactions].reverse().map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "#0F141B", border: "1px solid #24303A" }}
                data-ocid={`spending.transaction.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CAT_COLORS[t.category] }}
                  />
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "#EAF0F6" }}
                    >
                      {t.description}
                    </div>
                    <div className="text-xs" style={{ color: "#9AA6B2" }}>
                      {t.category} · {t.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#FF4A4A" }}
                  >
                    -{formatINR(t.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTransaction(t.id)}
                    data-ocid={`spending.delete.button.${i + 1}`}
                    style={{ color: "#4A5568" }}
                    className="hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
