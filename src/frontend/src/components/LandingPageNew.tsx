import {
  ArrowRight,
  BarChart3,
  Bot,
  Calculator,
  CheckCircle,
  ChevronRight,
  Heart,
  Loader2,
  PieChart,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type BackendStatusResponse, callBackendStatus } from "../lib/api";

const capabilities = [
  {
    icon: Heart,
    color: "#2FE6FF",
    title: "Financial Health Score",
    desc: "Get a comprehensive 360° score of your financial well-being",
  },
  {
    icon: TrendingUp,
    color: "#2D7BFF",
    title: "Investment Analysis",
    desc: "Analyze SIPs, portfolios, and returns with precision",
  },
  {
    icon: Shield,
    color: "#7A3CFF",
    title: "Insurance Analyzer",
    desc: "Uncover hidden charges and calculate real IRR on policies",
  },
  {
    icon: Calculator,
    color: "#2FE6FF",
    title: "Tax Optimization",
    desc: "Compare old vs new regime and maximize your deductions",
  },
  {
    icon: BarChart3,
    color: "#2D7BFF",
    title: "Loan Planning",
    desc: "Calculate EMI, compare loans, plan prepayment strategies",
  },
  {
    icon: Bot,
    color: "#7A3CFF",
    title: "AI Financial Assistant",
    desc: "Get instant answers to all your financial questions",
  },
];

const problems = [
  {
    icon: "💊",
    title: "People are sold financial products, not advice",
    desc: "Agents push high-commission products that benefit them, not you.",
  },
  {
    icon: "🔍",
    title: "Hidden charges in insurance & investments",
    desc: "Policies and funds bury fees in fine print that silently erode returns.",
  },
  {
    icon: "🧭",
    title: "No clear financial direction",
    desc: "Most people have no clear plan — just random investments with no strategy.",
  },
];

const steps = [
  {
    n: "01",
    title: "Add your financial data",
    desc: "Upload policies, enter investments, and connect your financial picture.",
  },
  {
    n: "02",
    title: "Get Financial Health Score",
    desc: "AI analyzes your data and generates a comprehensive health score across 5 dimensions.",
  },
  {
    n: "03",
    title: "Get actionable insights",
    desc: "Receive personalized, data-driven insights to improve your financial life.",
  },
];

