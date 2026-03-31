import { ArrowLeft, Check, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  initialMode?: "login" | "signup";
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}

interface StoredUser {
  email: string;
  passwordHash: string;
  name: string;
  userId: string;
  createdAt: string;
}

interface AuthSession {
  userId: string;
  email: string;
  name: string;
  loginType: string;
  token: string;
  createdAt: string;
}

function getUsersDb(): StoredUser[] {
  try {
    const raw = localStorage.getItem("finhealth_users_db");
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsersDb(users: StoredUser[]): void {
  localStorage.setItem("finhealth_users_db", JSON.stringify(users));
}

function saveSession(session: AuthSession): void {
  localStorage.setItem("finhealth_auth_session", JSON.stringify(session));
}

export default function LoginPage({
  onLoginSuccess,
  onBack,
  initialMode = "login",
}: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);

  // Auto-login check
  useEffect(() => {
    const session = localStorage.getItem("finhealth_auth_session");
    if (session) {
      try {
        JSON.parse(session);
        onLoginSuccess();
      } catch {
        localStorage.removeItem("finhealth_auth_session");
      }
    }
  }, [onLoginSuccess]);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const canSubmit =
    captchaVerified &&
    termsAccepted &&
    email.length > 0 &&
    password.length >= 6 &&
    (mode === "login" || name.trim().length > 0);

  function handleGoogleLogin() {
    const userId = `google_${Date.now()}`;
    const session: AuthSession = {
      userId,
      email: `user_${Date.now()}@gmail.com`,
      name: "Google User",
      loginType: "google",
      token: btoa(userId),
      createdAt: new Date().toISOString(),
    };
    saveSession(session);
    localStorage.setItem("finhealth_google_user_id", userId);
    onLoginSuccess();
  }

  function handleAppleLogin() {
    const userId = `apple_${Date.now()}`;
    const session: AuthSession = {
      userId,
      email: `user_${Date.now()}@icloud.com`,
      name: "Apple User",
      loginType: "apple",
      token: btoa(userId),
      createdAt: new Date().toISOString(),
    };
    saveSession(session);
    onLoginSuccess();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!validateEmail(email))
      newErrors.email = "Please enter a valid email address";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (mode === "signup" && !name.trim())
      newErrors.name = "Full name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    const users = getUsersDb();

    if (mode === "login") {
      const found = users.find(
        (u) => u.email === email && u.passwordHash === btoa(password),
      );
      if (!found) {
        setErrors({ general: "Invalid email or password" });
        setLoading(false);
        return;
      }
      const session: AuthSession = {
        userId: found.userId,
        email: found.email,
        name: found.name,
        loginType: "email",
        token: btoa(`${found.userId}:${Date.now()}`),
        createdAt: new Date().toISOString(),
      };
      saveSession(session);
      onLoginSuccess();
    } else {
      const duplicate = users.find((u) => u.email === email);
      if (duplicate) {
        setErrors({ general: "An account with this email already exists" });
        setLoading(false);
        return;
      }
      const userId = `email_${Date.now()}`;
      const newUser: StoredUser = {
        email,
        passwordHash: btoa(password),
        name: name.trim(),
        userId,
        createdAt: new Date().toISOString(),
      };
      saveUsersDb([...users, newUser]);
      const session: AuthSession = {
        userId,
        email,
        name: name.trim(),
        loginType: "email",
        token: btoa(`${userId}:${Date.now()}`),
        createdAt: new Date().toISOString(),
      };
      saveSession(session);
      onLoginSuccess();
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{
        background: "#060A10",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(184,255,74,0.06) 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* Back button */}
      <button
        type="button"
        data-ocid="login.back_button"
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-all hover:text-white"
        style={{ color: "#9AA6B2" }}
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-2xl shadow-2xl p-8"
          style={{
            background: "#0d1421",
            border: "1px solid #1e2d3d",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield size={22} style={{ color: "#B8FF4A" }} />
              <span
                className="text-2xl font-bold tracking-tight"
                style={{
                  color: "#B8FF4A",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                FinHealth
              </span>
            </div>
            <p className="text-sm" style={{ color: "#6B7B8D" }}>
              Secure access to your financial intelligence
            </p>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              data-ocid="login.google_button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "#0d1421",
                border: "1px solid #2a3d50",
                color: "#EAF0F6",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                role="img"
                aria-label="Google"
              >
                <title>Google</title>
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              data-ocid="login.apple_button"
              onClick={handleAppleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "#0d1421",
                border: "1px solid #2a3d50",
                color: "#EAF0F6",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 814 1000"
                fill="#EAF0F6"
                role="img"
                aria-label="Apple"
              >
                <title>Apple</title>
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 680.5 0 577.5 0 486.2C0 328.8 110.8 227 220 227c69.7 0 127.7 45.9 170.3 45.9 41 0 106.3-48.4 183.9-48.4 29.7 0 130.3 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: "#1e2d3d" }} />
            <span className="text-xs font-medium" style={{ color: "#4A5568" }}>
              OR
            </span>
            <div className="flex-1 h-px" style={{ background: "#1e2d3d" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General error */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  data-ocid="login.error_state"
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(248,113,113,0.12)",
                    color: "#F87171",
                    border: "1px solid rgba(248,113,113,0.25)",
                  }}
                >
                  {errors.general}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name (signup only) */}
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "#9AA6B2" }}
                    >
                      Full Name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      data-ocid="login.name_input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "#0a1628",
                        border: errors.name
                          ? "1px solid #F87171"
                          : nameFocused
                            ? "1px solid #B8FF4A"
                            : "1px solid #2a3d50",
                        color: "#EAF0F6",
                      }}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs" style={{ color: "#F87171" }}>
                        {errors.name}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#9AA6B2" }}
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                data-ocid="login.email_input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#0a1628",
                  border: errors.email
                    ? "1px solid #F87171"
                    : emailFocused
                      ? "1px solid #B8FF4A"
                      : "1px solid #2a3d50",
                  color: "#EAF0F6",
                }}
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: "#F87171" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#9AA6B2" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  data-ocid="login.password_input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#0a1628",
                    border: errors.password
                      ? "1px solid #F87171"
                      : passwordFocused
                        ? "1px solid #B8FF4A"
                        : "1px solid #2a3d50",
                    color: "#EAF0F6",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#6B7B8D" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: "#F87171" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Cloudflare Turnstile simulation */}
            <button
              type="button"
              data-ocid="login.captcha_toggle"
              className="w-full rounded-xl p-4 flex items-center gap-4 cursor-pointer select-none transition-all text-left"
              style={{
                background: "#0a1628",
                border: captchaVerified
                  ? "1px solid #B8FF4A"
                  : "1px solid #2a3d50",
              }}
              onClick={() => {
                if (!captchaVerified) setCaptchaVerified(true);
              }}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: captchaVerified ? "#B8FF4A" : "transparent",
                  border: captchaVerified ? "none" : "2px solid #2a3d50",
                }}
              >
                {captchaVerified && (
                  <Check size={14} style={{ color: "#060A10" }} />
                )}
              </div>
              <span
                className="text-sm"
                style={{ color: captchaVerified ? "#EAF0F6" : "#9AA6B2" }}
              >
                {captchaVerified
                  ? "Verified — You're human ✓"
                  : "I'm not a robot"}
              </span>
              <div className="ml-auto flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    role="img"
                    aria-label="Cloudflare Turnstile"
                  >
                    <title>Cloudflare Turnstile</title>
                    <circle cx="25" cy="25" r="25" fill="#F38020" />
                    <path
                      d="M25 10 C17 10 10 16 10 25 C10 34 17 40 25 40 C33 40 40 34 40 25 C40 16 33 10 25 10Z"
                      fill="white"
                      opacity="0.9"
                    />
                    <circle cx="25" cy="25" r="8" fill="#F38020" />
                  </svg>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#F38020" }}
                  >
                    Turnstile
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: "#4A5568" }}>
                  Privacy
                </span>
              </div>
            </button>

            {/* Terms */}
            <button
              type="button"
              data-ocid="login.terms_checkbox"
              onClick={() => setTermsAccepted(!termsAccepted)}
              className="flex items-start gap-3 w-full text-left"
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  background: termsAccepted ? "#B8FF4A" : "transparent",
                  border: termsAccepted ? "none" : "2px solid #2a3d50",
                }}
              >
                {termsAccepted && (
                  <Check size={12} style={{ color: "#060A10" }} />
                )}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#6B7B8D" }}
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="underline hover:opacity-80 transition-opacity"
                  style={{ color: "#B8FF4A" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="underline hover:opacity-80 transition-opacity"
                  style={{ color: "#B8FF4A" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </p>
            </button>

            {/* Submit */}
            <button
              type="submit"
              data-ocid="login.submit_button"
              disabled={!canSubmit || loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: canSubmit && !loading ? "#B8FF4A" : "#1e2d3d",
                color: canSubmit && !loading ? "#060A10" : "#4A5568",
                cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span data-ocid="login.loading_state">
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                </>
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-3 text-center">
            <button
              type="button"
              data-ocid="login.forgot_password_button"
              onClick={() => alert("Password reset email sent (demo)")}
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: "#6B7B8D" }}
            >
              Forgot Password?
            </button>

            <p className="text-xs" style={{ color: "#4A5568" }}>
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    data-ocid="login.switch_to_signup"
                    onClick={() => {
                      setMode("signup");
                      setErrors({});
                    }}
                    className="font-semibold transition-colors hover:opacity-80"
                    style={{ color: "#B8FF4A" }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    data-ocid="login.switch_to_login"
                    onClick={() => {
                      setMode("login");
                      setErrors({});
                    }}
                    className="font-semibold transition-colors hover:opacity-80"
                    style={{ color: "#B8FF4A" }}
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Legal note */}
          <p
            className="mt-6 text-center text-[10px]"
            style={{ color: "#374151" }}
          >
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
