import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const sections = [
  [
    "What We Collect",
    "We collect information you provide: name, email, financial inputs (income, expenses, savings), goals, and any documents you upload for analysis. We also collect basic usage data to improve the platform.",
  ],
  [
    "How We Use It",
    "Your data is used solely to generate analysis, insights, and projections within the platform. We do not use your data for marketing, profiling, or any purpose outside the platform's core functionality.",
  ],
  [
    "Data Storage",
    "All your data is stored locally on your device using browser localStorage. No financial data is transmitted to or stored on external servers (except any AI chat messages processed for responses).",
  ],
  [
    "Data Security",
    "We implement reasonable security practices. However, as data is stored in your browser, you are responsible for maintaining the security of your device and browser.",
  ],
  [
    "Your Rights",
    "You have the right to access, correct, or delete your data at any time. Use the Account Settings page to delete your account and all associated data.",
  ],
  [
    "Contact Us",
    "For privacy-related inquiries, contact us at support@finhealth.ai. We aim to respond within 48 hours.",
  ],
];

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9AA6BF" }}>
          Last updated: March 2026. We respect your privacy and are committed to
          protecting your data.
        </p>
        {sections.map(([title, text]) => (
          <div
            key={title}
            className="rounded-2xl p-6 mb-4"
            style={{
              background: "rgba(18,24,42,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2 className="text-white font-semibold mb-2">{title}</h2>
            <p
              className="text-sm"
              style={{ color: "#9AA6BF", lineHeight: 1.7 }}
            >
              {text}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
