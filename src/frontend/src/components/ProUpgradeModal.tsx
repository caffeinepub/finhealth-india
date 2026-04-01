import { Check, Crown, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import usePlan from "../hooks/usePlan";

interface ProUpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const FEATURES = [
  { label: "Financial Health Score", free: true, pro: true },
  { label: "Basic Tools (SIP, EMI)", free: true, pro: true },
  { label: "Advanced Insurance IRR", free: false, pro: true },
  { label: "Tax Optimization Details", free: false, pro: true },
  { label: "AI Advisor", free: "Limited", pro: "Full" },
  { label: "Downloadable Reports", free: false, pro: true },
  { label: "Advanced Analytics", free: false, pro: true },
];

export default function ProUpgradeModal({
  open,
  onClose,
}: ProUpgradeModalProps) {
  const { upgradeToPro } = usePlan();
  const { actor } = useActor();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [loading, setLoading] = useState(false);

  if (!open) return null;

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
      // Fallback: set pro in localStorage for demo
      upgradeToPro();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      data-ocid="pro_upgrade.modal"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0C1020",
          border: "1px solid rgba(176,92,255,0.35)",
          boxShadow:
            "0 0 60px rgba(176,92,255,0.2), 0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="p-6 pb-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(176,92,255,0.15), rgba(122,60,255,0.1))",
            borderBottom: "1px solid rgba(176,92,255,0.2)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.08)", color: "#9AA6BF" }}
            data-ocid="pro_upgrade.close_button"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #FBCE24, #F59E0B)",
              }}
            >
              <Crown size={20} className="text-black" />
            </div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{
                  background: "linear-gradient(90deg, #FBCE24, #B05CFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "Bricolage Grotesque, sans-serif",
                }}
              >
                Upgrade to FinHealth Pro
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#9AA6BF" }}>
                Unlock advanced analytics, reports & full AI advisor
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Toggle */}
          <div className="grid grid-cols-2 gap-3">
            {/* Monthly */}
            <button
              type="button"
              onClick={() => setSelectedPlan("monthly")}
              data-ocid="pro_upgrade.monthly_button"
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background:
                  selectedPlan === "monthly"
                    ? "rgba(176,92,255,0.15)"
                    : "rgba(255,255,255,0.03)",
                border:
                  selectedPlan === "monthly"
                    ? "1px solid rgba(176,92,255,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    background: "linear-gradient(90deg,#FBCE24,#F59E0B)",
                    color: "#000",
                  }}
                >
                  Most Popular
                </span>
              </div>
              <div
                className="text-2xl font-extrabold"
                style={{
                  color: selectedPlan === "monthly" ? "#B05CFF" : "#F2F5FF",
                  fontFamily: "Bricolage Grotesque, sans-serif",
                }}
              >
                ₹199
              </div>
              <div className="text-xs" style={{ color: "#9AA6BF" }}>
                per month
              </div>
            </button>

            {/* Annual */}
            <button
              type="button"
              onClick={() => setSelectedPlan("annual")}
              data-ocid="pro_upgrade.annual_button"
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background:
                  selectedPlan === "annual"
                    ? "rgba(176,92,255,0.15)"
                    : "rgba(255,255,255,0.03)",
                border:
                  selectedPlan === "annual"
                    ? "1px solid rgba(176,92,255,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    background: "rgba(49,233,129,0.2)",
                    color: "#31E981",
                    border: "1px solid rgba(49,233,129,0.3)",
                  }}
                >
                  Save ₹1,389
                </span>
              </div>
              <div
                className="text-2xl font-extrabold"
                style={{
                  color: selectedPlan === "annual" ? "#B05CFF" : "#F2F5FF",
                  fontFamily: "Bricolage Grotesque, sans-serif",
                }}
              >
                ₹999
              </div>
              <div className="text-xs" style={{ color: "#9AA6BF" }}>
                per year
              </div>
            </button>
          </div>

          {/* Feature Table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            data-ocid="pro_upgrade.table"
          >
            <div
              className="grid grid-cols-3 px-4 py-2 text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9AA6BF" }}
            >
              <div>Feature</div>
              <div className="text-center">Free</div>
              <div className="text-center" style={{ color: "#FBCE24" }}>
                Pro
              </div>
            </div>
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="grid grid-cols-3 px-4 py-3 text-xs items-center"
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
                      size={14}
                      style={{ color: "#31E981", margin: "0 auto" }}
                    />
                  ) : f.free === false ? (
                    <X
                      size={14}
                      style={{ color: "#F87171", margin: "0 auto" }}
                    />
                  ) : (
                    <span style={{ color: "#FBCE24" }}>{f.free}</span>
                  )}
                </div>
                <div className="text-center">
                  {f.pro === true ? (
                    <Check
                      size={14}
                      style={{ color: "#31E981", margin: "0 auto" }}
                    />
                  ) : (
                    <span style={{ color: "#FBCE24" }}>{f.pro}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            data-ocid="pro_upgrade.submit_button"
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #B05CFF, #7A3CFF)",
              color: "white",
              boxShadow: "0 0 24px rgba(176,92,255,0.4)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Crown size={16} /> Upgrade to Pro —{" "}
                {selectedPlan === "monthly" ? "₹199/month" : "₹999/year"}
              </>
            )}
          </button>

          <p className="text-xs text-center" style={{ color: "#4A5568" }}>
            For informational purposes only. All plans are billed in INR. Cancel
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
