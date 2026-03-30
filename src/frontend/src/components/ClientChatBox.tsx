import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: number;
}

interface ClientChatBoxProps {
  userId: string;
}

export default function ClientChatBox({ userId }: ClientChatBoxProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const storageKey = `finhealth_chat_${userId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const welcome: ChatMessage = {
        id: "welcome",
        text: "Welcome to FinHealth India! How can we help you today? \uD83C\uDF1F",
        sender: "admin",
        timestamp: Date.now(),
      };
      setMessages([welcome]);
      localStorage.setItem(storageKey, JSON.stringify([welcome]));
    }
  }, [storageKey]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      sender: "user",
      timestamp: Date.now(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
        <MessageCircle size={24} />
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
              width: "380px",
              height: "500px",
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
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(184,255,74,0.15)",
                    border: "1px solid rgba(184,255,74,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MessageCircle size={18} style={{ color: "#B8FF4A" }} />
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
                    FinHealth Support
                  </p>
                  <p style={{ color: "#B8FF4A", fontSize: "11px", margin: 0 }}>
                    ● Online
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
                gap: "10px",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "9px 13px",
                      borderRadius:
                        msg.sender === "user"
                          ? "14px 14px 4px 14px"
                          : "14px 14px 14px 4px",
                      background: msg.sender === "user" ? "#B8FF4A" : "#0F141B",
                      color: msg.sender === "user" ? "#060A10" : "#EAF0F6",
                      fontSize: "13px",
                      border:
                        msg.sender === "admin" ? "1px solid #24303A" : "none",
                    }}
                  >
                    <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "10px",
                        opacity: 0.6,
                        textAlign: "right",
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "12px 14px",
                borderTop: "1px solid #24303A",
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
                placeholder="Type your message..."
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
