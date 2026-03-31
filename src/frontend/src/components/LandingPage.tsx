import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  FileText,
  LayoutDashboard,
  LineChart,
  Lock,
  MessageSquare,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

import TrustCounter from "./TrustCounter";
interface LandingPageProps {
  onEnterApp: () => void;
  onGoAdvisory: () => void;
  onGoFinancialAI?: () => void;
}

const features = [
  {
    icon: BarChart3,
    name: "Portfolio Analysis",
    desc: "Deep insights into your assets, liabilities, and net worth with visual breakdowns.",
  },
  {
    icon: Shield,
    name: "Policy & ULIP Analyzer",
    desc: "Detect mis-selling and analyze if your insurance policy actually works for you.",
  },
  {
    icon: TrendingUp,
    name: "SIP Calculator",
    desc: "Plan your Systematic Investment Plan with inflation-adjusted projections.",
  },
  {
    icon: Sparkles,
    name: "FinHealth Score",
    desc: "Your personal financial health score across 5 key dimensions — tracked over time.",
  },
  {
    icon: Brain,
    name: "Stress Test Simulator",
    desc: "Simulate market crashes and economic downturns on your portfolio before they happen.",
  },
  {
    icon: FileText,
    name: "Tax Optimizer",
    desc: "Identify tax-saving opportunities under Section 80C, 80D, NPS, and more.",
  },
];

const stats = [
  { value: "10+", label: "Smart Tools" },
  { value: "SEBI", label: "Compliant" },
  { value: "AI", label: "Powered" },
  { value: "100%", label: "Secure" },
];

const steps = [
  {
    num: "01",
    title: "Add Your Portfolio",
    desc: "Enter assets, liabilities, investments, and insurance policies manually or via CSV upload.",
    icon: Wallet,
  },
  {
    num: "02",
    title: "Run Analysis",
    desc: "Our AI engine analyzes your data across risk, diversification, goals, and compliance.",
    icon: LineChart,
  },
  {
    num: "03",
    title: "Get Actionable Insights",
    desc: "Receive personalized, SEBI-compliant recommendations with \u20b9 and % impact figures.",
    icon: Target,
  },
];

const problems = [
  {
    title: "Wrong Insurance Policies",
    desc: "Most Indians are sold high-commission ULIPs and endowment plans with poor returns.",
  },
  {
    title: "Low Investment Returns",
    desc: "FDs and savings accounts barely beat inflation, eroding real wealth year after year.",
  },
  {
    title: "No Financial Planning",
    desc: "Without a clear roadmap, goals like retirement, education, and home remain unmet.",
  },
  {
    title: "Lack of Clarity",
    desc: "Complex jargon and conflicting advice leave investors confused and paralyzed.",
  },
];

const solutions = [
  { icon: Shield, label: "Policy Analyzer" },
  { icon: TrendingUp, label: "SIP Planner" },
  { icon: Target, label: "Risk Profile" },
  { icon: MessageSquare, label: "AI Assistant" },
];

const insights = [
  {
    icon: TrendingUp,
    title: "Inflation Impact",
    number: "\u20b955,839",
    desc: "At 6% inflation, \u20b91 Lakh today = \u20b955,839 in 10 years. Your savings must outpace inflation.",
  },
  {
    icon: BarChart3,
    title: "SIP vs FD",
    number: "\u20b923.2L",
    desc: "\u20b910,000/month SIP at 12% = \u20b923.2L in 10 years vs FD at 6.5% = \u20b916.9L. SIP wins.",
  },
  {
    icon: Sparkles,
    title: "Wealth Growth",
    number: "\u20b91.76 Cr",
    desc: "Investing \u20b95,000/month from age 25 = \u20b91.76 Cr by retirement at 60 (12% avg return).",
  },
];

const freeFeatures = [
  "Basic tools & calculators",
  "Portfolio tracking",
  "SIP calculator",
  "Basic analysis",
];

const proFeatures = [
  "Everything in Free",
  "AI-powered insights",
  "Advanced tracking",
  "Weekly financial reports",
  "Priority support",
];

