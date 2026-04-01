import { Check, Crown, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActor } from "../hooks/useActor";
import usePlan from "../hooks/usePlan";

const FEATURES = [
  { label: "Financial Health Score", free: true, pro: true },
  { label: "Basic Tools (SIP, EMI)", free: true, pro: true },
  { label: "Income & Expense Tracking", free: true, pro: true },
  { label: "Smart Alerts", free: true, pro: true },
  { label: "Advanced Insurance IRR Analysis", free: false, pro: true },
  { label: "Tax Optimization Details", free: false, pro: true },
  { label: "AI Advisor", free: "Limited", pro: "Full" },
  { label: "Downloadable Reports", free: false, pro: true },
  { label: "Advanced Analytics & Projections", free: false, pro: true },
  { label: "Policy Comparison (SIP vs FD vs PPF)", free: false, pro: true },
  { label: "Priority Support", free: false, pro: true },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { upgradeToPro } = usePlan();
  const { actor } = useActor();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const priceInCents = selectedPlan === "monthly" ? 19900n : 99900n;
      const items = [
        {
          productName: "FinHealth Pro",
          productDescription:
            selectedPlan === "monthly"
              ? "Monthly Premium Plan"
              : "Annual Premium Plan",
          quantity: 1n,
          priceInCents,
          currency: "INR",
        },
      ];
      const successUrl = `${window.location.origin}/dashboard?upgraded=true`;
      const cancelUrl = `${window.location.origin}/pricing`;
      if (!actor) throw new Error("Actor not ready");
      const sessionUrl = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      window.location.href = sessionUrl;
    } catch {
      upgradeToPro();
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <div className="text-center pt-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
          style={{
            background: "rgba(251,206,36,0.15)",
            border: "1px solid rgba(251,206,36,0.3)",
            color: "#FBCE24",
          }}
        >
          <Crown size={12} /> Plans & Pricing
        </div>
        <h1
          className="text-3xl font-extrabold mb-3"
          style={{
            background: "linear-gradient(90deg, #F2F5FF, #B05CFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "Bricolage Grotesque, sans-serif",
          }}
        >
          Choose Your FinHealth Plan
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: "#9AA6BF" }}>
          Start for free. Upgrade when you're ready for deeper financial
          intelligence.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(18,24,42,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          data-ocid="pricing.free.card"
        >
          <div className="text-xs font-bold mb-3" style={{ color: "#9AA6BF" }}>
            FREE
          </div>
          <div
            className="text-4xl font-extrabold mb-1"
            style={{
              color: "#F2F5FF",
              fontFamily: "Bricolage Grotesque, sans-serif",
            }}
          >
            ₹0
          </div>
          <div className="text-xs mb-6" style={{ color: "#9AA6BF" }}>
            forever free
          </div>
          <div className="space-y-2 mb-6">
            {[
              "Financial Health Score",
              "Basic Calculators",
              "Smart Alerts",
              "4 AI insights/day",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm"
                style={{ color: "#C8D0E0" }}
              >
                <Check size={14} style={{ color: "#31E981", flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            data-ocid="pricing.free_button"
            className="w-full py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#F2F5FF",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Continue Free
          </button>
        </div>

        {/* Pro Card */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(176,92,255,0.15), rgba(122,60,255,0.1))",
            border: "1px solid rgba(176,92,255,0.4)",
            boxShadow: "0 0 40px rgba(176,92,255,0.15)",
          }}
          data-ocid="pricing.pro.card"
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{
                background: "linear-gradient(90deg,#FBCE24,#F59E0B)",
                color: "#000",
              }}
            >
              ✦ PRO
            </span>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSelectedPlan("monthly")}
              data-ocid="pricing.monthly_toggle"
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background:
                  selectedPlan === "monthly"
                    ? "rgba(176,92,255,0.3)"
                    : "rgba(255,255,255,0.04)",
                border:
                  selectedPlan === "monthly"
                    ? "1px solid rgba(176,92,255,0.5)"
                    : "1px solid transparent",
                color: selectedPlan === "monthly" ? "#B05CFF" : "#9AA6BF",
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan("annual")}
              data-ocid="pricing.annual_toggle"
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background:
                  selectedPlan === "annual"
                    ? "rgba(176,92,255,0.3)"
                    : "rgba(255,255,255,0.04)",
                border:
                  selectedPlan === "annual"
                    ? "1px solid rgba(176,92,255,0.5)"
                    : "1px solid transparent",
                color: selectedPlan === "annual" ? "#B05CFF" : "#9AA6BF",
              }}
            >
              Annual <span style={{ color: "#31E981" }}>(-42%)</span>
            </button>
          </div>

          <div
            className="text-4xl font-extrabold mb-1"
            style={{
              color: "#B05CFF",
              fontFamily: "Bricolage Grotesque, sans-serif",
            }}
          >
            {selectedPlan === "monthly" ? "₹199" : "₹999"}
          </div>
          <div className="text-xs mb-6" style={{ color: "#9AA6BF" }}>
            {selectedPlan === "monthly"
              ? "per month"
              : "per year — saves ₹1,389"}
          </div>

          <div className="space-y-2 mb-6">
            {[
              "Everything in Free",
              "Insurance IRR Analysis",
              "Tax Optimization",
              "Full AI Advisor",
              "Downloadable Reports",
              "Advanced Analytics",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm"
                style={{ color: "#C8D0E0" }}
              >
                <Check size={14} style={{ color: "#B05CFF", flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            data-ocid="pricing.upgrade_button"
            className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #B05CFF, #7A3CFF)",
              color: "white",
              boxShadow: "0 0 20px rgba(176,92,255,0.35)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Crown size={14} />
            {loading
              ? "Processing..."
              : `Upgrade to Pro — ${selectedPlan === "monthly" ? "₹199/month" : "₹999/year"}`}
          </button>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-lg font-bold text-white mb-4"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Full Feature Comparison
        </h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          data-ocid="pricing.table"
        >
          <div
            className="grid grid-cols-3 px-5 py-3 text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.04)", color: "#9AA6BF" }}
          >
            <div>Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center" style={{ color: "#FBCE24" }}>
              Pro ✦
            </div>
          </div>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="grid grid-cols-3 px-5 py-3.5 text-sm items-center"
              style={{
                borderTop:
                  i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                background:
                  i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
              }}
            >
              <div style={{ color: "#F2F5FF" }}>{f.label}</div>
              <div className="text-center">
                {f.free === true ? (
                  <Check
                    size={15}
                    style={{ color: "#31E981", margin: "0 auto" }}
                  />
                ) : f.free === false ? (
                  <X size={15} style={{ color: "#F87171", margin: "0 auto" }} />
                ) : (
                  <span className="text-xs" style={{ color: "#FBCE24" }}>
                    {f.free}
                  </span>
                )}
              </div>
              <div className="text-center">
                {f.pro === true ? (
                  <Check
                    size={15}
                    style={{ color: "#B05CFF", margin: "0 auto" }}
                  />
                ) : (
                  <span className="text-xs" style={{ color: "#FBCE24" }}>
                    {f.pro}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        className="text-xs text-center max-w-md mx-auto"
        style={{ color: "#4A5568" }}
      >
        For informational purposes only. All plans are billed in INR. Estimates
        based on assumptions. Not personalized financial advice.
      </p>
    </div>
  );
}
