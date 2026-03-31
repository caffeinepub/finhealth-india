import {
  ArrowRight,
  BarChart3,
  Bot,
  Calculator,
  CreditCard,
  Search,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "investments",
    icon: TrendingUp,
    color: "#2FE6FF",
    title: "Investments",
    desc: "Plan and analyze your investment strategies",
    tools: [
      {
        name: "SIP Calculator",
        desc: "Calculate your SIP maturity value and wealth growth",
        page: "/investments",
      },
      {
        name: "Portfolio Analyzer",
        desc: "Analyze your portfolio performance and allocation",
        page: "/investments",
      },
      {
        name: "Return Calculator",
        desc: "Calculate CAGR and annualized returns on investments",
        page: "/investments",
      },
      {
        name: "Risk Analysis",
        desc: "Assess your portfolio risk and get rebalancing signals",
        page: "/investments",
      },
    ],
  },
  {
    id: "insurance",
    icon: Shield,
    color: "#B05CFF",
    title: "Insurance",
    desc: "Evaluate and optimize your insurance coverage",
    tools: [
      {
        name: "Policy Analyzer",
        desc: "Upload any policy and get real IRR and hidden charges",
        page: "/insurance",
      },
      {
        name: "IRR Calculator",
        desc: "Calculate the true Internal Rate of Return on your policy",
        page: "/insurance",
      },
      {
        name: "Coverage Checker",
        desc: "Check if your life and health coverage is adequate",
        page: "/insurance",
      },
    ],
  },
  {
    id: "planning",
    icon: Target,
    color: "#31E981",
    title: "Financial Planning",
    desc: "Build a roadmap for your financial goals",
    tools: [
      {
        name: "Retirement Planner",
        desc: "Plan your retirement corpus and monthly savings needed",
        page: "/planning",
      },
      {
        name: "Goal Planning",
        desc: "Set financial goals and track progress with projections",
        page: "/planning",
      },
      {
        name: "Wealth Projection",
        desc: "Project your net worth growth over the next 10-30 years",
        page: "/planning",
      },
    ],
  },
  {
    id: "loans",
    icon: CreditCard,
    color: "#2D7BFF",
    title: "Loans",
    desc: "Manage your borrowings smartly",
    tools: [
      {
        name: "EMI Calculator",
        desc: "Calculate your monthly EMI for home, car, or personal loans",
        page: "/loans",
      },
      {
        name: "Loan Comparison",
        desc: "Compare multiple loan offers side by side on real cost",
        page: "/loans",
      },
      {
        name: "Prepayment Strategy",
        desc: "Find the optimal prepayment plan to save on interest",
        page: "/loans",
      },
    ],
  },
  {
    id: "tax",
    icon: Calculator,
    color: "#FBCE24",
    title: "Tax",
    desc: "Minimize your tax liability legally",
    tools: [
      {
        name: "Tax Calculator",
        desc: "Compare old vs new income tax regime for your income",
        page: "/tax",
      },
      {
        name: "Deduction Optimizer",
        desc: "Find all deductions under 80C, 80D, HRA, and more",
        page: "/tax",
      },
    ],
  },
  {
    id: "ai",
    icon: Bot,
    color: "#7A3CFF",
    title: "AI Tools",
    desc: "AI-powered financial intelligence",
    tools: [
      {
        name: "Financial Assistant",
        desc: "Chat with AI for instant answers to financial questions",
        page: "/ai",
      },
      {
        name: "Report Explainer",
        desc: "Upload any financial document and get a plain-English summary",
        page: "/ai",
      },
    ],
  },
];

export default function ToolsHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = categories
    .map((cat) => ({
      ...cat,
      tools: cat.tools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.desc.toLowerCase().includes(search.toLowerCase()) ||
          cat.title.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.tools.length > 0);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Financial Toolkit
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          All tools organized by category. Pick what you need.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#9AA6BF" }}
        />
        <input
          className="fin-input"
          style={{ paddingLeft: "38px" }}
          placeholder="Find a tool..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      {filtered.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: `${cat.color}18`,
                border: `1px solid ${cat.color}30`,
              }}
            >
              <cat.icon size={18} style={{ color: cat.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{cat.title}</h3>
              <p className="text-xs" style={{ color: "#9AA6BF" }}>
                {cat.desc}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cat.tools.map((tool) => (
              <div key={tool.name} className="glass-card-hover p-5">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  {tool.name}
                </h4>
                <p
                  className="text-xs mb-4"
                  style={{ color: "#9AA6BF", lineHeight: 1.5 }}
                >
                  {tool.desc}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(tool.page)}
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: cat.color }}
                >
                  Explore <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "#9AA6BF" }}>
          <BarChart3 size={40} className="mx-auto mb-3 opacity-30" />
          <p>No tools found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
