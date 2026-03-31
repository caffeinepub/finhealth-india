import {
  ArrowLeft,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const GOALS = [
  "Retirement Planning",
  "Wealth Building",
  "Tax Optimization",
  "Emergency Fund",
  "Home Purchase",
  "Children's Education",
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Step 2
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");

  // Step 3
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 4
  const [pan, setPan] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const savingsRate =
    income && savings
      ? ((Number(savings) / Number(income)) * 100).toFixed(0)
      : null;

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (!name.trim()) {
        setError("Name is required");
        return false;
      }
      if (!email.includes("@")) {
        setError("Enter a valid email");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be 6+ characters");
        return false;
      }
      if (password !== confirmPwd) {
        setError("Passwords do not match");
        return false;
      }
    }
    if (step === 2) {
      if (!income || Number(income) <= 0) {
        setError("Enter your monthly income");
        return false;
      }
    }
    if (step === 4) {
      if (!agreed) {
        setError("Please accept the terms to continue");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      login({
        name,
        email,
        income: Number(income) || 85000,
        expenses: Number(expenses) || 52000,
        savings: Number(savings) || 32000,
        investments: 0,
        goals: selectedGoals,
        kyc_status: "Pending",
        pan: pan || undefined,
        plan: "free",
        riskProfile: "moderate",
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative"
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
          to="/login"
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color: "#9AA6BF" }}
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              Create Your Account
            </h1>
            <p className="text-xs mt-1" style={{ color: "#9AA6BF" }}>
              Step {step} of {totalSteps}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    background:
                      n <= step
                        ? "linear-gradient(90deg,#2FE6FF,#7A3CFF)"
                        : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4" data-ocid="signup.modal">
              <div>
                <div className="fin-label">Full Name</div>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9AA6BF" }}
                  />
                  <input
                    className="fin-input"
                    style={{ paddingLeft: "34px" }}
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-ocid="signup.name_input"
                  />
                </div>
              </div>
              <div>
                <div className="fin-label">Email Address</div>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9AA6BF" }}
                  />
                  <input
                    type="email"
                    className="fin-input"
                    style={{ paddingLeft: "34px" }}
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-ocid="signup.email_input"
                  />
                </div>
              </div>
              <div>
                <div className="fin-label">Password</div>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9AA6BF" }}
                  />
                  <input
                    type={showPwd ? "text" : "password"}
                    className="fin-input"
                    style={{ paddingLeft: "34px", paddingRight: "34px" }}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-ocid="signup.password_input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ color: "#9AA6BF" }}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <div className="fin-label">Confirm Password</div>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9AA6BF" }}
                  />
                  <input
                    type="password"
                    className="fin-input"
                    style={{ paddingLeft: "34px" }}
                    placeholder="Repeat password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="fin-label">Monthly Income (₹)</div>
                <input
                  type="number"
                  className="fin-input"
                  placeholder="e.g. 85000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  data-ocid="signup.income_input"
                />
              </div>
              <div>
                <div className="fin-label">Monthly Expenses (₹)</div>
                <input
                  type="number"
                  className="fin-input"
                  placeholder="e.g. 52000"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  data-ocid="signup.expenses_input"
                />
              </div>
              <div>
                <div className="fin-label">Current Savings (₹)</div>
                <input
                  type="number"
                  className="fin-input"
                  placeholder="e.g. 32000"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  data-ocid="signup.savings_input"
                />
              </div>
              {savingsRate && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: "rgba(49,233,129,0.08)",
                    border: "1px solid rgba(49,233,129,0.2)",
                  }}
                >
                  <CheckCircle size={14} style={{ color: "#31E981" }} />
                  <span className="text-xs" style={{ color: "#31E981" }}>
                    Your savings rate: {savingsRate}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <p className="text-sm mb-4" style={{ color: "#9AA6BF" }}>
                Select your financial goals (choose all that apply)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((g) => {
                  const selected = selectedGoals.includes(g);
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className="px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all flex items-center gap-2"
                      style={{
                        background: selected
                          ? "rgba(47,230,255,0.12)"
                          : "rgba(255,255,255,0.05)",
                        border: selected
                          ? "1px solid rgba(47,230,255,0.4)"
                          : "1px solid rgba(255,255,255,0.1)",
                        color: selected ? "#2FE6FF" : "#9AA6BF",
                      }}
                      data-ocid={"signup.goal_toggle"}
                    >
                      {selected && <Check size={12} />}
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <div className="fin-label">
                  PAN Number{" "}
                  <span style={{ color: "#9AA6BF" }}>(optional)</span>
                </div>
                <input
                  className="fin-input"
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  maxLength={10}
                  data-ocid="signup.pan_input"
                />
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{
                  background: "rgba(251,206,36,0.08)",
                  border: "1px solid rgba(251,206,36,0.2)",
                  color: "#FBCE24",
                }}
              >
                KYC Status: Pending — complete after signup
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  data-ocid="signup.terms_checkbox"
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
                  . Outputs are for informational purposes only.
                </span>
              </div>
            </div>
          )}

          {error && (
            <p
              className="text-xs text-red-400 py-2 px-3 rounded-lg mt-4"
              style={{ background: "rgba(239,68,68,0.1)" }}
              data-ocid="signup.error_state"
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9AA6BF",
                }}
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
                data-ocid="signup.back_button"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex-1 gradient-btn py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              data-ocid="signup.next_button"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Creating...
                </>
              ) : step < totalSteps ? (
                "Next →"
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div
            className="mt-4 text-center text-sm"
            style={{ color: "#9AA6BF" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium"
              style={{ color: "#2FE6FF" }}
              data-ocid="signup.login_link"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
