import {
  ArrowLeft,
  CheckCircle,
  Mail,
  MessageSquare,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#F2F5FF",
    padding: "10px 14px",
    width: "100%",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    color: "#9AA6BF",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "6px",
    display: "block" as const,
  };

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
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Contact Us
        </h1>
        <p className="text-sm mb-8" style={{ color: "#9AA6BF" }}>
          We'd love to hear from you. Send us a message and we'll respond within
          48 hours.
        </p>

        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
          style={{
            background: "rgba(47,230,255,0.06)",
            border: "1px solid rgba(47,230,255,0.2)",
          }}
        >
          <Mail size={16} style={{ color: "#2FE6FF" }} />
          <span className="text-sm" style={{ color: "#9AA6BF" }}>
            support@finhealth.ai
          </span>
        </div>

        {sent ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "rgba(49,233,129,0.08)",
              border: "1px solid rgba(49,233,129,0.3)",
            }}
            data-ocid="contact.success_state"
          >
            <CheckCircle
              size={40}
              style={{ color: "#31E981" }}
              className="mx-auto mb-4"
            />
            <h2 className="text-white font-semibold text-lg mb-2">
              Message Sent!
            </h2>
            <p style={{ color: "#9AA6BF" }}>
              Thank you for reaching out. We'll get back to you within 48 hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl p-6"
            style={{
              background: "rgba(18,24,42,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            data-ocid="contact.modal"
          >
            <div>
              <label htmlFor="contact-name" style={labelStyle}>
                <User size={12} className="inline mr-1" />
                Full Name
              </label>
              <input
                id="contact-name"
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                data-ocid="contact.name_input"
              />
            </div>
            <div>
              <label htmlFor="contact-email" style={labelStyle}>
                <Mail size={12} className="inline mr-1" />
                Email Address
              </label>
              <input
                id="contact-email"
                style={inputStyle}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                data-ocid="contact.email_input"
              />
            </div>
            <div>
              <label htmlFor="contact-message" style={labelStyle}>
                <MessageSquare size={12} className="inline mr-1" />
                Message
              </label>
              <textarea
                id="contact-message"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "120px",
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                required
                data-ocid="contact.textarea"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              data-ocid="contact.submit_button"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
