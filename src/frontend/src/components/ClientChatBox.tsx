import { Bot, ExternalLink, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

const BOUNCE_STYLE = `
@keyframes chatBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
  40% { transform: translateY(-6px); opacity: 1; }
}
`;

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
  insight?: string;
  isError?: boolean;
  suggestedTool?: {
    label: string;
    navigationAction: string;
  };
}

// Firestore-like schema: users/{userId}/chats/
interface ChatRecord {
  message: string;
  sender: "user" | "bot";
  timestamp: number;
}

interface PortfolioItem {
  type?: string;
  category?: string;
  amount?: number;
}

interface ClientChatBoxProps {
  userId: string;
  onNavigate?: (tab: string, subTab?: string) => void;
  onChatQuery?: () => void;
}

// Read portfolio from localStorage (same key used by Dashboard/Portfolio tab)
function loadPortfolio(userId: string): PortfolioItem[] {
  const keys = [
    `finhealth_portfolio_${userId}`,
    "finhealth_portfolio",
    `portfolio_${userId}`,
    "portfolio",
  ];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
  }
  return [];
}

function loadGoals(userId: string): unknown[] {
  const keys = [
    `finhealth_goals_${userId}`,
    "finhealth_goals",
    `goals_${userId}`,
    "goals",
  ];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
  }
  return [];
}

function loadRiskProfile(userId: string): string | null {
  const keys = [
    `finhealth_riskProfile_${userId}`,
    "finhealth_riskProfile",
    `riskProfile_${userId}`,
    "riskProfile",
  ];
  for (const key of keys) {
    const val = localStorage.getItem(key);
    if (val) return val;
  }
  // Also check nested profile
  const profileRaw =
    localStorage.getItem(`finhealth_profile_${userId}`) ||
    localStorage.getItem("finhealth_profile");
  if (profileRaw) {
    try {
      const profile = JSON.parse(profileRaw);
      if (profile?.riskProfile) return profile.riskProfile;
      if (profile?.riskAppetite) return profile.riskAppetite;
    } catch {
      // ignore
    }
  }
  return null;
}

// Returns context-aware reply if triggered, else null (fall through to backend)
function getContextAwareReply(
  portfolio: PortfolioItem[],
  goals: unknown[],
): { reply: string; action?: string } | null {
  if (portfolio.length === 0) {
    return {
      reply:
        "Start by adding your portfolio in Dashboard to get better insights.",
      action: "dashboard",
    };
  }

  // Calculate equity percentage
  const equityCategories = ["equity", "stocks", "shares"];
  const totalAmount = portfolio.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );
  const equityAmount = portfolio
    .filter(
      (item) =>
        equityCategories.includes((item.category || "").toLowerCase()) ||
        equityCategories.includes((item.type || "").toLowerCase()),
    )
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  if (totalAmount > 0) {
    const equityPct = (equityAmount / totalAmount) * 100;
    if (equityPct > 70) {
      return {
        reply: `Your portfolio has high equity exposure (${Math.round(equityPct)}% > 70%). Consider rebalancing to reduce risk.`,
        action: "rebalancing",
      };
    }
  }

  if (goals.length === 0) {
    return {
      reply:
        "You have not set any financial goals. Use Goal Planner to get started.",
      action: "goal-planner",
    };
  }

  return null;
}

// Persist a chat record in localStorage (mirroring Firestore users/{userId}/chats/)
function persistChatRecord(userId: string, record: ChatRecord) {
  const key = `finhealth_chats_${userId}`;
  const existing: ChatRecord[] = [];
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing.push(...parsed);
    } catch {
      // ignore
    }
  }
  existing.push(record);
  localStorage.setItem(key, JSON.stringify(existing));
}

// Load chat records from localStorage
function loadChatRecords(userId: string): ChatRecord[] {
  const key = `finhealth_chats_${userId}`;
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return [];
}

