import { Bot, ExternalLink, MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
  suggestedTool?: {
    label: string;
    navigationAction: string;
  };
}

interface ClientChatBoxProps {
  userId: string;
  onNavigate?: (tab: string, subTab?: string) => void;
}

const INTENT_RULES: Array<{
  keywords: string[];
  message: string;
  suggestedTool: { label: string; navigationAction: string; subTab?: string };
}> = [
  {
    keywords: ["policy", "insurance", "ulip"],
    message:
      "You can analyze your policy using our Policy Analyzer tool. It detects mis-selling, compares with SIP benchmarks, and shows your actual CAGR.",
    suggestedTool: {
      label: "Open Policy Analyzer",
      navigationAction: "tools",
      subTab: "policy",
    },
  },
  {
    keywords: ["sip", "investment", "mutual fund", "invest"],
    message:
      "Use our SIP Calculator to project your mutual fund growth, or the Goal Planner to calculate the required SIP for your financial targets.",
    suggestedTool: {
      label: "Open SIP Calculator",
      navigationAction: "sip-calculator",
    },
  },
  {
    keywords: ["loan", "emi", "prepayment", "home loan", "personal loan"],
    message:
      "Our Loan Prepayment Analyzer can show you how much interest you save with extra payments and when you'll be debt-free.",
    suggestedTool: {
      label: "Open Loan Prepayment Tool",
      navigationAction: "tools",
      subTab: "loan",
    },
  },
  {
    keywords: [
      "risk",
      "risk profile",
      "conservative",
      "aggressive",
      "risk appetite",
    ],
    message:
      "Use the Risk Profile tool to assess your risk appetite and see if your current portfolio matches your risk tolerance.",
    suggestedTool: {
      label: "Open Risk Profile Tool",
      navigationAction: "tools",
      subTab: "risk",
    },
  },
  {
    keywords: ["goal", "target", "dream", "retirement", "house", "education"],
    message:
      "The Goal Planner helps you set financial goals and calculates the exact SIP needed to reach them on time, inflation-adjusted.",
    suggestedTool: {
      label: "Open Goal Planner",
      navigationAction: "tools",
      subTab: "goal",
    },
  },
  {
    keywords: ["tax", "ltcg", "stcg", "capital gain"],
    message:
      "Check out the Tax Optimizer to calculate your LTCG/STCG liability and find tax-saving opportunities on your portfolio.",
    suggestedTool: {
      label: "Open Tax Optimizer",
      navigationAction: "tools",
      subTab: "stress-test",
    },
  },
  {
    keywords: ["inflation", "erosion", "purchasing power"],
    message:
      "The Inflation Impact Tracker shows how inflation is silently eroding your wealth year by year, with 1, 3, and 5 year projections.",
    suggestedTool: {
      label: "Open Inflation Tracker",
      navigationAction: "tools",
      subTab: "inflation",
    },
  },
  {
    keywords: [
      "portfolio",
      "allocation",
      "rebalance",
      "equity",
      "debt",
      "gold",
    ],
    message:
      "Use the Rebalancing Simulator to adjust your asset allocation and see the impact on your FinHealth score in real time.",
    suggestedTool: {
      label: "Open Rebalancing Simulator",
      navigationAction: "tools",
      subTab: "rebalance",
    },
  },
  {
    keywords: ["stress", "crash", "covid", "2008", "scenario"],
    message:
      "Run a Stress Test to simulate how your portfolio would perform in a market crash like COVID (-38%) or the 2008 crisis (-55%).",
    suggestedTool: {
      label: "Open Stress Test",
      navigationAction: "tools",
      subTab: "stress-test",
    },
  },
  {
    keywords: ["spend", "spending", "expense", "budget", "card"],
    message:
      "The Card & Spending Analysis tool categorizes your expenses, detects wasteful spend, and gives actionable savings suggestions.",
    suggestedTool: {
      label: "Open Spending Analysis",
      navigationAction: "tools",
      subTab: "card",
    },
  },
  {
    keywords: ["health score", "finhealth", "score", "dashboard"],
    message:
      "Your FinHealth Score on the Dashboard rates you across 5 dimensions: diversification, returns, insurance, goals, and expense control.",
    suggestedTool: {
      label: "Go to Dashboard",
      navigationAction: "dashboard",
    },
  },
  {
    keywords: ["report", "dna", "analysis", "summary"],
    message:
      "Check the Reports tab for your Financial DNA Report — it shows your investor archetype, top risks, opportunities, and more.",
    suggestedTool: {
      label: "Open Reports",
      navigationAction: "reports",
    },
  },
];

function detectIntent(
  text: string,
): (ChatMessage["suggestedTool"] & { message: string }) | null {
  const lower = text.toLowerCase();
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return {
        message: rule.message,
        label: rule.suggestedTool.label,
        navigationAction: rule.suggestedTool.navigationAction,
      };
    }
  }
  return null;
}

