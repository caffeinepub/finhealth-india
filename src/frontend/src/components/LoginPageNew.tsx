import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPageNew() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  const doLogin = (gName?: string, gEmail?: string) => {
    login({
      name: gName || name || (email.split("@")[0] ?? "User"),
      email: gEmail || email,
      income: 85000,
      expenses: 52000,
      savings: 32000,
      investments: 0,
      goals: [],
      kyc_status: "Pending",
      plan: "free",
      riskProfile: "moderate",
      createdAt: new Date().toISOString(),
    });
    navigate("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (mode === "signup" && !agreed) {
      setError("Please accept the terms");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      doLogin();
    }, 1200);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      doLogin("Demo User", "demo@gmail.com");
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "#070A12" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "45%",
            height: "45%",
            background:
              "radial-gradient(ellipse, rgba(47,230,255,0.08) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "40%",
            height: "40%",
            background:
              "radial-gradient(ellipse, rgba(122,60,255,0.1) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color: "#9AA6BF" }}
          data-ocid="login.back_link"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-btn flex items-center justify-center mx-auto mb-3">
              <Sparkles size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">FinHealth AI</h1>
            <p className="text-sm mt-1" style={{ color: "#9AA6BF" }}>
              Secure access to your financial intelligence
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl mb-4 font-medium text-sm transition-all"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#F2F5FF",
            }}
            data-ocid="login.google_button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path
                fill="#FBBC05"
                d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"
              />
              <path
                fill="#EA4335"
                d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            <span className="text-xs" style={{ color: "#9AA6BF" }}>
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-ocid="login.modal"
          >
            {mode === "signup" && (
              <div>
                <div className="fin-label">Full Name</div>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9AA6BF" }}
                  />
                  <input
                    className="fin-input"
                    style={{ paddingLeft: "36px" }}
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-ocid="login.name_input"
                  />
                </div>
              </div>
            )}
            <div>
              <div className="fin-label">Email Address</div>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9AA6BF" }}
                />
                <input
                  type="email"
                  className="fin-input"
                  style={{ paddingLeft: "36px" }}
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="login.email_input"
                />
              </div>
            </div>
            <div>
              <div className="fin-label">Password</div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9AA6BF" }}
                />
                <input
                  type={showPwd ? "text" : "password"}
                  className="fin-input"
                  style={{ paddingLeft: "36px", paddingRight: "36px" }}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-ocid="login.password_input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ color: "#9AA6BF" }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  data-ocid="login.terms_checkbox"
                />
                <span className="text-xs" style={{ color: "#9AA6BF" }}>
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="underline"
                    style={{ color: "#2FE6FF" }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="underline"
                    style={{ color: "#2FE6FF" }}
                  >
                    Privacy Policy
                  </Link>
                  . Platform outputs are for informational purposes only.
                </span>
              </div>
            )}

            {error && (
              <p
                className="text-xs text-red-400 py-2 px-3 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)" }}
                data-ocid="login.error_state"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              data-ocid="login.submit_button"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div
            className="mt-4 text-center text-sm"
            style={{ color: "#9AA6BF" }}
          >
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              className="font-medium"
              style={{ color: "#2FE6FF" }}
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

          {mode === "login" && (
            <div className="mt-2 text-center">
              <Link
                to="/signup"
                className="text-xs"
                style={{ color: "#2FE6FF" }}
                data-ocid="login.signup_link"
              >
                New user? Create account →
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#9AA6BF" }}>
          All data is for informational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
