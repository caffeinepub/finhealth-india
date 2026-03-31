import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function DisclaimerPage() {
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
          Disclaimer
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9AA6BF" }}>
          Please read this disclaimer carefully before using FinHealth AI.
        </p>

        {(
          [
            [
              "Educational Purpose Only",
              "FinHealth AI is an informational and educational platform. All outputs, insights, calculations, and analysis provided are strictly for educational and informational purposes only.",
            ],
            [
              "Not Financial Advice",
              "Nothing on this platform constitutes financial advice, investment advice, or a recommendation to buy, sell, or hold any financial instrument. We are not registered investment advisors.",
            ],
            [
              "No Liability for Losses",
              "FinHealth AI and its creators shall not be liable for any financial losses, investment decisions, or other consequences arising from use of this platform. All financial decisions remain your sole responsibility.",
            ],
            [
              "Based on User Inputs",
              "Analysis and insights are generated based on information you provide. Accuracy depends entirely on the data entered. We do not verify or independently confirm any user-provided information.",
            ],
            [
              "No Guarantees",
              "Past performance and projections do not guarantee future results. All return calculations and projections are estimates based on assumptions that may not hold true.",
            ],
            [
              "Consult Professionals",
              "Before making any financial decisions, please consult a qualified financial advisor, tax professional, or legal expert.",
            ],
          ] as [string, string][]
        ).map(([title, text]) => (
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

        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(47,230,255,0.08),rgba(122,60,255,0.08))",
            border: "1px solid rgba(47,230,255,0.2)",
          }}
        >
          <p className="text-white font-semibold">
            FinHealth AI — From Data to Understanding.
          </p>
          <p className="text-sm mt-1" style={{ color: "#9AA6BF" }}>
            Decisions remain yours.
          </p>
        </div>
      </main>
    </div>
  );
}
