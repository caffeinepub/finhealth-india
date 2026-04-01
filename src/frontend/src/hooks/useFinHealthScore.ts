import { useMemo } from "react";

interface UserData {
  income?: number;
  savings?: number;
  expenses?: number;
  emi?: number;
  investments?: number;
  equity?: number;
  [key: string]: unknown;
}

export interface ScoreBreakdown {
  label: string;
  score: number;
  maxScore: number;
  pct: number;
  color: string;
}

export interface FinHealthScoreResult {
  score: number;
  category: "Healthy" | "Moderate" | "Risky";
  breakdown: ScoreBreakdown[];
  insights: string[];
}

function getUserData(): UserData {
  const uid = localStorage.getItem("finhealth_current_user_id") || "";
  try {
    return JSON.parse(localStorage.getItem(`finhealth_user_${uid}`) || "{}");
  } catch {
    return {};
  }
}

export default function useFinHealthScore(): FinHealthScoreResult {
  return useMemo(() => {
    const user = getUserData();
    const income = user.income || 0;
    const savings = user.savings || 0;
    const expenses = user.expenses || 0;
    const emi = user.emi || 0;
    const investments = user.investments || 0;

    // 1. Savings Ratio (25%)
    const savingsRatio = income > 0 ? savings / income : 0;
    let savingsScore = 0;
    if (savingsRatio >= 0.3) savingsScore = 25;
    else if (savingsRatio >= 0.2) savingsScore = 18;
    else if (savingsRatio >= 0.1) savingsScore = 10;
    else savingsScore = 0;

    // 2. Expense Ratio (20%)
    const expenseRatio = income > 0 ? expenses / income : 1;
    let expenseScore = 0;
    if (expenseRatio < 0.4) expenseScore = 20;
    else if (expenseRatio < 0.6) expenseScore = 16;
    else if (expenseRatio < 0.8) expenseScore = 10;
    else expenseScore = 2;

    // 3. Debt Ratio (20%)
    const debtRatio = income > 0 ? emi / income : 0;
    let debtScore = 0;
    if (emi === 0) debtScore = 20;
    else if (debtRatio < 0.1) debtScore = 20;
    else if (debtRatio < 0.3) debtScore = 15;
    else if (debtRatio < 0.5) debtScore = 8;
    else debtScore = 2;

    // 4. Investment Quality (20%) — proxy: investments/income ratio
    const invRatio = income > 0 ? (investments / income) * 100 : 0;
    let investScore = 0;
    if (invRatio > 50) investScore = 20;
    else if (invRatio >= 20) investScore = 16;
    else if (invRatio >= 1) investScore = 10;
    else investScore = 4;

    // 5. Emergency Fund (15%) — savings / monthly_expenses
    const monthlyExpenses = expenses > 0 ? expenses : 1;
    const emergencyMonths = savings / monthlyExpenses;
    let emergencyScore = 0;
    if (emergencyMonths >= 6) emergencyScore = 15;
    else if (emergencyMonths >= 3) emergencyScore = 12;
    else if (emergencyMonths >= 1) emergencyScore = 6;
    else emergencyScore = 0;

    const total =
      savingsScore + expenseScore + debtScore + investScore + emergencyScore;
    const score = Math.min(100, Math.max(0, total));

    const category: "Healthy" | "Moderate" | "Risky" =
      score >= 80 ? "Healthy" : score >= 60 ? "Moderate" : "Risky";

    const breakdown: ScoreBreakdown[] = [
      {
        label: "Savings",
        score: savingsScore,
        maxScore: 25,
        pct: Math.round((savingsScore / 25) * 100),
        color: "#2FE6FF",
      },
      {
        label: "Expenses",
        score: expenseScore,
        maxScore: 20,
        pct: Math.round((expenseScore / 20) * 100),
        color: "#31E981",
      },
      {
        label: "Debt",
        score: debtScore,
        maxScore: 20,
        pct: Math.round((debtScore / 20) * 100),
        color: "#2D7BFF",
      },
      {
        label: "Investments",
        score: investScore,
        maxScore: 20,
        pct: Math.round((investScore / 20) * 100),
        color: "#B05CFF",
      },
      {
        label: "Emergency Fund",
        score: emergencyScore,
        maxScore: 15,
        pct: Math.round((emergencyScore / 15) * 100),
        color: "#FBCE24",
      },
    ];

    const insights: string[] = [];

    if (savingsRatio < 0.2) {
      const pct = Math.round(savingsRatio * 100);
      insights.push(
        `You are saving only ${pct}% of income — aim for 20%+ to build wealth faster.`,
      );
    } else {
      insights.push(
        `Great savings habit! You save ${Math.round(savingsRatio * 100)}% of your income.`,
      );
    }

    if (expenseRatio > 0.6 && income > 0) {
      const excess = Math.round(expenses - income * 0.6);
      insights.push(
        `Your expenses are high — reduce by ₹${excess.toLocaleString("en-IN")} to improve score significantly.`,
      );
    } else if (income > 0) {
      insights.push(
        "Your expense ratio is healthy — keep controlling discretionary spending.",
      );
    }

    if (investments === 0 || invRatio < 10) {
      insights.push(
        "Start investing to improve your Investment Quality score — even ₹500/month in SIP helps.",
      );
    } else {
      insights.push(
        `Your investment allocation is solid at ${Math.round(invRatio)}% of income.`,
      );
    }

    if (emi === 0) {
      insights.push("No debt detected — excellent financial discipline!");
    } else if (debtRatio > 0.4) {
      insights.push(
        "High EMI burden — consider prepaying loans to free up cash flow.",
      );
    } else {
      insights.push(
        "Your debt level is manageable — continue timely repayments.",
      );
    }

    insights.push(
      "For informational purposes only — not personalized financial advice.",
    );

    return { score, category, breakdown, insights };
  }, []);
}
