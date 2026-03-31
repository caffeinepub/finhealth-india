import {
  ArrowLeft,
  Bot,
  CheckCircle,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ background: "#070A12" }}>
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-6 h-16"
        style={{
          background: "rgba(7,10,18,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#9AA6BF" }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-7 h-7 rounded-lg gradient-btn flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <Link to="/" className="font-bold gradient-text">
            FinHealth AI
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          About FinHealth AI
        </h1>
        <p
          className="text-base mb-10"
          style={{ color: "#9AA6BF", lineHeight: 1.7 }}
        >
          Your Personal Financial Doctor — Powered by AI.
        </p>

        <div
          className="rounded-2xl p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg,rgba(47,230,255,0.08),rgba(122,60,255,0.08))",
            border: "1px solid rgba(47,230,255,0.2)",
          }}
        >
          <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
          <p style={{ color: "#B0BCDE", lineHeight: 1.7 }}>
            Millions of people in India make poor financial decisions due to
            lack of clarity, mis-selling, and complexity. FinHealth AI is built
            to change that — by giving every person access to the analytical
            tools that were previously only available to the wealthy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              icon: TrendingUp,
              color: "#2FE6FF",
              title: "Data-Driven Analysis",
              desc: "Real calculations, not guesses. IRR, XIRR, projections — all transparent.",
            },
            {
              icon: Shield,
              color: "#7A3CFF",
              title: "No Bias, No Sales",
              desc: "We don't sell products or earn commissions. Pure analysis only.",
            },
            {
              icon: Bot,
              color: "#31E981",
              title: "AI-Powered Insights",
              desc: "Smart contextual insights to help you understand your financial picture.",
            },
            {
              icon: CheckCircle,
              color: "#FBCE24",
              title: "SEBI Compliant",
              desc: "Strictly informational. We don't provide personalized investment advice.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(18,24,42,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <item.icon
                size={22}
                style={{ color: item.color }}
                className="mb-3"
              />
              <h3 className="text-white font-semibold text-sm mb-1">
                {item.title}
              </h3>
              <p
                className="text-xs"
                style={{ color: "#9AA6BF", lineHeight: 1.6 }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/signup"
            className="gradient-btn px-8 py-3 rounded-xl font-semibold inline-block"
            data-ocid="about.cta_button"
          >
            Start Your Financial Diagnosis
          </Link>
        </div>
      </main>
    </div>
  );
}