const aiFeatureCards = [
  {
    icon: FileSearch,
    title: "Policy Analyzer",
    subtitle: "Know the Truth",
    accentColor: "#B8FF4A",
    accentRgb: "184,255,74",
    bullets: [
      "Complete breakdown of your plan",
      "Real return (IRR) — not promised returns",
      "Hidden gaps, charges, and limitations",
      "Clear verdict: Worth it or not",
    ],
    cta: "Upload Your Policy",
    ocid: "landing.ai.policy.primary_button",
  },
  {
    icon: LayoutDashboard,
    title: "Wealth Dashboard",
    subtitle: "See Everything Together",
    accentColor: "#60A5FA",
    accentRgb: "96,165,250",
    bullets: [
      "Track your total net worth",
      "Mutual Funds, Stocks, FDs, Real Estate, Insurance",
      "Visual growth tracking and future projections",
    ],
    cta: "Explore Dashboard",
    ocid: "landing.ai.dashboard.primary_button",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Intelligence",
    subtitle: "Go Beyond Returns",
    accentColor: "#A78BFA",
    accentRgb: "167,139,250",
    bullets: [
      "Actual returns (XIRR)",
      "Performance breakdown",
      "Identify underperforming investments",
      "Rebalancing signals",
    ],
    cta: "Analyze Portfolio",
    ocid: "landing.ai.portfolio.primary_button",
  },
  {
    icon: Brain,
    title: "AI Financial Insights",
    subtitle: "Your Smart Advisor",
    accentColor: "#F97316",
    accentRgb: "249,115,22",
    bullets: [
      "Detect low-return products",
      "Highlight optimization opportunities",
      "Suggest smarter allocation strategies",
      "Like having a financial expert — 24/7",
    ],
    cta: "Get AI Insights",
    ocid: "landing.ai.insights.primary_button",
  },
  {
    icon: Target,
    title: "Goal-Based Planning",
    subtitle: "Build Your Future",
    accentColor: "#2DD4BF",
    accentRgb: "45,212,191",
    bullets: [
      "Plan for retirement, home, education",
      "Track progress in real time",
      "Get actionable monthly strategies",
    ],
    cta: "Start Planning",
    ocid: "landing.ai.goals.primary_button",
  },
];

