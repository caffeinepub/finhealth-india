import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type EntryType = "Asset" | "Liability";
type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
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

const CARD = {
  background: "#0F141B",
  border: "1px solid #24303A",
  borderRadius: 14,
};

interface YearRow {
  year: number;
  openingBal: number;
  emiPaid: number;
  principalPaid: number;
  interestPaid: number;
  extraPayment: number;
  closingBal: number;
}

function calcEMI(
  principal: number,
  annualRate: number,
  tenureYears: number,
): number {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}

function simulateLoan(
  principal: number,
  annualRate: number,
  emi: number,
  extraYearly: number,
): { rows: YearRow[]; totalInterest: number; months: number } {
  const r = annualRate / 12 / 100;
  let balance = principal;
  let totalInterest = 0;
  let month = 0;
  const rows: YearRow[] = [];

  while (balance > 0.01 && month < 600) {
    const yearStart = month;
    const yearNum = Math.floor(month / 12) + 1;
    const openingBal = balance;
    let yearInterest = 0;
    let yearPrincipal = 0;
    let yearEMI = 0;

    // 12 months
    for (let m = 0; m < 12 && balance > 0.01; m++) {
      const interest = balance * r;
      const principal_ = Math.min(emi - interest, balance);
      yearInterest += interest;
      yearPrincipal += principal_;
      yearEMI += emi;
      totalInterest += interest;
      balance -= principal_;
      month++;
    }

    // Extra yearly payment
    const extra = Math.min(extraYearly, balance);
    balance -= extra;

    rows.push({
      year: yearNum,
      openingBal,
      emiPaid: yearEMI,
      principalPaid: yearPrincipal + extra,
      interestPaid: yearInterest,
      extraPayment: extra,
      closingBal: balance,
    });

    if (balance <= 0.01) break;
    void yearStart;
  }

  return { rows, totalInterest, months: month };
}