export default function ClientChatBox({
  userId,
  onNavigate,
}: ClientChatBoxProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const storageKey = `finhealth_chat_v2_${userId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const welcome: ChatMessage = {
        id: "welcome",
        text: "Hi! I'm your Smart Financial Assistant. Ask me about your investments, SIP, loans, policies, risk profile, or any financial topic.",
        sender: "assistant",
        timestamp: Date.now(),
      };
      setMessages([welcome]);
      localStorage.setItem(storageKey, JSON.stringify([welcome]));
    }
  }, [storageKey]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on open
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    localStorage.setItem(storageKey, JSON.stringify(msgs));
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      text,
      sender: "user",
      timestamp: Date.now(),
    };

    const intent = detectIntent(text);
    const botMsg: ChatMessage = intent
      ? {
          id: `${Date.now()}-b`,
          text: intent.message,
          sender: "assistant",
          timestamp: Date.now() + 1,
          suggestedTool: {
            label: intent.label,
            navigationAction: intent.navigationAction,
          },
        }
      : {
          id: `${Date.now()}-b`,
          text: "I'm here to help! Please describe your financial issue in more detail — for example, mention if it's about investments, SIP, loans, policies, or portfolio analysis.",
          sender: "assistant",
          timestamp: Date.now() + 1,
        };

    saveMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNavigate = (action: string) => {
    if (onNavigate) {
      const rule = INTENT_RULES.find(
        (r) => r.suggestedTool.navigationAction === action,
      );
      onNavigate(action, rule?.suggestedTool.subTab);
    }
    setOpen(false);
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        data-ocid="chat.open_modal_button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9998,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#B8FF4A",
          color: "#060A10",
          border: "none",
          cursor: "pointer",
          display: open ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 0 20px rgba(184,255,74,0.55), 0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <Bot size={26} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="chat.modal"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              position: "fixed",
              bottom: "28px",
              right: "28px",
              zIndex: 9999,
              width: "390px",
              height: "540px",
              borderRadius: "16px",
              background: "#060A10",
              border: "1px solid #24303A",
              boxShadow:
                "0 0 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(184,255,74,0.08)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #24303A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(184,255,74,0.05)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "rgba(184,255,74,0.15)",
                    border: "1px solid rgba(184,255,74,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={20} style={{ color: "#B8FF4A" }} />
                </div>
                <div>
                  <p
                    style={{
                      color: "#EAF0F6",
                      fontWeight: 700,
                      fontSize: "14px",
                      margin: 0,
                    }}
                  >
                    Smart Financial Assistant
                  </p>
                  <p style={{ color: "#B8FF4A", fontSize: "11px", margin: 0 }}>
                    ● AI-powered · Always available
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="chat.close_button"
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9AA6B2",
                  padding: "4px",
                  borderRadius: "6px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "10px 14px",
                      borderRadius:
                        msg.sender === "user"
                          ? "14px 14px 4px 14px"
                          : "14px 14px 14px 4px",
                      background: msg.sender === "user" ? "#B8FF4A" : "#0F141B",
                      color: msg.sender === "user" ? "#060A10" : "#EAF0F6",
                      fontSize: "13px",
                      border:
                        msg.sender === "assistant"
                          ? "1px solid #24303A"
                          : "none",
                    }}
                  >
                    <p style={{ margin: 0, lineHeight: 1.55 }}>{msg.text}</p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "10px",
                        opacity: 0.55,
                        textAlign: "right",
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {/* Tool navigation button */}
                  {msg.suggestedTool && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={() =>
                        handleNavigate(msg.suggestedTool!.navigationAction)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 14px",
                        borderRadius: "20px",
                        background: "rgba(184,255,74,0.12)",
                        border: "1px solid rgba(184,255,74,0.4)",
                        color: "#B8FF4A",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        maxWidth: "82%",
                      }}
                    >
                      <ExternalLink size={12} />
                      {msg.suggestedTool.label}
                    </motion.button>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div
              style={{
                padding: "8px 14px 0",
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                borderTop: "1px solid #24303A",
              }}
            >
              {["SIP advice", "Loan EMI", "My policy", "Risk profile"].map(
                (prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: "#0F141B",
                      border: "1px solid #24303A",
                      color: "#9AA6B2",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    {prompt}
                  </button>
                ),
              )}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 14px 14px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-end",
              }}
            >
              <textarea
                data-ocid="chat.textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about investments, loans, policies..."
                style={{
                  flex: 1,
                  background: "#0F141B",
                  border: "1px solid #24303A",
                  borderRadius: "10px",
                  color: "#EAF0F6",
                  fontSize: "13px",
                  padding: "9px 12px",
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                  maxHeight: "80px",
                  overflowY: "auto",
                }}
              />
              <button
                type="button"
                data-ocid="chat.submit_button"
                onClick={sendMessage}
                disabled={!input.trim()}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: input.trim() ? "#B8FF4A" : "#1A2332",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  color: input.trim() ? "#060A10" : "#4A5568",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
