import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle,
  FileLock2,
  FileSearch,
  Gavel,
  Globe,
  Info,
  Layers,
  Lightbulb,
  Lock,
  Scale,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  TrendingUp,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";

interface FinancialAIPageProps {
  onBack: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function stagger(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: "easeOut" as const, delay },
  };
}

function SectionCard({
  id,
  children,
  className = "",
  accentColor = "#24303A",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border p-6 md:p-8 scroll-mt-24 ${className}`}
      style={{ background: "#0A0F1A", borderColor: accentColor }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  number,
  icon,
  title,
  iconBg,
  iconColor,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconColor}33` }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-0.5"
          style={{ color: iconColor }}
        >
          Section {number}
        </p>
        <h2 className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
          {title}
        </h2>
      </div>
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
  tone?: "green" | "amber" | "red" | "blue" | "muted";
}) {
  const colors = {
    green: "#B8FF4A",
    amber: "#FFB84A",
    red: "#FF5C5C",
    blue: "#4AB8FF",
    muted: "#9AA6B2",
  };
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0" style={{ color: colors[tone] }}>
        {icon ?? <CheckCircle size={15} />}
      </span>
      <span className="text-sm leading-relaxed" style={{ color: "#C8D8E8" }}>
        {children}
      </span>
    </div>
  );
}

function SubCard({
  title,
  icon,
  tone,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "green" | "amber" | "red" | "blue";
  children: React.ReactNode;
}) {
  const palette = {
    green: {
      bg: "rgba(184,255,74,0.07)",
      border: "rgba(184,255,74,0.2)",
      color: "#B8FF4A",
    },
    amber: {
      bg: "rgba(255,184,74,0.07)",
      border: "rgba(255,184,74,0.2)",
      color: "#FFB84A",
    },
    red: {
      bg: "rgba(255,92,92,0.07)",
      border: "rgba(255,92,92,0.2)",
      color: "#FF5C5C",
    },
    blue: {
      bg: "rgba(74,184,255,0.07)",
      border: "rgba(74,184,255,0.2)",
      color: "#4AB8FF",
    },
  };
  const p = palette[tone];
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: p.bg, border: `1px solid ${p.border}` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: p.color }}>{icon}</span>
        <p className="text-sm font-bold" style={{ color: p.color }}>
          {title}
        </p>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

const TOC = [
  { id: "section-1", label: "1. Platform Overview" },
  { id: "section-2", label: "2. Nature of Services" },
  { id: "section-3", label: "3. No Advisory / Recommendation" },
  { id: "section-4", label: "4. Scope of Outputs" },
  { id: "section-5", label: "5. No Guarantees" },
  { id: "section-6", label: "6. Nature of Insights" },
  { id: "section-7", label: "7. User Responsibility" },
  { id: "section-8", label: "8. AI Usage & Guardrails" },
  { id: "section-9", label: "9. Data Privacy & Security" },
  { id: "section-10", label: "10. Legal Compliance (India)" },
  { id: "section-11", label: "11. Prohibited Use" },
  { id: "section-12", label: "12. Limitation of Liability" },
  { id: "section-13", label: "13. Modifications" },
  { id: "section-14", label: "14. Governing Law" },
  { id: "section-15", label: "15. Platform Philosophy" },
];