export default function ClientChatBox({
  userId,
  onNavigate,
  onChatQuery,
}: ClientChatBoxProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserText, setLastUserText] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [goals, setGoals] = useState<unknown[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { actor } = useActor();

  // Load user context data on mount
  useEffect(() => {
    setPortfolio(loadPortfolio(userId));
    setGoals(loadGoals(userId));
    loadRiskProfile(userId); // load but store if needed in future
  }, [userId]);

  // Load chat history from localStorage (Firestore mirror)
  useEffect(() => {
    const records = loadChatRecords(userId);
    if (records.length > 0) {
      // Convert stored records back to ChatMessage format, sorted by timestamp
      const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);
      const converted: ChatMessage[] = sorted.map((r, i) => ({
        id: `hist-${i}-${r.timestamp}`,
        text: r.message,
        sender: r.sender === "bot" ? "assistant" : "user",
        timestamp: r.timestamp,
      }));
      setMessages(converted);
    } else {
      const welcome: ChatMessage = {
        id: "welcome",
        text: "Hi! I'm your Smart Financial Assistant. Ask me about your investments, SIP, loans, policies, risk profile, or any financial topic.",
        sender: "assistant",
        timestamp: Date.now(),
      };
      setMessages([welcome]);
      persistChatRecord(userId, {
        message: welcome.text,
        sender: "bot",
        timestamp: welcome.timestamp,
      });
    }
  }, [userId]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages or loading
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const addMessages = (newMsgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...newMsgs]);
  };

  const clearChat = () => {
    localStorage.removeItem(`finhealth_chats_${userId}`);
    const confirmMsg: ChatMessage = {
      id: `${Date.now()}-clear`,
      text: "Chat history cleared.",
      sender: "assistant",
      timestamp: Date.now(),
    };
    setMessages([confirmMsg]);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    onChatQuery?.();

    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      text,
      sender: "user",
      timestamp: Date.now(),
    };

    addMessages([userMsg]);
    persistChatRecord(userId, {
      message: text,
      sender: "user",
      timestamp: userMsg.timestamp,
    });
    setInput("");
    setLastUserText(text);
    setIsLoading(true);

    try {
      // Context-aware check first (no backend call needed)
      const contextReply = getContextAwareReply(portfolio, goals);
      if (contextReply) {
        const botMsg: ChatMessage = {
          id: `${Date.now()}-b`,
          text: contextReply.reply,
          sender: "assistant",
          timestamp: Date.now(),
          suggestedTool: contextReply.action
            ? { label: "Open Tool", navigationAction: contextReply.action }
            : undefined,
        };
        addMessages([botMsg]);
        persistChatRecord(userId, {
          message: botMsg.text,
          sender: "bot",
          timestamp: botMsg.timestamp,
        });
        return;
      }

      // Try AI chat via Motoko backend actor
      let aiReply: { reply: string; insight?: string; action?: string } | null =
        null;
      try {
        if (!actor) throw new Error("Actor not ready");
        const result = await actor.processChat(text);
        aiReply = {
          reply: result.reply,
          action: result.action || undefined,
        };
      } catch {
        // actor.processChat unavailable or failed, fall through below
      }

      if (aiReply) {
        const botMsg: ChatMessage = {
          id: `${Date.now()}-b`,
          text: aiReply.reply,
          sender: "assistant",
          timestamp: Date.now(),
          insight: aiReply.insight,
          suggestedTool: aiReply.action
            ? { label: "Open Tool", navigationAction: aiReply.action }
            : undefined,
        };
        addMessages([botMsg]);
        persistChatRecord(userId, {
          message: botMsg.text,
          sender: "bot",
          timestamp: botMsg.timestamp,
        });
        return;
      }

      // Fallback: backend keyword-based response
      if (!actor) throw new Error("Actor not ready");
      const response = await actor.processChat(text);
      const botMsg: ChatMessage = {
        id: `${Date.now()}-b`,
        text: response.reply,
        sender: "assistant",
        timestamp: Date.now(),
        suggestedTool: response.action
          ? { label: "Open Tool", navigationAction: response.action }
          : undefined,
      };
      addMessages([botMsg]);
      persistChatRecord(userId, {
        message: botMsg.text,
        sender: "bot",
        timestamp: botMsg.timestamp,
      });
    } catch {
      const errMsg: ChatMessage = {
        id: `${Date.now()}-err`,
        text: "Sorry, I couldn't process your request.",
        sender: "assistant",
        timestamp: Date.now(),
        isError: true,
      };
      addMessages([errMsg]);
      persistChatRecord(userId, {
        message: errMsg.text,
        sender: "bot",
        timestamp: errMsg.timestamp,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNavigate = (action: string) => {
    if (onNavigate) {
      if (action === "policy-analyzer") {
        onNavigate("tools", "policy");
      } else if (action === "sip-calculator") {
        onNavigate("sip-calculator");
      } else if (action === "loan-prepayment") {
        onNavigate("tools", "loan");
      } else if (action === "risk-profile") {
        onNavigate("tools", "risk");
      } else if (action === "goal-planner") {
        onNavigate("tools", "goals");
      } else if (action === "rebalancing") {
        onNavigate("tools", "rebalancing");
      } else if (action === "dashboard") {
        onNavigate("dashboard");
      } else {
        onNavigate(action);
      }
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
      <style>{BOUNCE_STYLE}</style>

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
              height: "560px",
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  type="button"
                  data-ocid="chat.secondary_button"
                  onClick={clearChat}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9AA6B2",
                    fontSize: "11px",
                    padding: "4px 6px",
                    borderRadius: "6px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#B8FF4A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#9AA6B2";
                  }}
                >
                  Clear Chat
                </button>
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
                  {msg.isError ? (
                    <div
                      data-ocid="chat.error_state"
                      style={{
                        maxWidth: "82%",
                        padding: "10px 14px",
                        borderRadius: "14px 14px 14px 4px",
                        background: "rgba(255,74,74,0.08)",
                        border: "1px solid rgba(255,74,74,0.3)",
                        fontSize: "13px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontWeight: 700,
                          color: "#FF4A4A",
                          fontSize: 12,
                        }}
                      >
                        Something went wrong
                      </p>
                      <p
                        style={{
                          margin: "0 0 8px",
                          lineHeight: 1.5,
                          color: "#EAF0F6",
                        }}
                      >
                        {msg.text} Please try again.
                      </p>
                      <button
                        type="button"
                        data-ocid="chat.secondary_button"
                        onClick={() => {
                          if (lastUserText) setInput(lastUserText);
                        }}
                        style={{
                          background: "rgba(255,74,74,0.15)",
                          border: "1px solid rgba(255,74,74,0.4)",
                          borderRadius: 6,
                          color: "#FF4A4A",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          cursor: "pointer",
                        }}
                      >
                        ↩ Retry
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        maxWidth: "82%",
                        padding: "10px 14px",
                        borderRadius:
                          msg.sender === "user"
                            ? "14px 14px 4px 14px"
                            : "14px 14px 14px 4px",
                        background:
                          msg.sender === "user" ? "#B8FF4A" : "#0F141B",
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
                  )}

                  {/* Smart Insight card */}
                  {msg.insight && (
                    <div
                      style={{
                        maxWidth: "82%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "#0F141B",
                        border: "1px solid #B8FF4A",
                        marginTop: "2px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#B8FF4A",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        💡 Smart Insight
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#EAF0F6",
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.insight}
                      </p>
                    </div>
                  )}

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

              {/* Typing indicator */}
              {isLoading && (
                <div
                  data-ocid="chat.loading_state"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "10px 14px",
                    background: "#0F141B",
                    borderRadius: "14px 14px 14px 4px",
                    border: "1px solid #24303A",
                    width: "fit-content",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#B8FF4A",
                        animation: "chatBounce 1.2s infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              )}

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
              {[
                "Analyze my policy",
                "Plan SIP",
                "Check goals",
                "Loan EMI",
                "Risk profile",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  disabled={isLoading}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    background: "#0F141B",
                    border: "1px solid #24303A",
                    color: isLoading ? "#4A5568" : "#9AA6B2",
                    fontSize: "11px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 14px 4px",
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
                disabled={isLoading}
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
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
              <button
                type="button"
                data-ocid="chat.submit_button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background:
                    input.trim() && !isLoading ? "#B8FF4A" : "#1A2332",
                  border: "none",
                  cursor:
                    input.trim() && !isLoading ? "pointer" : "not-allowed",
                  color: input.trim() && !isLoading ? "#060A10" : "#4A5568",
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

            {/* Disclaimer */}
            <p
              style={{
                margin: 0,
                padding: "6px 14px 10px",
                fontSize: "10px",
                color: "#9AA6B2",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              For educational purposes only. Not investment advice.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