export default function LandingPage({
  onEnterApp,
  onGoAdvisory: _onGoAdvisory,
  onGoFinancialAI,
}: LandingPageProps) {
  return (
    <div
      className="min-h-screen pt-16"
      style={{
        background: "#060A10",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(184,255,74,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(184,255,74,0.1)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.25)",
              }}
            >
              <Sparkles size={12} /> AI-Powered Financial Intelligence for India
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: "#EAF0F6", letterSpacing: "-0.03em" }}
            >
              Make smarter{" "}
              <span
                style={{
                  color: "#B8FF4A",
                  textShadow: "0 0 32px rgba(184,255,74,0.5)",
                }}
              >
                financial
              </span>
              <br />
              decisions with AI
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto mb-10"
              style={{ color: "#9AA6B2", lineHeight: 1.7 }}
            >
              Analyze investments, track your wealth, and avoid costly mistakes
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                data-ocid="landing.hero.primary_button"
                onClick={onEnterApp}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105"
                style={{
                  background: "#B8FF4A",
                  color: "#060A10",
                  boxShadow: "0 0 24px rgba(184,255,74,0.35)",
                }}
              >
                Get Started <ArrowRight size={16} />
              </button>
              <button
                type="button"
                data-ocid="landing.hero.login_button"
                onClick={onEnterApp}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:bg-white/5"
                style={{ color: "#EAF0F6", border: "1px solid #24303A" }}
              >
                Login <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          borderTop: "1px solid #24303A",
          borderBottom: "1px solid #24303A",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  style={{ color: "#B8FF4A" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "#9AA6B2" }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustCounter />
      {/* FinancialAI Experience Showcase */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,255,74,0.05) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          {/* Intro Banner */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: "#B8FF4A",
                  color: "#060A10",
                  letterSpacing: "0.12em",
                }}
              >
                NEW
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: "rgba(184,255,74,0.7)" }}
              >
                Platform Update
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight"
              style={{ color: "#EAF0F6", letterSpacing: "-0.03em" }}
            >
              Introducing the{" "}
              <span
                style={{
                  color: "#B8FF4A",
                  textShadow: "0 0 40px rgba(184,255,74,0.4)",
                }}
              >
                Complete FinancialAI
              </span>
              <br />
              Experience
            </h2>
            <p
              className="text-sm sm:text-base max-w-2xl mx-auto"
              style={{ color: "#9AA6B2", lineHeight: 1.8 }}
            >
              A suite of intelligent tools designed to give you complete
              control, full clarity, and smarter financial decisions — all in
              one place.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {aiFeatureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl flex flex-col"
                style={{
                  background: "#0D1520",
                  border: "1px solid #1C2A3A",
                  borderTop: `3px solid ${card.accentColor}`,
                }}
                whileHover={{
                  scale: 1.025,
                  boxShadow: `0 0 40px rgba(${card.accentRgb},0.18), 0 0 0 1px rgba(${card.accentRgb},0.35)`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `rgba(${card.accentRgb},0.12)`,
                    border: `1px solid rgba(${card.accentRgb},0.25)`,
                  }}
                >
                  <card.icon size={20} style={{ color: card.accentColor }} />
                </div>
                <h3
                  className="text-base font-bold mb-0.5"
                  style={{ color: "#EAF0F6" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-xs font-semibold mb-4"
                  style={{ color: card.accentColor, opacity: 0.85 }}
                >
                  — {card.subtitle}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: card.accentColor, opacity: 0.7 }}
                      />
                      <span
                        className="text-xs leading-relaxed"
                        style={{ color: "#9AA6B2" }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-ocid={card.ocid}
                  onClick={onEnterApp}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: `rgba(${card.accentRgb},0.12)`,
                    color: card.accentColor,
                    border: `1px solid rgba(${card.accentRgb},0.3)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `rgba(${card.accentRgb},0.22)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `rgba(${card.accentRgb},0.12)`;
                  }}
                >
                  {card.cta} →
                </button>
              </motion.div>
            ))}
          </div>

          {/* Why This Changes Everything */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <h3
              className="text-xl sm:text-2xl font-bold text-center mb-8"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              ⚡ Why This Changes Everything
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <div
                  className="text-xs font-bold mb-3 flex items-center gap-2"
                  style={{ color: "#F87171" }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                  >
                    ✕
                  </span>
                  Most Platforms
                </div>
                <p
                  className="text-sm font-semibold mb-3"
                  style={{ color: "#EAF0F6" }}
                >
                  Track investments
                </p>
                <div
                  className="text-xs font-bold text-center my-4"
                  style={{ color: "rgba(248,113,113,0.6)" }}
                >
                  — OR —
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#EAF0F6" }}
                >
                  Sell products
                </p>
                <p className="text-xs mt-4" style={{ color: "#9AA6B2" }}>
                  But never both. And never on your side.
                </p>
              </div>
              <div
                className="p-7 rounded-2xl"
                style={{
                  background: "rgba(184,255,74,0.05)",
                  border: "1px solid rgba(184,255,74,0.22)",
                  boxShadow: "0 0 40px rgba(184,255,74,0.05)",
                }}
              >
                <div
                  className="text-xs font-bold mb-3 flex items-center gap-2"
                  style={{ color: "#B8FF4A" }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{
                      background: "rgba(184,255,74,0.15)",
                      border: "1px solid rgba(184,255,74,0.3)",
                    }}
                  >
                    ✓
                  </span>
                  FinancialAI
                </div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "#EAF0F6" }}
                >
                  We do something different.
                </p>
                <p
                  className="text-base font-bold"
                  style={{
                    color: "#B8FF4A",
                    textShadow: "0 0 20px rgba(184,255,74,0.3)",
                  }}
                >
                  Understand, evaluate, and improve —
                </p>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: "#EAF0F6" }}
                >
                  before you invest more.
                </p>
                <p className="text-xs mt-4" style={{ color: "#9AA6B2" }}>
                  No bias. No products to sell. Just clarity.
                </p>
              </div>
            </div>
          </motion.div>

          {/* The Complete Package */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mb-12 p-8 sm:p-10 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, #0D1520 0%, #0F1C2A 50%, #0A1218 100%)",
              border: "1px solid rgba(184,255,74,0.18)",
              boxShadow:
                "0 0 80px rgba(184,255,74,0.06), inset 0 1px 0 rgba(184,255,74,0.08)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="flex-1 text-center sm:text-left">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                  style={{
                    background: "rgba(184,255,74,0.1)",
                    color: "#B8FF4A",
                    border: "1px solid rgba(184,255,74,0.25)",
                  }}
                >
                  💎 The Complete Package
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold mb-6"
                  style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
                >
                  This isn't just an update.
                  <br />
                  <span style={{ color: "#B8FF4A" }}>
                    This is your complete financial command center.
                  </span>
                </h3>
                <ul className="space-y-4">
                  {[
                    { icon: "🔍", text: "Analyze before investing" },
                    { icon: "📊", text: "Track everything in one place" },
                    { icon: "🎯", text: "Make smarter, data-backed decisions" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{
                          background: "rgba(184,255,74,0.1)",
                          border: "1px solid rgba(184,255,74,0.2)",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#EAF0F6" }}
                      >
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-6 text-sm font-semibold"
                  style={{ color: "#9AA6B2" }}
                >
                  No noise. No bias. Just clarity.
                </p>
              </div>
              <div
                className="hidden sm:flex flex-col items-center justify-center w-48 h-48 rounded-2xl flex-shrink-0"
                style={{
                  background: "rgba(184,255,74,0.06)",
                  border: "1px solid rgba(184,255,74,0.15)",
                }}
              >
                <Sparkles
                  size={40}
                  style={{
                    color: "#B8FF4A",
                    filter: "drop-shadow(0 0 16px rgba(184,255,74,0.6))",
                  }}
                />
                <p
                  className="text-xs font-bold mt-3 text-center px-4"
                  style={{ color: "rgba(184,255,74,0.7)" }}
                >
                  Complete Financial Command Center
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <button
              type="button"
              data-ocid="landing.ai.upload_policy.primary_button"
              onClick={onEnterApp}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105"
              style={{
                background: "#B8FF4A",
                color: "#060A10",
                boxShadow: "0 0 24px rgba(184,255,74,0.35)",
              }}
            >
              <FileSearch size={16} /> Upload Your Policy
            </button>
            <button
              type="button"
              data-ocid="landing.ai.explore_dashboard.secondary_button"
              onClick={onEnterApp}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:bg-white/5"
              style={{ color: "#EAF0F6", border: "1px solid #24303A" }}
            >
              <LayoutDashboard size={16} /> Explore Dashboard
            </button>
            <button
              type="button"
              data-ocid="landing.ai.start_analysis.secondary_button"
              onClick={onEnterApp}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:bg-white/5"
              style={{ color: "#EAF0F6", border: "1px solid #24303A" }}
            >
              <TrendingUp size={16} /> Start Your Analysis
            </button>
          </motion.div>

          {/* Final Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center"
          >
            <p
              className="text-lg sm:text-xl font-bold"
              style={{
                color: "#B8FF4A",
                textShadow: "0 0 30px rgba(184,255,74,0.4)",
                letterSpacing: "-0.01em",
              }}
            >
              FinancialAI — From Confusion to Complete Control.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ background: "#0A0F15" }} className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: "rgba(255,80,80,0.1)",
                color: "#FF8080",
                border: "1px solid rgba(255,80,80,0.2)",
              }}
            >
              <AlertTriangle size={12} /> The Problem
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              The Financial Mistakes Holding You Back
            </h2>
            <p
              className="text-sm max-w-xl mx-auto"
              style={{ color: "#9AA6B2" }}
            >
              Millions of Indian investors face these pitfalls without even
              knowing it.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(255,80,80,0.06)",
                  border: "1px solid rgba(255,80,80,0.18)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(255,80,80,0.12)",
                    border: "1px solid rgba(255,80,80,0.25)",
                  }}
                >
                  <AlertTriangle size={18} style={{ color: "#FF8080" }} />
                </div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: "#EAF0F6" }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#9AA6B2" }}
                >
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: "rgba(184,255,74,0.1)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.25)",
              }}
            >
              <Sparkles size={12} /> The Solution
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              FinHealth helps you analyze financial decisions using AI
            </h2>
            <p
              className="text-sm max-w-xl mx-auto"
              style={{ color: "#9AA6B2" }}
            >
              One platform to fix every financial blind spot
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {solutions.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl"
                style={{
                  background: "#0F141B",
                  border: "1px solid rgba(184,255,74,0.25)",
                  boxShadow: "0 0 20px rgba(184,255,74,0.06)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(184,255,74,0.12)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <s.icon size={16} style={{ color: "#B8FF4A" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#EAF0F6" }}
                >
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ background: "#0A0F15" }} className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              Everything You Need to Master Your Finances
            </h2>
            <p
              className="text-sm max-w-xl mx-auto"
              style={{ color: "#9AA6B2" }}
            >
              10+ specialized tools built for Indian financial regulations and
              investment patterns.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ background: "#0F141B", border: "1px solid #24303A" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(184,255,74,0.1)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <f.icon size={18} style={{ color: "#B8FF4A" }} />
                </div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: "#EAF0F6" }}
                >
                  {f.name}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#9AA6B2" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: "rgba(184,255,74,0.1)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.25)",
              }}
            >
              <TrendingUp size={12} /> Market Insights
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              India's Financial Reality
            </h2>
            <p
              className="text-sm max-w-xl mx-auto"
              style={{ color: "#9AA6B2" }}
            >
              Numbers that show why smart financial decisions matter more than
              ever.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {insights.map((ins, i) => (
              <motion.div
                key={ins.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="p-6 rounded-2xl"
                style={{ background: "#0F141B", border: "1px solid #24303A" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(184,255,74,0.1)",
                      border: "1px solid rgba(184,255,74,0.2)",
                    }}
                  >
                    <ins.icon size={16} style={{ color: "#B8FF4A" }} />
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#9AA6B2" }}
                  >
                    {ins.title}
                  </span>
                </div>
                <div
                  className="text-3xl font-bold mb-3"
                  style={{
                    color: "#B8FF4A",
                    textShadow: "0 0 20px rgba(184,255,74,0.3)",
                  }}
                >
                  {ins.number}
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#9AA6B2" }}
                >
                  {ins.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FinHealth */}
      <section style={{ background: "#0A0F15" }} className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
              style={{
                background: "rgba(184,255,74,0.1)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.25)",
              }}
            >
              <Brain size={12} /> Why FinHealth
            </div>
            <blockquote
              className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-10 leading-relaxed"
              style={{ color: "#EAF0F6", letterSpacing: "-0.01em" }}
            >
              "Millions of people make poor financial decisions due to lack of
              guidance.{" "}
              <span style={{ color: "#B8FF4A" }}>
                FinHealth is built to provide clarity
              </span>{" "}
              and smarter decisions."
            </blockquote>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Shield, label: "SEBI Aware" },
                { icon: Brain, label: "AI-Powered Analysis" },
                { icon: Lock, label: "100% Private & Secure" },
              ].map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-full"
                  style={{
                    background: "rgba(184,255,74,0.07)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <badge.icon size={15} style={{ color: "#B8FF4A" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#EAF0F6" }}
                  >
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section
        style={{
          borderTop: "1px solid #24303A",
          borderBottom: "1px solid #24303A",
        }}
        className="py-20 sm:py-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              How It Works
            </h2>
            <p className="text-sm" style={{ color: "#9AA6B2" }}>
              Three simple steps to financial clarity.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div
                    className="absolute top-5 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px hidden sm:block"
                    style={{ background: "#24303A" }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                  style={{
                    background: "rgba(184,255,74,0.1)",
                    border: "2px solid rgba(184,255,74,0.4)",
                  }}
                >
                  <step.icon size={18} style={{ color: "#B8FF4A" }} />
                </div>
                <div
                  className="text-xs font-bold mb-2"
                  style={{ color: "rgba(184,255,74,0.6)" }}
                >
                  STEP {step.num}
                </div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: "#EAF0F6" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#9AA6B2" }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm" style={{ color: "#9AA6B2" }}>
              Start free. Upgrade when you're ready for AI-powered intelligence.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-2xl flex flex-col"
              style={{ background: "#0F141B", border: "1px solid #24303A" }}
            >
              <div className="mb-6">
                <h3
                  className="text-base font-bold mb-1"
                  style={{ color: "#EAF0F6" }}
                >
                  Free Plan
                </h3>
                <p className="text-xs mb-4" style={{ color: "#9AA6B2" }}>
                  Everything you need to get started
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: "#EAF0F6" }}
                  >
                    ₹0
                  </span>
                  <span className="text-sm pb-1" style={{ color: "#9AA6B2" }}>
                    / forever
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {freeFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={15}
                      style={{ color: "#9AA6B2", flexShrink: 0 }}
                    />
                    <span className="text-sm" style={{ color: "#9AA6B2" }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                data-ocid="landing.pricing.free.primary_button"
                onClick={onEnterApp}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:bg-white/5"
                style={{ color: "#EAF0F6", border: "1px solid #24303A" }}
              >
                Get Started Free
              </button>
            </motion.div>
            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-2xl flex flex-col relative"
              style={{
                background: "#0F141B",
                border: "1px solid rgba(184,255,74,0.4)",
                boxShadow:
                  "0 0 40px rgba(184,255,74,0.1), 0 0 80px rgba(184,255,74,0.04)",
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                style={{ background: "#B8FF4A", color: "#060A10" }}
              >
                Most Popular
              </div>
              <div className="mb-6">
                <h3
                  className="text-base font-bold mb-1"
                  style={{ color: "#EAF0F6" }}
                >
                  Pro Plan
                </h3>
                <p className="text-xs mb-4" style={{ color: "#9AA6B2" }}>
                  Unlock the full power of AI analysis
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: "#B8FF4A" }}
                  >
                    ₹99
                  </span>
                  <span className="text-sm pb-1" style={{ color: "#9AA6B2" }}>
                    / month
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {proFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={15}
                      style={{ color: "#B8FF4A", flexShrink: 0 }}
                    />
                    <span className="text-sm" style={{ color: "#EAF0F6" }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                data-ocid="landing.pricing.pro.primary_button"
                onClick={onEnterApp}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{
                  background: "#B8FF4A",
                  color: "#060A10",
                  boxShadow: "0 0 20px rgba(184,255,74,0.3)",
                }}
              >
                Upgrade to Pro
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: "#0A0F15" }} className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-12 rounded-3xl"
            style={{
              background: "#0F141B",
              border: "1px solid rgba(184,255,74,0.2)",
              boxShadow: "0 0 80px rgba(184,255,74,0.05)",
            }}
          >
            <Zap
              size={36}
              className="mx-auto mb-4"
              style={{
                color: "#B8FF4A",
                filter: "drop-shadow(0 0 12px #B8FF4A80)",
              }}
            />
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ color: "#EAF0F6", letterSpacing: "-0.02em" }}
            >
              Start your financial journey today
            </h2>
            <p
              className="text-sm mb-8 max-w-md mx-auto"
              style={{ color: "#9AA6B2" }}
            >
              Join thousands of Indian investors making smarter decisions with
              FinHealth India.
            </p>
            <button
              type="button"
              data-ocid="landing.cta.primary_button"
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105"
              style={{
                background: "#B8FF4A",
                color: "#060A10",
                boxShadow: "0 0 24px rgba(184,255,74,0.35)",
              }}
            >
              Get Started <ArrowRight size={16} />
            </button>
            <p className="mt-4 text-xs" style={{ color: "#9AA6B2" }}>
              Free forever. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #24303A" }} className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "#B8FF4A" }} />
            <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
              FinHealth India
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-center" style={{ color: "#9AA6B2" }}>
              For educational purposes only. Not investment advice.
            </p>
            <button
              type="button"
              onClick={() => onGoFinancialAI?.()}
              className="text-xs underline underline-offset-2 transition-colors duration-150"
              style={{
                color: "#B8FF4A",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              data-ocid="footer.financialai_disclaimer.link"
            >
              FinancialAI Disclaimer
            </button>
          </div>
          <p className="text-xs" style={{ color: "#9AA6B2" }}>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#B8FF4A" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