export default function FinancialAIPage({ onBack }: FinancialAIPageProps) {
  function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#060A10", color: "#EAF0F6" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-24">
        {/* ── BACK BUTTON ─────────────────────────────────────────── */}
        <motion.button
          type="button"
          onClick={onBack}
          data-ocid="financialai.back.button"
          className="flex items-center gap-2 mb-10 text-sm font-medium rounded-xl px-4 py-2 transition-all duration-150"
          style={{
            color: "#9AA6B2",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #24303A",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.02 } as any}
          whileTap={{ scale: 0.97 } as any}
        >
          <ArrowLeft size={15} />
          Back
        </motion.button>

        {/* ── HERO BANNER ─────────────────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-14 text-center">
          {/* Badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full"
              style={{
                background: "rgba(184,255,74,0.1)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.3)",
              }}
            >
              <Info size={11} />
              For informational purposes only
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4"
            style={{ color: "#EAF0F6" }}
          >
            FinancialAI —{" "}
            <span style={{ color: "#B8FF4A" }}>Legal, Compliance</span>
            <br className="hidden sm:block" />
            &amp; Usage Framework
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg font-semibold mb-4"
            style={{ color: "#FFB84A" }}
          >
            From Data to Understanding. Decisions remain yours.
          </p>

          <p
            className="max-w-2xl mx-auto text-base leading-relaxed"
            style={{ color: "#9AA6B2" }}
          >
            This document outlines how FinancialAI operates, what it provides,
            and the responsibilities of all parties. Read carefully before using
            the platform.
          </p>
        </motion.div>

        {/* ── TABLE OF CONTENTS ───────────────────────────────────── */}
        <motion.div {...stagger(0.1)} className="mb-12">
          <div
            className="rounded-2xl border p-6"
            style={{ background: "#0A0F1A", borderColor: "#24303A" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <Layers size={18} style={{ color: "#B8FF4A" }} />
              <h2 className="text-base font-bold" style={{ color: "#EAF0F6" }}>
                Table of Contents
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => smoothScroll(e, item.id)}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-all duration-150 group"
                  style={{
                    color: "#9AA6B2",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid #1C2730",
                    textDecoration: "none",
                  }}
                  data-ocid={`toc.${item.id}.link`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-150"
                    style={{ background: "#3A4A5A" }}
                  />
                  <span className="hover:text-green-300 transition-colors duration-150">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── SECTIONS ────────────────────────────────────────────── */}
        <div className="space-y-8">
          {/* SECTION 1 — Platform Overview */}
          <motion.div {...stagger(0.12)}>
            <SectionCard id="section-1">
              <SectionHeader
                number="01"
                icon={<BarChart3 size={18} />}
                title="Platform Overview"
                iconBg="rgba(184,255,74,0.1)"
                iconColor="#B8FF4A"
              />
              <p
                className="text-sm mb-5 leading-relaxed"
                style={{ color: "#9AA6B2" }}
              >
                FinancialAI is a technology-driven platform providing structured
                financial data analysis, document interpretation, projections,
                and insights.
              </p>
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: "#EAF0F6" }}
              >
                The platform enables users to:
              </p>
              <div className="space-y-3">
                <BulletItem icon={<FileSearch size={15} />}>
                  Upload and analyze financial documents (e.g., insurance
                  policies)
                </BulletItem>
                <BulletItem icon={<TrendingUp size={15} />}>
                  Track and visualize portfolio data
                </BulletItem>
                <BulletItem icon={<BarChart3 size={15} />}>
                  View estimated returns and projections
                </BulletItem>
                <BulletItem icon={<Bot size={15} />}>
                  Receive AI-generated insights based on available inputs
                </BulletItem>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 2 — Nature of Services */}
          <motion.div {...stagger(0.14)}>
            <SectionCard id="section-2">
              <SectionHeader
                number="02"
                icon={<Scale size={18} />}
                title="Nature of Services"
                iconBg="rgba(74,184,255,0.1)"
                iconColor="#4AB8FF"
              />
              <p
                className="text-sm mb-5 leading-relaxed"
                style={{ color: "#9AA6B2" }}
              >
                FinancialAI operates strictly as an{" "}
                <span className="font-bold" style={{ color: "#4AB8FF" }}>
                  Information, analytics, and decision-support platform
                </span>
                .
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(184,255,74,0.07)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#B8FF4A" }}
                  >
                    ✅ We ARE
                  </p>
                  <div className="space-y-2">
                    <BulletItem icon={<CheckCircle size={14} />}>
                      An information &amp; analytics platform
                    </BulletItem>
                    <BulletItem icon={<CheckCircle size={14} />}>
                      A decision-support tool
                    </BulletItem>
                    <BulletItem icon={<CheckCircle size={14} />}>
                      A technology-driven analysis system
                    </BulletItem>
                    <BulletItem icon={<CheckCircle size={14} />}>
                      An educational &amp; clarity platform
                    </BulletItem>
                  </div>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,92,92,0.07)",
                    border: "1px solid rgba(255,92,92,0.2)",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#FF5C5C" }}
                  >
                    🚫 We are NOT
                  </p>
                  <div className="space-y-2">
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Investment advisors
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Financial advisors
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Insurance brokers or intermediaries
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Portfolio managers
                    </BulletItem>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 3 — No Advisory or Recommendation */}
          <motion.div {...stagger(0.16)}>
            <SectionCard id="section-3">
              <SectionHeader
                number="03"
                icon={<Ban size={18} />}
                title="No Advisory or Recommendation"
                iconBg="rgba(255,92,92,0.1)"
                iconColor="#FF5C5C"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-3"
                    style={{ color: "#FF5C5C" }}
                  >
                    We do NOT provide:
                  </p>
                  <div className="space-y-2.5">
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Buy/sell recommendations
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Personalized financial advice
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Product endorsements
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Portfolio allocation guidance
                    </BulletItem>
                  </div>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-3"
                    style={{ color: "#B8FF4A" }}
                  >
                    All outputs are:
                  </p>
                  <div className="space-y-2.5">
                    <BulletItem>General in nature</BulletItem>
                    <BulletItem>Based on data and predefined models</BulletItem>
                    <BulletItem>
                      Not tailored to individual financial situations
                    </BulletItem>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 4 — Scope of Outputs */}
          <motion.div {...stagger(0.18)}>
            <SectionCard id="section-4">
              <SectionHeader
                number="04"
                icon={<Layers size={18} />}
                title="Scope of Outputs"
                iconBg="rgba(184,255,74,0.1)"
                iconColor="#B8FF4A"
              />
              <p className="text-sm mb-5" style={{ color: "#9AA6B2" }}>
                The platform may generate the following types of outputs:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SubCard
                  title="A. Document Analysis"
                  icon={<FileSearch size={15} />}
                  tone="blue"
                >
                  <BulletItem tone="blue" icon={<Info size={13} />}>
                    Extraction of policy details
                  </BulletItem>
                  <BulletItem tone="blue" icon={<Info size={13} />}>
                    Breakdown of terms and conditions
                  </BulletItem>
                  <BulletItem tone="blue" icon={<Info size={13} />}>
                    Identification of key financial metrics
                  </BulletItem>
                </SubCard>
                <SubCard
                  title="B. Financial Calculations"
                  icon={<SlidersHorizontal size={15} />}
                  tone="green"
                >
                  <BulletItem tone="green" icon={<CheckCircle size={13} />}>
                    IRR / XIRR
                  </BulletItem>
                  <BulletItem tone="green" icon={<CheckCircle size={13} />}>
                    Total investment vs returns
                  </BulletItem>
                  <BulletItem tone="green" icon={<CheckCircle size={13} />}>
                    Cost and benefit analysis
                  </BulletItem>
                </SubCard>
                <SubCard
                  title="C. Projections & Forecasts"
                  icon={<TrendingUp size={15} />}
                  tone="amber"
                >
                  <BulletItem tone="amber" icon={<AlertTriangle size={13} />}>
                    Estimated future values
                  </BulletItem>
                  <BulletItem tone="amber" icon={<AlertTriangle size={13} />}>
                    Scenario-based outcomes
                  </BulletItem>
                  <BulletItem tone="amber" icon={<AlertTriangle size={13} />}>
                    Graphical visualizations
                  </BulletItem>
                </SubCard>
                <SubCard
                  title="D. AI-Generated Insights"
                  icon={<Bot size={15} />}
                  tone="green"
                >
                  <BulletItem tone="green" icon={<CheckCircle size={13} />}>
                    Observational statements
                  </BulletItem>
                  <BulletItem tone="green" icon={<CheckCircle size={13} />}>
                    Data-based interpretations
                  </BulletItem>
                  <BulletItem tone="green" icon={<CheckCircle size={13} />}>
                    Comparative analysis
                  </BulletItem>
                </SubCard>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 5 — No Guarantees or Assurances */}
          <motion.div {...stagger(0.2)}>
            <SectionCard id="section-5" accentColor="rgba(255,184,74,0.35)">
              <SectionHeader
                number="05"
                icon={<AlertTriangle size={18} />}
                title="No Guarantees or Assurances"
                iconBg="rgba(255,184,74,0.12)"
                iconColor="#FFB84A"
              />
              <div
                className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(255,184,74,0.1)",
                  border: "1px solid rgba(255,184,74,0.35)",
                  color: "#FFB84A",
                }}
              >
                ⚠️ FinancialAI does NOT guarantee returns, accuracy, or outcomes.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-3"
                    style={{ color: "#FF5C5C" }}
                  >
                    We do NOT guarantee:
                  </p>
                  <div className="space-y-2.5">
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Accuracy or completeness of data
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Returns, profits, or outcomes
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Future performance of any financial product
                    </BulletItem>
                  </div>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-3"
                    style={{ color: "#FFB84A" }}
                  >
                    All projections are:
                  </p>
                  <div className="space-y-2.5">
                    <BulletItem icon={<AlertTriangle size={14} />} tone="amber">
                      Indicative
                    </BulletItem>
                    <BulletItem icon={<AlertTriangle size={14} />} tone="amber">
                      Based on assumptions
                    </BulletItem>
                    <BulletItem icon={<AlertTriangle size={14} />} tone="amber">
                      Subject to change
                    </BulletItem>
                  </div>
                </div>
              </div>
              <div
                className="mt-5 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(255,184,74,0.06)",
                  border: "1px solid rgba(255,184,74,0.2)",
                  color: "#C8D8E8",
                }}
              >
                Actual results may vary{" "}
                <strong style={{ color: "#FFB84A" }}>significantly</strong> due
                to market conditions, economic factors, and other external
                variables.
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 6 — Nature of Insights */}
          <motion.div {...stagger(0.22)}>
            <SectionCard id="section-6">
              <SectionHeader
                number="06"
                icon={<BookOpen size={18} />}
                title="Nature of Insights"
                iconBg="rgba(74,184,255,0.1)"
                iconColor="#4AB8FF"
              />
              <p
                className="text-sm mb-5 leading-relaxed"
                style={{ color: "#9AA6B2" }}
              >
                All insights provided by the platform — including policy
                evaluations, return comparisons, portfolio analysis, AI
                observations, and financial projections — are:
              </p>
              <div className="space-y-3">
                <BulletItem icon={<Info size={15} />} tone="blue">
                  Informational and educational in nature
                </BulletItem>
                <BulletItem icon={<Info size={15} />} tone="blue">
                  Derived from algorithms and predefined logic
                </BulletItem>
                <BulletItem icon={<Info size={15} />} tone="blue">
                  Do NOT constitute advice or recommendations
                </BulletItem>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 7 — User Responsibility */}
          <motion.div {...stagger(0.24)}>
            <SectionCard id="section-7">
              <SectionHeader
                number="07"
                icon={<User size={18} />}
                title="User Responsibility"
                iconBg="rgba(184,255,74,0.1)"
                iconColor="#B8FF4A"
              />
              <p
                className="text-sm mb-5 leading-relaxed"
                style={{ color: "#9AA6B2" }}
              >
                By using FinancialAI, users acknowledge and agree to the
                following:
              </p>
              <div className="space-y-3">
                <BulletItem>
                  They are solely responsible for their financial decisions
                </BulletItem>
                <BulletItem>
                  They will not rely solely on platform outputs for
                  decision-making
                </BulletItem>
                <BulletItem>
                  They will seek professional advice where required
                </BulletItem>
              </div>
              <div
                className="mt-5 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(255,184,74,0.06)",
                  border: "1px solid rgba(255,184,74,0.2)",
                  color: "#9AA6B2",
                }}
              >
                FinancialAI shall not be held responsible for any decisions or
                outcomes arising from the use of platform data or insights.
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 8 — AI Usage & Guardrails */}
          <motion.div {...stagger(0.26)}>
            <SectionCard id="section-8">
              <SectionHeader
                number="08"
                icon={<Bot size={18} />}
                title="AI Usage & Guardrails"
                iconBg="rgba(184,255,74,0.1)"
                iconColor="#B8FF4A"
              />
              <p
                className="text-sm mb-5 leading-relaxed"
                style={{ color: "#9AA6B2" }}
              >
                The platform uses AI to generate insights under strict
                operational guidelines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Allowed */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(184,255,74,0.07)",
                    border: "1px solid rgba(184,255,74,0.2)",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#B8FF4A" }}
                  >
                    ✅ Allowed
                  </p>
                  <div className="space-y-2">
                    <BulletItem icon={<CheckCircle size={13} />}>
                      Data interpretation
                    </BulletItem>
                    <BulletItem icon={<CheckCircle size={13} />}>
                      Return estimation
                    </BulletItem>
                    <BulletItem icon={<CheckCircle size={13} />}>
                      Comparative observations
                    </BulletItem>
                  </div>
                </div>
                {/* Prohibited */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,92,92,0.07)",
                    border: "1px solid rgba(255,92,92,0.2)",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#FF5C5C" }}
                  >
                    🚫 Prohibited
                  </p>
                  <div className="space-y-2">
                    <BulletItem icon={<XCircle size={13} />} tone="red">
                      Direct recommendations (buy/sell/switch)
                    </BulletItem>
                    <BulletItem icon={<XCircle size={13} />} tone="red">
                      Personalized financial advice
                    </BulletItem>
                    <BulletItem icon={<XCircle size={13} />} tone="red">
                      Statements influencing decision-making
                    </BulletItem>
                  </div>
                </div>
                {/* Mandatory Language */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(255,184,74,0.07)",
                    border: "1px solid rgba(255,184,74,0.2)",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#FFB84A" }}
                  >
                    📋 Mandatory Language
                  </p>
                  <p className="text-xs mb-2" style={{ color: "#9AA6B2" }}>
                    All AI outputs include:
                  </p>
                  <div className="space-y-2">
                    <div
                      className="text-xs px-2 py-1.5 rounded-lg font-mono"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        color: "#FFB84A",
                        border: "1px solid rgba(255,184,74,0.15)",
                      }}
                    >
                      &ldquo;For informational purposes only&rdquo;
                    </div>
                    <div
                      className="text-xs px-2 py-1.5 rounded-lg font-mono"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        color: "#FFB84A",
                        border: "1px solid rgba(255,184,74,0.15)",
                      }}
                    >
                      &ldquo;Based on available data and assumptions&rdquo;
                    </div>
                    <div
                      className="text-xs px-2 py-1.5 rounded-lg font-mono"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        color: "#FFB84A",
                        border: "1px solid rgba(255,184,74,0.15)",
                      }}
                    >
                      &ldquo;Not a recommendation&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 9 — Data Privacy & Security */}
          <motion.div {...stagger(0.28)}>
            <SectionCard id="section-9">
              <SectionHeader
                number="09"
                icon={<Lock size={18} />}
                title="Data Privacy & Security"
                iconBg="rgba(184,255,74,0.1)"
                iconColor="#B8FF4A"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left: Data Collected + Usage */}
                <div className="space-y-5">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-3"
                      style={{ color: "#4AB8FF" }}
                    >
                      📂 Data Collected
                    </p>
                    <div className="space-y-2">
                      <BulletItem icon={<Info size={13} />} tone="blue">
                        User details (name, email, contact)
                      </BulletItem>
                      <BulletItem icon={<Info size={13} />} tone="blue">
                        Uploaded documents
                      </BulletItem>
                      <BulletItem icon={<Info size={13} />} tone="blue">
                        Financial inputs
                      </BulletItem>
                      <BulletItem icon={<Info size={13} />} tone="blue">
                        Usage data
                      </BulletItem>
                    </div>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-3"
                      style={{ color: "#B8FF4A" }}
                    >
                      🎯 Data Usage
                    </p>
                    <div className="space-y-2">
                      <BulletItem>To provide analysis and insights</BulletItem>
                      <BulletItem>To improve platform functionality</BulletItem>
                    </div>
                  </div>
                </div>
                {/* Right: Security + User Rights */}
                <div className="space-y-5">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-3"
                      style={{ color: "#B8FF4A" }}
                    >
                      🔒 Security Measures
                    </p>
                    <div className="space-y-2">
                      <BulletItem icon={<Lock size={13} />}>
                        Encrypted data transmission (HTTPS)
                      </BulletItem>
                      <BulletItem icon={<Lock size={13} />}>
                        Secure storage systems
                      </BulletItem>
                    </div>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-3"
                      style={{ color: "#B8FF4A" }}
                    >
                      👤 Your Rights
                    </p>
                    <div className="space-y-2">
                      <BulletItem icon={<CheckCircle size={13} />}>
                        Access your data
                      </BulletItem>
                      <BulletItem icon={<CheckCircle size={13} />}>
                        Request correction
                      </BulletItem>
                      <BulletItem icon={<CheckCircle size={13} />}>
                        Request deletion
                      </BulletItem>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 10 — Legal Compliance (India) */}
          <motion.div {...stagger(0.3)}>
            <SectionCard id="section-10" accentColor="rgba(74,184,255,0.3)">
              <SectionHeader
                number="10"
                icon={<Gavel size={18} />}
                title="Legal Compliance (India)"
                iconBg="rgba(74,184,255,0.1)"
                iconColor="#4AB8FF"
              />
              <div
                className="mb-5 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(74,184,255,0.08)",
                  border: "1px solid rgba(74,184,255,0.3)",
                  color: "#4AB8FF",
                }}
              >
                ℹ️ FinancialAI operates under applicable Indian laws and
                regulations.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-3"
                    style={{ color: "#4AB8FF" }}
                  >
                    ⚖️ Operates under:
                  </p>
                  <div className="space-y-2.5">
                    <BulletItem icon={<Scale size={14} />} tone="blue">
                      Information Technology Act 2000
                    </BulletItem>
                    <BulletItem icon={<Scale size={14} />} tone="blue">
                      Digital Personal Data Protection Act 2023
                    </BulletItem>
                  </div>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-3"
                    style={{ color: "#FF5C5C" }}
                  >
                    🚫 Does NOT require:
                  </p>
                  <div className="space-y-2.5">
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Investment advisory registration
                    </BulletItem>
                    <BulletItem icon={<XCircle size={14} />} tone="red">
                      Insurance intermediary licensing
                    </BulletItem>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 11 — Prohibited Use */}
          <motion.div {...stagger(0.32)}>
            <SectionCard id="section-11" accentColor="rgba(255,92,92,0.35)">
              <SectionHeader
                number="11"
                icon={<ShieldAlert size={18} />}
                title="Prohibited Use"
                iconBg="rgba(255,92,92,0.12)"
                iconColor="#FF5C5C"
              />
              <div
                className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(255,92,92,0.1)",
                  border: "1px solid rgba(255,92,92,0.35)",
                  color: "#FF5C5C",
                }}
              >
                🚫 Users may NOT engage in the following activities:
              </div>
              <div className="space-y-3">
                <BulletItem icon={<XCircle size={15} />} tone="red">
                  Misuse the platform or use it for unintended purposes
                </BulletItem>
                <BulletItem icon={<XCircle size={15} />} tone="red">
                  Reverse engineer systems, algorithms, or software
                </BulletItem>
                <BulletItem icon={<XCircle size={15} />} tone="red">
                  Use outputs for unlawful purposes
                </BulletItem>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 12 — Limitation of Liability */}
          <motion.div {...stagger(0.34)}>
            <SectionCard id="section-12" accentColor="rgba(255,184,74,0.35)">
              <SectionHeader
                number="12"
                icon={<AlertTriangle size={18} />}
                title="Limitation of Liability"
                iconBg="rgba(255,184,74,0.12)"
                iconColor="#FFB84A"
              />
              <div
                className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(255,184,74,0.1)",
                  border: "1px solid rgba(255,184,74,0.35)",
                  color: "#FFB84A",
                }}
              >
                ⚠️ FinancialAI shall not be liable for the following:
              </div>
              <div className="space-y-3">
                <BulletItem icon={<AlertTriangle size={15} />} tone="amber">
                  Financial losses incurred by users
                </BulletItem>
                <BulletItem icon={<AlertTriangle size={15} />} tone="amber">
                  Decisions based on platform insights or outputs
                </BulletItem>
                <BulletItem icon={<AlertTriangle size={15} />} tone="amber">
                  Data inaccuracies or system errors
                </BulletItem>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 13 — Modifications */}
          <motion.div {...stagger(0.36)}>
            <SectionCard id="section-13">
              <SectionHeader
                number="13"
                icon={<SlidersHorizontal size={18} />}
                title="Modifications"
                iconBg="rgba(184,255,74,0.1)"
                iconColor="#B8FF4A"
              />
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "#C8D8E8" }}
              >
                FinancialAI reserves the right to update any aspect of the
                platform at any time.
              </p>
              <div className="space-y-3">
                <BulletItem>Platform features and functionality</BulletItem>
                <BulletItem>Terms and conditions</BulletItem>
                <BulletItem>Policies and guidelines</BulletItem>
              </div>
              <div
                className="mt-4 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(255,184,74,0.05)",
                  border: "1px solid rgba(255,184,74,0.15)",
                  color: "#9AA6B2",
                }}
              >
                Changes may be made{" "}
                <strong style={{ color: "#FFB84A" }}>
                  without prior notice
                </strong>
                . Continued use of the platform constitutes acceptance of
                updated terms.
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 14 — Governing Law */}
          <motion.div {...stagger(0.38)}>
            <SectionCard id="section-14">
              <SectionHeader
                number="14"
                icon={<Globe size={18} />}
                title="Governing Law"
                iconBg="rgba(74,184,255,0.1)"
                iconColor="#4AB8FF"
              />
              <div
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: "rgba(74,184,255,0.07)",
                  border: "1px solid rgba(74,184,255,0.2)",
                }}
              >
                <span className="text-3xl">🇮🇳</span>
                <div>
                  <p
                    className="text-base font-bold mb-1"
                    style={{ color: "#EAF0F6" }}
                  >
                    Laws of India
                  </p>
                  <p className="text-sm" style={{ color: "#9AA6B2" }}>
                    This platform and all its operations, disputes, and
                    obligations are governed by the laws of the Republic of
                    India.
                  </p>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* SECTION 15 — Platform Philosophy */}
          <motion.div {...stagger(0.4)}>
            <SectionCard
              id="section-15"
              className="relative overflow-hidden"
              accentColor="rgba(184,255,74,0.35)"
            >
              {/* Decorative background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 20%, rgba(184,255,74,0.06) 0%, transparent 60%)",
                }}
              />
              <SectionHeader
                number="15"
                icon={<Lightbulb size={18} />}
                title="Platform Philosophy"
                iconBg="rgba(184,255,74,0.15)"
                iconColor="#B8FF4A"
              />
              {/* Large quote */}
              <div
                className="text-center py-8 px-4 mb-6 rounded-2xl relative"
                style={{
                  background: "rgba(184,255,74,0.05)",
                  border: "1px solid rgba(184,255,74,0.2)",
                }}
              >
                <p
                  className="text-4xl font-black tracking-tight mb-2 leading-tight"
                  style={{ color: "#B8FF4A" }}
                >
                  Clarity over confusion.
                </p>
                <p className="text-sm" style={{ color: "#9AA6B2" }}>
                  — FinancialAI's core principle
                </p>
              </div>
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: "#EAF0F6" }}
              >
                We aim to:
              </p>
              <div className="space-y-3 mb-6">
                <BulletItem icon={<CheckCircle size={15} />}>
                  Simplify financial data so users can understand it without
                  expertise
                </BulletItem>
                <BulletItem icon={<CheckCircle size={15} />}>
                  Improve transparency around financial products and their true
                  performance
                </BulletItem>
                <BulletItem icon={<CheckCircle size={15} />}>
                  Enable better understanding through structured, unbiased
                  analysis
                </BulletItem>
              </div>
              <div
                className="px-4 py-3 rounded-xl text-sm text-center font-semibold"
                style={{
                  background: "rgba(255,92,92,0.07)",
                  border: "1px solid rgba(255,92,92,0.2)",
                  color: "#FF5C5C",
                }}
              >
                We do <strong>NOT</strong> replace professional advice — we
                complement user awareness.
              </div>
            </SectionCard>
          </motion.div>
        </div>
        {/* end sections */}

        {/* ── FINAL STATEMENT BANNER ─────────────────────────────── */}
        <motion.div {...stagger(0.44)} className="mt-12">
          <div
            className="rounded-2xl border px-8 py-10 text-center relative overflow-hidden"
            style={{
              background: "#0A0F1A",
              borderColor: "rgba(184,255,74,0.35)",
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(184,255,74,0.07) 0%, transparent 65%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-5">
                <Shield size={20} style={{ color: "#B8FF4A" }} />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#B8FF4A" }}
                >
                  FinancialAI
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3"
                style={{ color: "#EAF0F6" }}
              >
                From Data to Understanding.
              </h2>
              <p
                className="text-lg font-semibold mb-5"
                style={{ color: "#B8FF4A" }}
              >
                Decisions remain yours.
              </p>
              <p
                className="text-sm max-w-xl mx-auto"
                style={{ color: "#9AA6B2" }}
              >
                This framework is effective as of its publication and governs
                all use of the FinancialAI platform. By accessing or using the
                platform, you agree to these terms.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* end max-w container */}
    </div>
  );
}
