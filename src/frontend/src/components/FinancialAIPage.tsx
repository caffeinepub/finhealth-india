import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle,
  FileSearch,
  Home,
  Info,
  Lock,
  Scale,
  Shield,
  Target,
  TrendingUp,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface FinancialAIPageProps {
  onBack: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${className}`}
      style={{ background: "#0A0F1A", borderColor: "#24303A" }}
    >
      {children}
    </div>
  );
}

function BulletItem({
  icon,
  children,
  tone = "green",
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: "green" | "amber" | "red" | "blue";
}) {
  const colors = {
    green: "#B8FF4A",
    amber: "#FFB84A",
    red: "#FF5C5C",
    blue: "#4AB8FF",
  };
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0" style={{ color: colors[tone] }}>
        {icon ?? <CheckCircle size={16} />}
      </span>
      <span className="text-sm leading-relaxed" style={{ color: "#C8D8E8" }}>
        {children}
      </span>
    </div>
  );
}

export default function FinancialAIPage({ onBack }: FinancialAIPageProps) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#060A10", color: "#EAF0F6" }}
    >
      {/* Scrollable content with navbar clearance */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Back button */}
        <motion.button
          type="button"
          onClick={onBack}
          data-ocid="financialai.back.button"
          className="flex items-center gap-2 mb-8 text-sm font-medium rounded-xl px-4 py-2 transition-all duration-150"
          style={{
            color: "#9AA6B2",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #24303A",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.02, color: "#B8FF4A" } as any}
          whileTap={{ scale: 0.97 } as any}
        >
          <ArrowLeft size={15} />
          Back
        </motion.button>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(184,255,74,0.1)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.25)",
              }}
            >
              <Zap size={11} />
              Technology Platform
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-3"
            style={{ color: "#EAF0F6" }}
          >
            FinancialAI —{" "}
            <span style={{ color: "#B8FF4A" }}>Data, Insights,</span>
            <br className="hidden sm:block" /> and Clarity
          </h1>
          <p
            className="text-xl font-semibold mb-4"
            style={{ color: "#FFB84A" }}
          >
            Not Advice.
          </p>
          <p
            className="max-w-2xl mx-auto text-base leading-relaxed"
            style={{ color: "#9AA6B2" }}
          >
            A complete financial analysis platform designed to help you{" "}
            <span style={{ color: "#EAF0F6" }}>understand</span> — not decide
            for you.
          </p>
        </motion.div>

        {/* ── SECTIONS GRID ─────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Scope */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
          >
            <SectionCard>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(184,255,74,0.1)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <BarChart3 size={18} style={{ color: "#B8FF4A" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
                  📊 What We Provide
                </h2>
              </div>
              <div className="space-y-3">
                <BulletItem icon={<FileSearch size={16} />}>
                  Analysis of uploaded documents — insurance policies, financial
                  statements, and more
                </BulletItem>
                <BulletItem icon={<TrendingUp size={16} />}>
                  Portfolio tracking and performance metrics
                </BulletItem>
                <BulletItem icon={<BarChart3 size={16} />}>
                  Estimated return calculations (IRR, XIRR, projections)
                </BulletItem>
                <BulletItem icon={<Target size={16} />}>
                  Financial forecasts and visualizations
                </BulletItem>
                <BulletItem icon={<Zap size={16} />}>
                  AI-generated insights based on available data
                </BulletItem>
              </div>
              <div
                className="mt-5 px-4 py-3 rounded-xl text-xs leading-relaxed"
                style={{
                  background: "rgba(184,255,74,0.05)",
                  border: "1px solid rgba(184,255,74,0.15)",
                  color: "#9AA6B2",
                }}
              >
                👉 All outputs are generated using predefined models,
                assumptions, and data interpretation techniques.
              </div>
            </SectionCard>
          </motion.div>

          {/* What We Are NOT */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
          >
            <SectionCard>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255,184,74,0.1)",
                    border: "1px solid rgba(255,184,74,0.2)",
                  }}
                >
                  <XCircle size={18} style={{ color: "#FFB84A" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
                  ⚠️ What We Are Not
                </h2>
              </div>
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(255,184,74,0.08)",
                  border: "1px solid rgba(255,184,74,0.25)",
                  color: "#FFB84A",
                }}
              >
                FinancialAI is <strong>NOT</strong>:
              </div>
              <div className="space-y-3">
                <BulletItem icon={<XCircle size={16} />} tone="red">
                  A financial advisor
                </BulletItem>
                <BulletItem icon={<XCircle size={16} />} tone="red">
                  An investment advisor
                </BulletItem>
                <BulletItem icon={<XCircle size={16} />} tone="red">
                  An insurance advisor or broker
                </BulletItem>
                <BulletItem icon={<XCircle size={16} />} tone="red">
                  A portfolio manager
                </BulletItem>
              </div>
              <p className="mt-4 text-sm" style={{ color: "#9AA6B2" }}>
                We do <span style={{ color: "#FF5C5C" }}>not</span> provide
                personalized recommendations or advice.
              </p>
            </SectionCard>
          </motion.div>

          {/* Two-column row: No Guarantees + Nature of Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* No Guarantees */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
            >
              <SectionCard className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,92,92,0.1)",
                      border: "1px solid rgba(255,92,92,0.2)",
                    }}
                  >
                    <Shield size={18} style={{ color: "#FF5C5C" }} />
                  </div>
                  <h2
                    className="text-base font-bold"
                    style={{ color: "#EAF0F6" }}
                  >
                    🚫 No Guarantees
                  </h2>
                </div>
                <div className="space-y-3">
                  <BulletItem icon={<XCircle size={15} />} tone="red">
                    We do not guarantee returns, profits, or outcomes
                  </BulletItem>
                  <BulletItem icon={<XCircle size={15} />} tone="red">
                    We do not assure accuracy or completeness of results
                  </BulletItem>
                  <BulletItem icon={<XCircle size={15} />} tone="red">
                    All projections and forecasts are indicative in nature
                  </BulletItem>
                </div>
                <p className="mt-4 text-xs" style={{ color: "#6E7E8E" }}>
                  Actual results may differ significantly due to market
                  conditions and other external factors.
                </p>
              </SectionCard>
            </motion.div>

            {/* Nature of Insights */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
            >
              <SectionCard className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(74,184,255,0.1)",
                      border: "1px solid rgba(74,184,255,0.2)",
                    }}
                  >
                    <BookOpen size={18} style={{ color: "#4AB8FF" }} />
                  </div>
                  <h2
                    className="text-base font-bold"
                    style={{ color: "#EAF0F6" }}
                  >
                    🧠 Nature of Insights
                  </h2>
                </div>
                <p className="text-xs mb-3" style={{ color: "#9AA6B2" }}>
                  All insights — including policy evaluations, return
                  comparisons, portfolio analysis, AI observations, and
                  financial projections — are:
                </p>
                <div className="space-y-3">
                  <BulletItem icon={<Info size={15} />} tone="blue">
                    Informational and educational in nature
                  </BulletItem>
                  <BulletItem icon={<Info size={15} />} tone="blue">
                    Based on available inputs and assumptions
                  </BulletItem>
                  <BulletItem icon={<Info size={15} />} tone="blue">
                    Not intended to influence or direct decisions
                  </BulletItem>
                </div>
              </SectionCard>
            </motion.div>
          </div>

          {/* Two-column row: User Responsibility + Data Privacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Responsibility */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.22 }}
            >
              <SectionCard className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(184,255,74,0.1)",
                      border: "1px solid rgba(184,255,74,0.2)",
                    }}
                  >
                    <User size={18} style={{ color: "#B8FF4A" }} />
                  </div>
                  <h2
                    className="text-base font-bold"
                    style={{ color: "#EAF0F6" }}
                  >
                    👤 Your Responsibility
                  </h2>
                </div>
                <p className="text-xs mb-3" style={{ color: "#9AA6B2" }}>
                  By using FinancialAI, you acknowledge that:
                </p>
                <div className="space-y-3">
                  <BulletItem>
                    You are solely responsible for your financial decisions
                  </BulletItem>
                  <BulletItem>
                    You will not rely solely on platform outputs for
                    decision-making
                  </BulletItem>
                  <BulletItem>
                    You will consult qualified professionals where necessary
                  </BulletItem>
                </div>
              </SectionCard>
            </motion.div>

            {/* Data & Privacy */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.25 }}
            >
              <SectionCard className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(184,255,74,0.1)",
                      border: "1px solid rgba(184,255,74,0.2)",
                    }}
                  >
                    <Lock size={18} style={{ color: "#B8FF4A" }} />
                  </div>
                  <h2
                    className="text-base font-bold"
                    style={{ color: "#EAF0F6" }}
                  >
                    🔐 Data &amp; Privacy
                  </h2>
                </div>
                <div className="space-y-3">
                  <BulletItem icon={<Lock size={15} />}>
                    Data uploaded is processed for analysis purposes only
                  </BulletItem>
                  <BulletItem icon={<Lock size={15} />}>
                    We do not sell or misuse user data
                  </BulletItem>
                  <BulletItem icon={<Lock size={15} />}>
                    Users can request deletion of their data at any time
                  </BulletItem>
                </div>
              </SectionCard>
            </motion.div>
          </div>

          {/* Compliance Positioning */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.28 }}
          >
            <SectionCard>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(184,255,74,0.1)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <Scale size={18} style={{ color: "#B8FF4A" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
                  ⚖️ Compliance Positioning
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(184,255,74,0.05)",
                    border: "1px solid rgba(184,255,74,0.15)",
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "#B8FF4A" }}
                  >
                    ✅ We Operate As
                  </p>
                  <p className="text-sm" style={{ color: "#C8D8E8" }}>
                    A <strong>technology-driven analysis platform</strong> —
                    providing data, computation, and structured insights.
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,92,92,0.05)",
                    border: "1px solid rgba(255,92,92,0.2)",
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "#FF5C5C" }}
                  >
                    🚫 We Do NOT Engage In
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-sm" style={{ color: "#9AA6B2" }}>
                      • Investment advisory
                    </p>
                    <p className="text-sm" style={{ color: "#9AA6B2" }}>
                      • Insurance distribution
                    </p>
                    <p className="text-sm" style={{ color: "#9AA6B2" }}>
                      • Portfolio management
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Platform Philosophy */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.32 }}
          >
            <SectionCard>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(184,255,74,0.1)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <Zap size={18} style={{ color: "#B8FF4A" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
                  💡 Our Philosophy
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[
                  {
                    icon: <BarChart3 size={20} style={{ color: "#B8FF4A" }} />,
                    title: "Simplify Complexity",
                    desc: "We break down complex financial data into clear, structured formats anyone can understand.",
                  },
                  {
                    icon: <Target size={20} style={{ color: "#B8FF4A" }} />,
                    title: "Structured Clarity",
                    desc: "Every output is presented with precision — no noise, no bias, just the data.",
                  },
                  {
                    icon: <BookOpen size={20} style={{ color: "#B8FF4A" }} />,
                    title: "Transparency First",
                    desc: "We enable better understanding through transparency and honest data interpretation.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid #1C2A38",
                    }}
                  >
                    <div className="mb-2">{item.icon}</div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "#EAF0F6" }}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: "#7A8A9A" }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(184,255,74,0.05)",
                  border: "1px solid rgba(184,255,74,0.15)",
                  color: "#9AA6B2",
                }}
              >
                💡 We do not{" "}
                <strong style={{ color: "#EAF0F6" }}>replace</strong>{" "}
                professional advice — we{" "}
                <strong style={{ color: "#B8FF4A" }}>complement</strong> user
                awareness.
              </div>
            </SectionCard>
          </motion.div>
        </div>

        {/* ── FINAL STATEMENT BANNER ──────────────────────────── */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.38 }}
          className="mt-10 rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(184,255,74,0.12) 0%, rgba(163,255,18,0.06) 100%)",
            border: "1px solid rgba(184,255,74,0.35)",
          }}
          data-ocid="financialai.final_statement.section"
        >
          <div className="px-8 py-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap size={22} style={{ color: "#B8FF4A" }} />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#B8FF4A" }}
              >
                FinancialAI
              </span>
            </div>
            <p
              className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug mb-3"
              style={{ color: "#EAF0F6" }}
            >
              From <span style={{ color: "#B8FF4A" }}>Data</span> to{" "}
              <span style={{ color: "#B8FF4A" }}>Understanding.</span>
            </p>
            <p
              className="text-lg font-semibold mb-6"
              style={{ color: "#9AA6B2" }}
            >
              Decisions remain yours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBack}
                data-ocid="financialai.home.button"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background: "#B8FF4A",
                  color: "#060A10",
                  cursor: "pointer",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#A3FF12";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#B8FF4A";
                }}
              >
                <Home size={15} />
                Back to FinHealth India
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div
          className="mt-10 pt-6 text-center text-xs"
          style={{ borderTop: "1px solid #24303A", color: "#6E7E8E" }}
        >
          <p>
            For educational purposes only. Not investment advice. Not financial
            planning advice.{" "}
            <span style={{ color: "#9AA6B2" }}>
              © {new Date().getFullYear()} FinHealth India
            </span>
          </p>
          <p className="mt-2">
            Built with ❤️ using{" "}
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
      </div>
    </div>
  );
}
