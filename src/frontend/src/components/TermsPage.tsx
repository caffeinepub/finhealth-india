import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const sections = [
  [
    "Acceptance of Terms",
    "By accessing or using FinHealth AI, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform.",
  ],
  [
    "Use of Platform",
    "FinHealth AI is provided for personal, non-commercial use only. You agree not to misuse the platform, attempt to reverse engineer any component, or use it for any unlawful purpose.",
  ],
  [
    "No Financial Advice",
    "This platform does not provide financial, investment, tax, or legal advice. All analysis and insights are informational only. Consult qualified professionals before making financial decisions.",
  ],
  [
    "User Responsibilities",
    "You are solely responsible for the accuracy of data you provide and all financial decisions you make. FinHealth AI is not responsible for decisions made based on platform outputs.",
  ],
  [
    "Intellectual Property",
    "All content, features, and functionality of FinHealth AI are owned by us and protected by applicable intellectual property laws.",
  ],
  [
    "Limitation of Liability",
    "FinHealth AI and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including financial losses.",
  ],
  [
    "Modifications",
    "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.",
  ],
  [
    "Governing Law",
    "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Indian courts.",
  ],
];

export default function TermsPage() {
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
          Terms of Use
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9AA6BF" }}>
          Please read these terms carefully. By using FinHealth AI, you agree to
          these terms.
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
