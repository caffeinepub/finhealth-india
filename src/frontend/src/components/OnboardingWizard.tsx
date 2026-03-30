import { ChevronRight, Eye, EyeOff, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type RiskProfile = "Conservative" | "Balanced" | "Aggressive";

const riskMap: Record<"Low" | "Medium" | "High", RiskProfile> = {
  Low: "Conservative",
  Medium: "Balanced",
  High: "Aggressive",
};

interface OnboardingWizardProps {
  onComplete: (data: {
    income: number;
    riskProfile: RiskProfile;
    goals: string[];
  }) => void;
}

const inputStyle: React.CSSProperties = {
  background: "#0F141B",
  border: "1px solid #24303A",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#EAF0F6",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#9AA6B2",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

export default function OnboardingWizard({
  onComplete,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);

  // Step 1 — Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  // Step 2 — KYC
  const [panNumber, setPanNumber] = useState("");
  const [dob, setDob] = useState("");
  const [consent, setConsent] = useState(false);
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // Step 3 — Profile
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [riskAppetite, setRiskAppetite] = useState<
    "Low" | "Medium" | "High" | null
  >(null);
  const [goals, setGoals] = useState("");
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!mobile.trim()) {
      errs.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      errs.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2() {
    const errs: Record<string, string> = {};
    if (!panNumber.trim()) {
      errs.pan = "PAN number is required.";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      errs.pan = "Invalid PAN format. Example: ABCDE1234F";
    }
    if (!dob) errs.dob = "Date of birth is required.";
    setStep2Errors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3() {
    const errs: Record<string, string> = {};
    if (!income || Number(income) <= 0)
      errs.income = "Enter a valid monthly income.";
    if (!savings || Number(savings) < 0)
      errs.savings = "Enter a valid monthly savings amount.";
    if (!riskAppetite) errs.risk = "Please select your risk appetite.";
    setStep3Errors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleStep1Submit() {
    if (validateStep1()) setStep(2);
  }

  function handleStep2Submit() {
    if (validateStep2()) setStep(3);
  }

  function handleStep3Submit() {
    if (!validateStep3()) return;
    const userId = btoa(email)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 12);
    const parsedGoals = goals
      ? goals
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
      : [];
    const profile = riskMap[riskAppetite!];
    localStorage.setItem(
      `finhealth_user_${userId}`,
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        panNumber: panNumber.trim(),
        dob,
        income: Number(income),
        savings: Number(savings),
        riskProfile: profile,
        goals: parsedGoals,
        kycStatus: "completed",
        createdAt: new Date().toISOString(),
      }),
    );
    onComplete({
      income: Number(income),
      riskProfile: profile,
      goals: parsedGoals,
    });
  }

  // ── Shared step indicator ───────────────────────────────────────────────────
  const stepLabels = ["Signup", "KYC", "Profile"];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto"
      style={{ background: "rgba(6,10,16,0.97)", backdropFilter: "blur(12px)" }}
      data-ocid="onboarding.modal"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-lg my-auto"
          style={{
            background: "linear-gradient(135deg, #0F141B 0%, #1A2332 100%)",
            border: "1px solid #24303A",
            borderRadius: 20,
            padding: 32,
          }}
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background:
                        s === step
                          ? "#B8FF4A"
                          : s < step
                            ? "rgba(184,255,74,0.15)"
                            : "rgba(255,255,255,0.04)",
                      color:
                        s === step
                          ? "#060A10"
                          : s < step
                            ? "#B8FF4A"
                            : "#9AA6B2",
                      border: `1.5px solid ${s <= step ? "#B8FF4A" : "#24303A"}`,
                    }}
                    data-ocid={`onboarding.step${s}.button`}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      color:
                        s === step
                          ? "#B8FF4A"
                          : s < step
                            ? "#6ECC2A"
                            : "#4A5568",
                      fontWeight: s === step ? 700 : 400,
                    }}
                  >
                    {stepLabels[s - 1]}
                  </span>
                </div>
                {s < 3 && (
                  <div
                    className="w-14 h-px mb-4 mx-1"
                    style={{ background: s < step ? "#B8FF4A" : "#24303A" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 1: SIGNUP ── */}
          {step === 1 && (
            <div>
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: "#EAF0F6" }}
              >
                Create Your Account
              </h2>
              <p className="text-sm mb-6" style={{ color: "#9AA6B2" }}>
                Start your FinHealth India journey
              </p>

              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="s1-name" style={labelStyle}>
                  Full Name
                </label>
                <input
                  id="s1-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  style={inputStyle}
                  data-ocid="onboarding.step1.input"
                />
                {step1Errors.name && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.name.error_state"
                  >
                    {step1Errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="s1-email" style={labelStyle}>
                  Email Address
                </label>
                <input
                  id="s1-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  style={inputStyle}
                  data-ocid="onboarding.step1.input"
                />
                {step1Errors.email && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.email.error_state"
                  >
                    {step1Errors.email}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div className="mb-4">
                <label htmlFor="s1-mobile" style={labelStyle}>
                  Mobile Number
                </label>
                <input
                  id="s1-mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10-digit mobile number"
                  style={inputStyle}
                  data-ocid="onboarding.step1.input"
                />
                {step1Errors.mobile && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.mobile.error_state"
                  >
                    {step1Errors.mobile}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor="s1-password" style={labelStyle}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="s1-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={{ ...inputStyle, paddingRight: 44 }}
                    data-ocid="onboarding.step1.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: "#9AA6B2",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    data-ocid="onboarding.password.toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {step1Errors.password && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.password.error_state"
                  >
                    {step1Errors.password}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleStep1Submit}
                data-ocid="onboarding.step1.primary_button"
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "#B8FF4A",
                  color: "#060A10",
                  cursor: "pointer",
                }}
              >
                Continue to KYC <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 2: KYC ── */}
          {step === 2 && (
            <div>
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: "#EAF0F6" }}
              >
                KYC Verification
              </h2>
              <p className="text-sm mb-5" style={{ color: "#9AA6B2" }}>
                Verify your identity to access all features
              </p>

              {/* Disclaimer banner */}
              <div
                className="flex items-start gap-2 p-3 rounded-xl mb-5"
                style={{
                  background: "rgba(255,190,10,0.07)",
                  border: "1px solid rgba(255,190,10,0.25)",
                }}
              >
                <Shield
                  size={14}
                  style={{ color: "#FFBE0B", flexShrink: 0, marginTop: 2 }}
                />
                <p className="text-xs" style={{ color: "#C8A84B" }}>
                  We do not store or share your financial data without consent.
                  For educational purposes only.
                </p>
              </div>

              {/* PAN Number */}
              <div className="mb-4">
                <label htmlFor="s2-pan" style={labelStyle}>
                  PAN Number
                </label>
                <input
                  id="s2-pan"
                  type="text"
                  value={panNumber}
                  onChange={(e) =>
                    setPanNumber(e.target.value.toUpperCase().slice(0, 10))
                  }
                  placeholder="e.g. ABCDE1234F"
                  style={{
                    ...inputStyle,
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                  }}
                  data-ocid="onboarding.step2.input"
                />
                {step2Errors.pan && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.pan.error_state"
                  >
                    {step2Errors.pan}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="mb-5">
                <label htmlFor="s2-dob" style={labelStyle}>
                  Date of Birth
                </label>
                <input
                  id="s2-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{
                    ...inputStyle,
                    colorScheme: "dark",
                  }}
                  data-ocid="onboarding.step2.input"
                />
                {step2Errors.dob && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.dob.error_state"
                  >
                    {step2Errors.dob}
                  </p>
                )}
              </div>

              {/* Consent checkbox */}
              <label
                htmlFor="kyc-consent"
                className="flex items-start gap-3 mb-6 cursor-pointer"
                style={{
                  background: consent
                    ? "rgba(184,255,74,0.05)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${consent ? "rgba(184,255,74,0.3)" : "#24303A"}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    id="kyc-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="sr-only"
                    data-ocid="onboarding.step2.checkbox"
                  />
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{
                      background: consent ? "#B8FF4A" : "transparent",
                      border: `1.5px solid ${consent ? "#B8FF4A" : "#4A5568"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    {consent && (
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 4L4.5 7.5L11 1"
                          stroke="#060A10"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span
                  className="text-sm"
                  style={{ color: consent ? "#EAF0F6" : "#9AA6B2" }}
                >
                  I consent to use my data for financial analysis
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  data-ocid="onboarding.step2.cancel_button"
                  className="px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#9AA6B2",
                    border: "1px solid #24303A",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep2Submit}
                  disabled={!consent}
                  data-ocid="onboarding.step2.primary_button"
                  className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: consent ? "#B8FF4A" : "rgba(184,255,74,0.2)",
                    color: consent ? "#060A10" : "#4A5568",
                    cursor: consent ? "pointer" : "not-allowed",
                  }}
                >
                  Verify & Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: PROFILE COMPLETION ── */}
          {step === 3 && (
            <div>
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: "#EAF0F6" }}
              >
                Complete Your Profile
              </h2>
              <p className="text-sm mb-6" style={{ color: "#9AA6B2" }}>
                Help us personalize your financial dashboard
              </p>

              {/* Monthly Income */}
              <div className="mb-4">
                <label htmlFor="s3-income" style={labelStyle}>
                  Monthly Income (₹)
                </label>
                <input
                  id="s3-income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 75000"
                  min="0"
                  style={inputStyle}
                  data-ocid="onboarding.step3.input"
                />
                {step3Errors.income && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.income.error_state"
                  >
                    {step3Errors.income}
                  </p>
                )}
              </div>

              {/* Monthly Savings */}
              <div className="mb-4">
                <label htmlFor="s3-savings" style={labelStyle}>
                  Monthly Savings (₹)
                </label>
                <input
                  id="s3-savings"
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="e.g. 15000"
                  min="0"
                  style={inputStyle}
                  data-ocid="onboarding.step3.input"
                />
                {step3Errors.savings && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.savings.error_state"
                  >
                    {step3Errors.savings}
                  </p>
                )}
              </div>

              {/* Risk Appetite */}
              <div className="mb-4">
                <p style={{ ...labelStyle, marginBottom: 10 }}>Risk Appetite</p>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRiskAppetite(r)}
                      data-ocid="onboarding.step3.toggle"
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background:
                          riskAppetite === r
                            ? "#B8FF4A"
                            : "rgba(255,255,255,0.04)",
                        color: riskAppetite === r ? "#060A10" : "#9AA6B2",
                        border: `1px solid ${riskAppetite === r ? "#B8FF4A" : "#24303A"}`,
                        cursor: "pointer",
                      }}
                    >
                      {r === "Low"
                        ? "🛡️ Low"
                        : r === "Medium"
                          ? "⚖️ Medium"
                          : "🚀 High"}
                    </button>
                  ))}
                </div>
                {step3Errors.risk && (
                  <p
                    className="text-red-400 text-xs mt-1"
                    data-ocid="onboarding.risk.error_state"
                  >
                    {step3Errors.risk}
                  </p>
                )}
              </div>

              {/* Financial Goals */}
              <div className="mb-6">
                <label htmlFor="s3-goals" style={labelStyle}>
                  Financial Goals{" "}
                  <span
                    style={{
                      color: "#4A5568",
                      fontWeight: 400,
                      textTransform: "none",
                    }}
                  >
                    (optional, comma-separated)
                  </span>
                </label>
                <input
                  id="s3-goals"
                  type="text"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Retirement, Home Purchase, Child Education"
                  style={inputStyle}
                  data-ocid="onboarding.step3.input"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  data-ocid="onboarding.step3.cancel_button"
                  className="px-6 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#9AA6B2",
                    border: "1px solid #24303A",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep3Submit}
                  data-ocid="onboarding.step3.primary_button"
                  className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "#B8FF4A",
                    color: "#060A10",
                    cursor: "pointer",
                  }}
                >
                  🚀 Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