export default function LoanPrepaymentTab({
  entries: _entries,
}: { entries: Entry[] }) {
  const [loanAmt, setLoanAmt] = useState(3000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [extraYearly, setExtraYearly] = useState(50000);
  const [manualEMI, setManualEMI] = useState("");

  const autoEMI = useMemo(
    () => calcEMI(loanAmt, rate, tenure),
    [loanAmt, rate, tenure],
  );
  const emi = manualEMI ? Number(manualEMI) : autoEMI;

  const withoutPrepay = useMemo(
    () => simulateLoan(loanAmt, rate, emi, 0),
    [loanAmt, rate, emi],
  );
  const withPrepay = useMemo(
    () => simulateLoan(loanAmt, rate, emi, extraYearly),
    [loanAmt, rate, emi, extraYearly],
  );

  const interestSaved = withoutPrepay.totalInterest - withPrepay.totalInterest;
  const monthsSaved = withoutPrepay.months - withPrepay.months;

  const closureDate = new Date();
  closureDate.setMonth(closureDate.getMonth() + withPrepay.months);
  const closureDateStr = closureDate.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  const chartData = withPrepay.rows.slice(0, 10).map((r) => ({
    year: `Y${r.year}`,
    interest: Math.round(r.interestPaid),
    principal: Math.round(r.principalPaid),
  }));

  return (
    <div className="space-y-6" data-ocid="loan_prepayment.section">
      <div className="flex items-center gap-3 mb-2">
        <div
          style={{
            background: "linear-gradient(135deg, #FF9A4A22, #FF9A4A11)",
            border: "1px solid #FF9A4A44",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span style={{ fontSize: 20 }}>🏠</span>
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#EAF0F6" }}>
            Loan Prepayment Analyzer
          </h2>
          <p className="text-xs" style={{ color: "#9AA6B2" }}>
            See how extra payments reduce your loan tenure and total interest
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="fintech-card p-5" style={CARD}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Loan Amount (₹)
            </div>
            <input
              type="number"
              value={loanAmt}
              onChange={(e) => setLoanAmt(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="loan_prepayment.amount.input"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Annual Interest Rate (%)
            </div>
            <input
              type="number"
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="loan_prepayment.rate.input"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Tenure (Years)
            </div>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="loan_prepayment.tenure.input"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              EMI{" "}
              <span style={{ color: "#4A5568" }}>
                (auto: {formatINR(Math.round(autoEMI))}/mo)
              </span>
            </div>
            <input
              type="number"
              placeholder={String(Math.round(autoEMI))}
              value={manualEMI}
              onChange={(e) => setManualEMI(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="loan_prepayment.emi.input"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <div className="text-xs font-semibold" style={{ color: "#9AA6B2" }}>
              Extra Yearly Prepayment (₹)
            </div>
            <input
              type="number"
              value={extraYearly}
              onChange={(e) => setExtraYearly(Number(e.target.value))}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                background: "#0A0F15",
                border: "1px solid #24303A",
                color: "#EAF0F6",
              }}
              data-ocid="loan_prepayment.extra.input"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        key={`${loanAmt}-${rate}-${tenure}-${extraYearly}-${manualEMI}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          {
            label: "Interest Saved",
            value: formatINR(Math.round(interestSaved)),
            color: "#B8FF4A",
            sub: "vs no prepayment",
          },
          {
            label: "Months Saved",
            value: `${monthsSaved} months`,
            color: "#4AB8FF",
            sub: `${Math.floor(monthsSaved / 12)}yr ${monthsSaved % 12}mo`,
          },
          {
            label: "Loan Closes",
            value: closureDateStr,
            color: "#FFD74A",
            sub: `in ${withPrepay.months} months`,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-xl"
            style={{ ...CARD, border: `1px solid ${m.color}33` }}
            data-ocid="loan_prepayment.card"
          >
            <div className="text-xs mb-1" style={{ color: "#9AA6B2" }}>
              {m.label}
            </div>
            <div className="text-xl font-bold" style={{ color: m.color }}>
              {m.value}
            </div>
            <div className="text-xs mt-1" style={{ color: "#4A5568" }}>
              {m.sub}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Comparison row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            label: "Without Prepayment",
            months: withoutPrepay.months,
            interest: withoutPrepay.totalInterest,
            color: "#FF4A4A",
          },
          {
            label: "With Prepayment",
            months: withPrepay.months,
            interest: withPrepay.totalInterest,
            color: "#B8FF4A",
          },
        ].map((c) => (
          <div key={c.label} className="p-4 rounded-xl" style={CARD}>
            <div
              className="text-xs font-semibold mb-2"
              style={{ color: c.color }}
            >
              {c.label}
            </div>
            <div className="text-xs" style={{ color: "#9AA6B2" }}>
              Total Interest:{" "}
              <span style={{ color: c.color, fontWeight: 700 }}>
                {formatINR(Math.round(c.interest))}
              </span>
            </div>
            <div className="text-xs mt-1" style={{ color: "#9AA6B2" }}>
              Tenure:{" "}
              <span style={{ color: "#EAF0F6", fontWeight: 700 }}>
                {Math.floor(c.months / 12)}yr {c.months % 12}mo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="p-5 rounded-xl" style={CARD}>
        <div
          className="text-xs font-semibold mb-3"
          style={{ color: "#9AA6B2" }}
        >
          Year-wise Interest vs Principal (With Prepayment)
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="year"
              stroke="#4A5568"
              tick={{ fill: "#9AA6B2", fontSize: 11 }}
            />
            <YAxis
              stroke="#4A5568"
              tick={{ fill: "#9AA6B2", fontSize: 11 }}
              tickFormatter={(v) => formatINR(v)}
            />
            <Tooltip
              contentStyle={{
                background: "#0F141B",
                border: "1px solid #24303A",
                borderRadius: 10,
                color: "#EAF0F6",
              }}
              formatter={(value: number) => [formatINR(value)]}
            />
            <Legend wrapperStyle={{ color: "#9AA6B2", fontSize: 11 }} />
            <Bar
              dataKey="interest"
              name="Interest Paid"
              fill="#FF4A4A"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="principal"
              name="Principal Paid"
              fill="#B8FF4A"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Year-wise table */}
      <div className="p-5 rounded-xl overflow-x-auto" style={CARD}>
        <div
          className="text-xs font-semibold mb-3"
          style={{ color: "#9AA6B2" }}
        >
          Year-wise Breakdown (With Prepayment)
        </div>
        <table
          className="w-full text-xs"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ color: "#9AA6B2" }}>
              {[
                "Year",
                "Opening Bal",
                "EMI Paid",
                "Principal",
                "Interest",
                "Extra",
                "Closing Bal",
              ].map((h) => (
                <th
                  key={h}
                  className="pb-2 text-left font-semibold"
                  style={{
                    borderBottom: "1px solid #24303A",
                    paddingRight: 12,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {withPrepay.rows.slice(0, 10).map((row, i) => (
              <tr
                key={row.year}
                data-ocid={`loan_prepayment.row.item.${i + 1}`}
                style={{ borderBottom: "1px solid #1A2332" }}
              >
                <td
                  className="py-2"
                  style={{ color: "#B8FF4A", paddingRight: 12 }}
                >
                  {row.year}
                </td>
                <td
                  className="py-2"
                  style={{ color: "#9AA6B2", paddingRight: 12 }}
                >
                  {formatINR(Math.round(row.openingBal))}
                </td>
                <td
                  className="py-2"
                  style={{ color: "#9AA6B2", paddingRight: 12 }}
                >
                  {formatINR(Math.round(row.emiPaid))}
                </td>
                <td
                  className="py-2"
                  style={{ color: "#9AA6B2", paddingRight: 12 }}
                >
                  {formatINR(Math.round(row.principalPaid))}
                </td>
                <td
                  className="py-2"
                  style={{ color: "#9AA6B2", paddingRight: 12 }}
                >
                  {formatINR(Math.round(row.interestPaid))}
                </td>
                <td
                  className="py-2"
                  style={{ color: "#9AA6B2", paddingRight: 12 }}
                >
                  {formatINR(Math.round(row.extraPayment))}
                </td>
                <td
                  className="py-2"
                  style={{
                    color: row.closingBal <= 0 ? "#B8FF4A" : "#EAF0F6",
                    paddingRight: 12,
                  }}
                >
                  {formatINR(Math.round(row.closingBal))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {withPrepay.rows.length > 10 && (
          <p className="text-xs mt-2" style={{ color: "#4A5568" }}>
            Showing first 10 years. Total tenure: {withPrepay.months} months.
          </p>
        )}
      </div>

      <p
        className="text-xs text-center px-4 py-3 rounded-xl"
        style={{
          color: "#9AA6B2",
          background: "#0F141B",
          border: "1px solid #24303A",
        }}
      >
        ⚠️ For educational purposes only. Not investment or financial advice.
        Actual loan terms may vary by lender.
      </p>
    </div>
  );
}
