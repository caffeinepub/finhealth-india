import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  ClipboardList,
  FileSearch,
  MessageSquare,
  PiggyBank,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface AdvisoryPageProps {
  onBack: () => void;
  onOpenChat: () => void;
}

const services = [
  {
    icon: BarChart3,
    title: "Investment Advisory",
    color: "#B8FF4A",
    points: [
      "Portfolio optimization and rebalancing",
      "SIP and lump-sum investment planning",
      "Asset allocation by risk profile",
      "Equity, Debt, Gold, and MF analysis",
    ],
  },
  {
    icon: Shield,
    title: "Insurance Advisory",
    color: "#4AF0FF",
    points: [
      "Policy review and adequacy check",
      "ULIP vs Term vs Endowment analysis",
      "Mis-selling detection and correction",
      "Health and life cover recommendations",
    ],
  },
  {
    icon: FileSearch,
    title: "Tax Advisory",
    color: "#FFB84A",
    points: [
      "80C, 80D, NPS tax-saving opportunities",
      "ITR filing guidance and planning",
      "Capital gains tax optimization",
      "HRA, LTA and other deductions",
    ],
  },
  {
    icon: Target,
    title: "Goal Planning",
    color: "#FF7A4A",
    points: [
      "Life goals and retirement planning",
      "Children's education fund planning",
      "Emergency corpus sizing",
      "Dream home and vehicle planning",
    ],
  },
];

const process = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Share Your Profile",
    desc: "Tell us about your income, goals, existing investments, and risk appetite through our secure onboarding.",
  },
  {
    num: "02",
    icon: TrendingUp,
    title: "AI Analysis",
    desc: "Our Smart Financial Assistant analyzes your complete financial picture and identifies gaps, risks, and opportunities.",
  },
  {
    num: "03",
    icon: PiggyBank,
    title: "Get Personalized Guidance",
    desc: "Receive actionable, SEBI-aware recommendations with specific ₹ figures, timelines, and next steps.",
  },
];

const highlights = [
  "AI-powered, context-aware financial guidance",
  "SEBI regulation awareness built-in",
  "India-specific tax and investment rules",
  "Private and secure — your data stays yours",
];

export default function AdvisoryPage({
  onBack,
  onOpenChat,
}: AdvisoryPageProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#060A10",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(6,10,16,0.9)",
          borderBottom: "1px solid #24303A",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="advisory.back.button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
              style={{ color: "#9AA6B2", border: "1px solid #24303A" }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flex items-center gap-2">
              <Zap
                size={20}
                style={{
                  color: "#B8FF4A",
                  filter: "drop-shadow(0 0 6px #B8FF4A80)",
                }}
              />
              <span
                className="text-base font-bold"
                style={{ color: "#EAF0F6" }}
              >
                FinPulse
              </span>
            </div>
          </div>
          <button
            type="button"
            data-ocid="advisory.chat.button"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "#B8FF4A",
              color: "#060A10",
              boxShadow: "0 0 16px rgba(184,255,74,0.3)",
            }}
          >
            <MessageSquare size={14} /> Talk to Assistant
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(74,240,255,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(74,240,255,0.08)",
                color: "#4AF0FF",
                border: "1px solid rgba(74,240,255,0.2)",
              }}
            >
              <Shield size={12} /> SEBI-Aware Financial Guidance
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5"
              style={{ color: "#EAF0F6", letterSpacing: "-0.03em" }}
            >
              Financial{" "}
              <span
                style={{
                  color: "#4AF0FF",
                  textShadow: "0 0 24px rgba(74,240,255,0.4)",
                }}
              >
                Advisory
              </span>{" "}
              Services
            </h1>
            <p
              className="text-base max-w-2xl mx-auto mb-8"
              style={{ color: "#9AA6B2", lineHeight: 1.7 }}
            >
              Personalized, AI-powered financial guidance tailored for Indian
              investors. From portfolio optimization to tax planning — all in
              one place.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-3">
              {highlights.map((h) => (
                <div
                  key={h}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid #24303A",
                    color: "#EAF0F6",
                  }}
                >
                  <CheckCircle size={11} style={{ color: "#B8FF4A" }} />
                  {h}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section
        style={{ borderTop: "1px solid #24303A" }}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-16"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl font-bold mb-10 text-center"
          style={{ color: "#EAF0F6" }}
        >
          Our Advisory Services
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              data-ocid={`advisory.service.item.${i + 1}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl"
              style={{ background: "#0F141B", border: "1px solid #24303A" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}30`,
                  }}
                >
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <h3 className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
                  {s.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: "#9AA6B2" }}
                  >
                    <CheckCircle
                      size={13}
                      className="mt-0.5 shrink-0"
                      style={{ color: s.color }}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section
        style={{
          borderTop: "1px solid #24303A",
          borderBottom: "1px solid #24303A",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl font-bold mb-10 text-center"
            style={{ color: "#EAF0F6" }}
          >
            How Our Advisory Works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {process.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "rgba(184,255,74,0.08)",
                    border: "2px solid rgba(184,255,74,0.3)",
                  }}
                >
                  <step.icon size={20} style={{ color: "#B8FF4A" }} />
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

      {/* SEBI Disclaimer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255,184,74,0.06)",
            border: "1px solid rgba(255,184,74,0.3)",
          }}
          data-ocid="advisory.disclaimer.panel"
        >
          <div className="flex items-start gap-3">
            <Shield
              size={20}
              className="shrink-0 mt-0.5"
              style={{ color: "#FFB84A" }}
            />
            <div>
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "#FFB84A" }}
              >
                SEBI Regulatory Disclaimer
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#9AA6B2" }}
              >
                FinHealth India provides{" "}
                <strong style={{ color: "#EAF0F6" }}>
                  educational financial guidance
                </strong>
                . We are{" "}
                <strong style={{ color: "#EAF0F6" }}>
                  not registered investment advisors
                </strong>{" "}
                as per SEBI (Investment Advisers) Regulations, 2013. All advice,
                insights, and recommendations on this platform are{" "}
                <strong style={{ color: "#EAF0F6" }}>
                  for educational purposes only
                </strong>{" "}
                and should not be construed as investment advice under SEBI
                regulations. Please consult a SEBI-registered investment advisor
                before making any financial decisions. Past performance is not
                indicative of future results.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Chat CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-10 rounded-3xl"
          style={{
            background: "#0F141B",
            border: "1px solid rgba(184,255,74,0.2)",
          }}
        >
          <MessageSquare
            size={32}
            className="mx-auto mb-4"
            style={{ color: "#B8FF4A" }}
          />
          <h2
            className="text-xl sm:text-2xl font-bold mb-3"
            style={{ color: "#EAF0F6" }}
          >
            Talk to Our Financial Assistant
          </h2>
          <p
            className="text-sm mb-6 max-w-md mx-auto"
            style={{ color: "#9AA6B2" }}
          >
            Ask anything — from SIP planning to policy analysis. Our AI
            assistant is ready to help.
          </p>
          <button
            type="button"
            data-ocid="advisory.chat.primary_button"
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition-all"
            style={{
              background: "#B8FF4A",
              color: "#060A10",
              boxShadow: "0 0 20px rgba(184,255,74,0.3)",
            }}
          >
            <MessageSquare size={16} /> Talk to Financial Assistant
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #24303A" }} className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "#B8FF4A" }} />
            <span className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
              FinPulse
            </span>
          </div>
          <p className="text-xs text-center" style={{ color: "#9AA6B2" }}>
            For educational purposes only. Not investment advice.
          </p>
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
