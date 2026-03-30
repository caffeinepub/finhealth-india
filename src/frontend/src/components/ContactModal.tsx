import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: number;
}

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitting(true);
    const entry: ContactMessage = {
      id: `${Date.now()}-${Math.random()}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: Date.now(),
    };
    const existing: ContactMessage[] = JSON.parse(
      localStorage.getItem("finhealth_contact_messages") ?? "[]",
    );
    existing.push(entry);
    localStorage.setItem(
      "finhealth_contact_messages",
      JSON.stringify(existing),
    );
    setName("");
    setEmail("");
    setMessage("");
    setSubmitting(false);
    toast.success("Message sent! We'll get back to you soon.");
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0F141B",
    border: "1px solid #24303A",
    borderRadius: "10px",
    color: "#EAF0F6",
    fontSize: "14px",
    padding: "10px 14px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    color: "#9AA6B2",
    fontSize: "13px",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            data-ocid="contact.modal"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{
              background: "#060A10",
              border: "1px solid #24303A",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #24303A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#EAF0F6",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Contact Us
              </h2>
              <button
                type="button"
                data-ocid="contact.close_button"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9AA6B2",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div>
                <label htmlFor="contact-name" style={labelStyle}>
                  Your Name
                </label>
                <input
                  id="contact-name"
                  data-ocid="contact.input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" style={labelStyle}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  data-ocid="contact.input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-message" style={labelStyle}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  data-ocid="contact.textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                  required
                />
              </div>
              <button
                type="submit"
                data-ocid="contact.submit_button"
                disabled={submitting}
                style={{
                  padding: "11px",
                  borderRadius: "10px",
                  background: "#B8FF4A",
                  color: "#060A10",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