export default function LandingPageNew() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthResult, setHealthResult] =
    useState<BackendStatusResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    callBackendStatus()
      .then((data) => setApiStatus(data.message ?? "Connected"))
      .catch(() => setApiStatus("Backend unreachable"));
  }, []);

  const handleCheckHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    setHealthResult(null);
    try {
      const data = await callBackendStatus();
      setHealthResult(data);
    } catch (_e) {
      setHealthError("Unable to reach backend. Please try again.");
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#070A12" }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(7,10,18,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span
              className="font-bold text-lg"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              <span className="gradient-text">FinHealth</span>
              <span className="text-white"> AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {(["Features", "Tools", "Pricing"] as const).map((l) => (
              <button
                type="button"
                key={l}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: "#9AA6BF" }}
                onClick={() => {
                  const id = l.toLowerCase();
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden md:block ghost-btn px-4 py-2 rounded-lg text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              type="button"
              className="gradient-btn px-4 py-2 rounded-lg text-sm"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
            <button
              type="button"
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-5 h-0.5 bg-white mb-1" />
              <div className="w-5 h-0.5 bg-white mb-1" />
              <div className="w-5 h-0.5 bg-white" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div
            className="md:hidden px-4 pb-4"
            style={{ background: "rgba(7,10,18,0.95)" }}
          >
            {(["Features", "Tools", "Pricing"] as const).map((l) => (
              <button
                type="button"
                key={l}
                className="block w-full text-left py-2 text-sm transition-colors hover:text-white"
                style={{ color: "#9AA6BF" }}
                onClick={() => {
                  const id = l.toLowerCase();
                  setMenuOpen(false);
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {l}
              </button>
            ))}
            <button
              type="button"
              className="block w-full text-left py-2 text-sm gradient-text font-semibold"
              onClick={() => navigate("/login")}
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        className="relative pt-32 pb-24 px-4 overflow-hidden mesh-bg"
        style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "10%",
              width: "40%",
              height: "40%",
              background:
                "radial-gradient(ellipse, rgba(47,230,255,0.12) 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              right: "5%",
              width: "35%",
              height: "40%",
              background:
                "radial-gradient(ellipse, rgba(122,60,255,0.14) 0%, transparent 65%)",
            }}
          />
        </div>
        <div
          className="max-w-4xl mx-auto text-center relative"
          style={{ zIndex: 1 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(47,230,255,0.1)",
              border: "1px solid rgba(47,230,255,0.25)",
            }}
          >
            <Sparkles size={12} style={{ color: "#2FE6FF" }} />
            <span className="text-xs font-medium" style={{ color: "#2FE6FF" }}>
              AI-Powered Financial Intelligence
            </span>
          </div>
          {apiStatus && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{
                background: "rgba(49,233,129,0.1)",
                border: "1px solid rgba(49,233,129,0.25)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#31E981", boxShadow: "0 0 6px #31E981" }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "#31E981" }}
              >
                {apiStatus}
              </span>
            </div>
          )}
          <h1
            className="font-extrabold mb-6 leading-tight"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              color: "#F2F5FF",
              fontFamily: "Bricolage Grotesque, sans-serif",
            }}
          >
            Your Personal{" "}
            <span className="gradient-text">Financial Doctor</span>
            <br />— Powered by AI
          </h1>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: "#9AA6BF", lineHeight: 1.7 }}
          >
            Analyze your finances, uncover hidden mistakes, and get clear,
            actionable insights — all in one intelligent platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="gradient-btn px-8 py-3.5 rounded-xl text-base flex items-center justify-center gap-2 glow-cyan"
              onClick={handleCheckHealth}
              disabled={healthLoading}
              data-ocid="hero.check_health.button"
            >
              {healthLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Checking...
                </>
              ) : (
                <>
                  Check My Financial Health <ArrowRight size={18} />
                </>
              )}
            </button>
            <button
              type="button"
              className="ghost-btn px-8 py-3.5 rounded-xl text-base"
              onClick={() => navigate("/login")}
            >
              Explore Tools
            </button>
          </div>
          {(healthResult || healthError) && (
            <div
              className="mt-6 max-w-xl mx-auto text-left glass-card p-5 rounded-2xl"
              style={{
                border: healthError
                  ? "1px solid rgba(255,80,80,0.3)"
                  : "1px solid rgba(47,230,255,0.25)",
                background: healthError
                  ? "rgba(255,80,80,0.05)"
                  : "rgba(47,230,255,0.05)",
              }}
            >
              {healthError ? (
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">⚠️</span>
                  <div>
                    <div className="font-semibold text-red-400 text-sm mb-1">
                      Connection Error
                    </div>
                    <div className="text-xs" style={{ color: "#9AA6BF" }}>
                      {healthError}
                    </div>
                  </div>
                </div>
              ) : (
                healthResult && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#31E981" }}
                      />
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "#31E981" }}
                      >
                        API Response
                      </span>
                      <button
                        type="button"
                        className="ml-auto text-xs"
                        style={{ color: "#9AA6BF" }}
                        onClick={() => setHealthResult(null)}
                      >
                        ✕ Close
                      </button>
                    </div>
                    {healthResult.message && (
                      <p className="text-sm font-medium text-white mb-3">
                        {healthResult.message}
                      </p>
                    )}
                    <pre
                      className="text-xs rounded-lg p-3 overflow-x-auto"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        color: "#9AA6BF",
                        fontFamily: "monospace",
                      }}
                    >
                      {JSON.stringify(healthResult, null, 2)}
                    </pre>
                  </div>
                )
              )}
            </div>
          )}
          <div className="mt-12 flex flex-wrap gap-6 justify-center">
            {[
              ["10+", "AI-Powered Tools"],
              ["100%", "Data Privacy"],
              ["Free", "To Get Started"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold gradient-text">{v}</div>
                <div className="text-xs mt-1" style={{ color: "#9AA6BF" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              The Problems We Solve
            </h2>
            <p style={{ color: "#9AA6BF" }}>
              Most people face these challenges with their finances.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="glass-card p-6">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-semibold text-white mb-2">{p.title}</h3>
                <p
                  className="text-sm"
                  style={{ color: "#9AA6BF", lineHeight: 1.6 }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Solution */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p style={{ color: "#9AA6BF" }}>
              Three simple steps to financial clarity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-6 left-full w-8 border-t"
                    style={{
                      borderColor: "rgba(47,230,255,0.3)",
                      borderStyle: "dashed",
                    }}
                  />
                )}
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center font-bold text-sm">
                    {s.n}
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p
                  className="text-sm"
                  style={{ color: "#9AA6BF", lineHeight: 1.6 }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{
                background: "rgba(122,60,255,0.1)",
                border: "1px solid rgba(122,60,255,0.25)",
              }}
            >
              <Zap size={12} style={{ color: "#B05CFF" }} />
              <span
                className="text-xs font-medium"
                style={{ color: "#B05CFF" }}
              >
                Complete Ecosystem
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Everything You Need
            </h2>
            <p style={{ color: "#9AA6BF" }}>
              A complete financial intelligence platform — not just a collection
              of tools.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((c) => (
              <div key={c.title} className="glass-card-hover p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${c.color}18`,
                    border: `1px solid ${c.color}30`,
                  }}
                >
                  <c.icon size={20} style={{ color: c.color }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{c.title}</h3>
                <p
                  className="text-sm"
                  style={{ color: "#9AA6BF", lineHeight: 1.6 }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="glass-card p-10 text-center"
            style={{
              background: "rgba(47,230,255,0.04)",
              border: "1px solid rgba(47,230,255,0.15)",
            }}
          >
            <PieChart
              size={40}
              className="mx-auto mb-4"
              style={{ color: "#2FE6FF" }}
            />
            <h2 className="text-2xl font-bold text-white mb-4">
              Why FinHealth AI?
            </h2>
            <p
              className="text-base mb-6"
              style={{
                color: "#9AA6BF",
                lineHeight: 1.8,
                maxWidth: "600px",
                margin: "0 auto 24px",
              }}
            >
              Millions of people make poor financial decisions due to lack of
              guidance and transparency. FinHealth AI is built to provide
              clarity, uncover hidden mistakes, and help you make smarter
              decisions.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                ["No Bias", "Pure data-driven insights, no product sales"],
                [
                  "No Complexity",
                  "Simple, clear outputs anyone can understand",
                ],
                ["No Guessing", "AI-powered analysis with real calculations"],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="text-left p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <CheckCircle
                    size={16}
                    className="mb-2"
                    style={{ color: "#31E981" }}
                  />
                  <div className="font-semibold text-white text-sm mb-1">
                    {t}
                  </div>
                  <div className="text-xs" style={{ color: "#9AA6BF" }}>
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{
                background: "rgba(49,233,129,0.1)",
                border: "1px solid rgba(49,233,129,0.25)",
              }}
            >
              <Sparkles size={12} style={{ color: "#31E981" }} />
              <span
                className="text-xs font-medium"
                style={{ color: "#31E981" }}
              >
                Simple Pricing
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Choose Your Plan
            </h2>
            <p style={{ color: "#9AA6BF" }}>
              Start free, upgrade when you're ready.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div
              className="glass-card p-8"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="mb-6">
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: "#9AA6BF" }}
                >
                  Free Plan
                </div>
                <div className="text-4xl font-bold text-white">₹0</div>
                <div className="text-sm mt-1" style={{ color: "#9AA6BF" }}>
                  Forever free
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Financial Health Score",
                  "SIP Calculator",
                  "EMI Calculator",
                  "Basic Policy Analyzer",
                  "AI Chat (10 queries/day)",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "#9AA6BF" }}
                  >
                    <CheckCircle
                      size={14}
                      style={{ color: "#31E981", flexShrink: 0 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="w-full ghost-btn py-3 rounded-xl text-sm font-medium"
                onClick={() => navigate("/signup")}
                data-ocid="pricing.free.button"
              >
                Get Started Free
              </button>
            </div>
            {/* Pro Plan */}
            <div
              className="glass-card p-8 relative overflow-hidden"
              style={{
                border: "1px solid rgba(47,230,255,0.35)",
                background: "rgba(47,230,255,0.04)",
              }}
            >
              <div
                className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: "linear-gradient(135deg,#2FE6FF,#7A3CFF)",
                  color: "#fff",
                }}
              >
                Most Popular
              </div>
              <div className="mb-6">
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: "#2FE6FF" }}
                >
                  Pro Plan
                </div>
                <div className="text-4xl font-bold text-white">₹99</div>
                <div className="text-sm mt-1" style={{ color: "#9AA6BF" }}>
                  per month
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free",
                  "Advanced AI Insights",
                  "Full Policy Analyzer + IRR",
                  "Portfolio Intelligence",
                  "Goal-based Planning",
                  "Tax Optimizer",
                  "Unlimited AI Chat",
                  "Priority Support",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "#C5D3E8" }}
                  >
                    <CheckCircle
                      size={14}
                      style={{ color: "#2FE6FF", flexShrink: 0 }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="w-full gradient-btn py-3 rounded-xl text-sm font-medium glow-cyan"
                onClick={() => navigate("/signup")}
                data-ocid="pricing.pro.button"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(47,230,255,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Financial Diagnosis Today
          </h2>
          <p className="mb-8" style={{ color: "#9AA6BF" }}>
            Join thousands of users who have transformed their financial life
            with FinHealth AI.
          </p>
          <button
            type="button"
            className="gradient-btn px-10 py-4 rounded-xl text-lg flex items-center gap-2 mx-auto glow-cyan"
            onClick={() => navigate("/signup")}
          >
            Get Started — It's Free <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded gradient-btn flex items-center justify-center">
                  <Sparkles size={12} />
                </div>
                <span className="font-bold gradient-text">FinHealth AI</span>
              </div>
              <p
                className="text-xs"
                style={{ color: "#9AA6BF", lineHeight: 1.6 }}
              >
                Your personal financial decision engine, powered by AI.
              </p>
            </div>
            <div>
              <div className="font-semibold text-white text-sm mb-3">
                Platform
              </div>
              <Link
                to="/dashboard"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.dashboard_link"
              >
                Dashboard
              </Link>
              <Link
                to="/tools"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.tools_link"
              >
                Tools Hub
              </Link>
              <Link
                to="/ai"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.ai_link"
              >
                AI Assistant
              </Link>
              <a
                href="#pricing"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
              >
                Pricing
              </a>
            </div>
            <div>
              <div className="font-semibold text-white text-sm mb-3">Legal</div>
              <Link
                to="/disclaimer"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.disclaimer_link"
              >
                Disclaimer
              </Link>
              <Link
                to="/privacy-policy"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.privacy_link"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.terms_link"
              >
                Terms of Use
              </Link>
            </div>
            <div>
              <div className="font-semibold text-white text-sm mb-3">
                Company
              </div>
              <Link
                to="/about"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.about_link"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-xs mb-2"
                style={{ color: "#9AA6BF" }}
                data-ocid="footer.contact_link"
              >
                Contact
              </Link>
            </div>
          </div>
          <div
            className="pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-center" style={{ color: "#9AA6BF" }}>
              © 2026 FinHealth AI. For informational purposes only. Not
              financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
