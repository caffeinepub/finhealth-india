import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
  ts: Date;
}

const chips = [
  "Analyze my policy",
  "How to save tax?",
  "Best SIP amount for me",
  "EMI for \u20b950L home loan",
  "What is my risk profile?",
];

function getResponse(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("sip"))
    return "A SIP (Systematic Investment Plan) lets you invest a fixed amount monthly in mutual funds. As a rule of thumb, invest at least 20% of your income. For \u20b985,000 monthly income, consider \u20b915,000-20,000/month SIP. Use the SIP Calculator in the Investments section for detailed projections.";
  if (m.includes("tax"))
    return "To save tax: Max out Section 80C (\u20b91.5L) via ELSS, PPF, or EPF. Use 80D for health insurance (\u20b925K-75K). If your deductions exceed \u20b91.75L, the old regime is better. Use the Tax Optimizer to compare both regimes for your exact income.";
  if (m.includes("policy") || m.includes("insurance"))
    return "For insurance analysis: use the Policy Analyzer in the Insurance section. Key metrics to check: IRR should be 8%+ for investment-linked policies. For pure protection, a term insurance with 10-15x annual income coverage is recommended. Separate insurance from investments.";
  if (m.includes("emi") || m.includes("loan"))
    return "EMI = P \u00d7 r \u00d7 (1+r)^n / ((1+r)^n - 1). For a \u20b950L loan at 8.5% for 20 years: EMI \u2248 \u20b943,391/month. Total interest paid \u2248 \u20b954.1L. Use the Loans section for detailed calculations and prepayment strategies.";
  if (m.includes("risk"))
    return "Risk profile depends on: your age (younger = can take more risk), income stability, investment horizon, and emotional tolerance for market falls. Conservative: 60% debt, 20% equity. Moderate: 50% equity, 35% debt. Aggressive: 75% equity. Use the Risk Analysis tool in Investments for detailed assessment.";
  if (m.includes("health score") || m.includes("finhealth"))
    return "Your FinHealth Score is 72/100 (Good). Breakdown: Savings 80%, Goals 65%, Risk Fit 70%, Activity 55%, Investments 75%. Key improvements: increase goal contributions, use tools regularly to boost activity score, and diversify investment portfolio further.";
  if (m.includes("hello") || m.includes("hi"))
    return "Hello! I am your AI Financial Assistant. I can help you understand SIPs, tax optimization, insurance analysis, loan planning, and more. What would you like to explore today?";
  return "I can help with financial analysis, SIP calculations, tax planning, insurance review, and loan EMI calculations. Please note: all insights are for informational purposes only and not personalized financial advice. What specific financial topic would you like to explore?";
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am your AI Financial Assistant. I can help you analyze investments, understand insurance policies, plan taxes, and more. What would you like to explore today?\n\n*For informational purposes only. Not financial advice.*",
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // eslint-disable-line

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text, ts: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(
      () => {
        setMessages((m) => [
          ...m,
          { role: "assistant", text: getResponse(text), ts: new Date() },
        ]);
        setLoading(false);
      },
      800 + Math.random() * 600,
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[700px]">
      <div className="mb-4">
        <h2
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          AI Assistant
        </h2>
        <p style={{ color: "#9AA6BF", fontSize: "0.9rem" }}>
          Get instant answers to your financial questions.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((m) => (
          <div
            key={m.ts.toISOString() + m.role}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              style={
                m.role === "user"
                  ? {
                      background: "linear-gradient(135deg, #2D7BFF, #7A3CFF)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(18,24,42,0.8)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#F2F5FF",
                    }
              }
            >
              {m.text}
            </div>
            {m.role === "user" && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <User size={14} style={{ color: "#9AA6BF" }} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm"
              style={{
                background: "rgba(18,24,42,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#2FE6FF",
                      animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Chips */}
      <div className="flex gap-2 flex-wrap mb-3">
        {chips.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => send(c)}
            className="text-xs px-3 py-1.5 rounded-full transition-all"
            style={{
              background: "rgba(47,230,255,0.1)",
              border: "1px solid rgba(47,230,255,0.2)",
              color: "#2FE6FF",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-3"
      >
        <input
          className="fin-input flex-1"
          placeholder="Ask about investments, insurance, tax, loans..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <Send size={16} className="text-white" />
        </button>
      </form>

      <p className="text-xs mt-2 text-center" style={{ color: "#9AA6BF" }}>
        AI responses are for informational purposes only. Not personalized
        financial advice.
      </p>
      <style>
        {
          "@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }"
        }
      </style>
    </div>
  );
}
