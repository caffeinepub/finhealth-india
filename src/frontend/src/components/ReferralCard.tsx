import { Copy, MessageCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function ReferralCard() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!actor || !identity || isFetching) return;
    setLoading(true);
    Promise.all([
      actor.getReferralCode(),
      actor.getReferralCount(identity.getPrincipal()),
    ])
      .then(([code, count]) => {
        setReferralCode(code);
        setReferralCount(Number(count));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, identity, isFetching]);

  const copyCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!");
    } catch {
      toast.error("Could not copy");
    }
  };

  const shareWhatsApp = () => {
    if (!referralCode) return;
    const url = `https://wa.me/?text=${encodeURIComponent(`Join FinPulse and use my referral code ${referralCode} to get started! ${window.location.href}`)}`;
    window.open(url, "_blank");
  };

  if (!identity) return null;

  return (
    <div
      className="fintech-card p-5"
      data-ocid="referral.card"
      style={{
        background: "linear-gradient(135deg, #0F141B 0%, #141E2A 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} style={{ color: "#B8FF4A" }} />
        <h3 className="text-sm font-bold" style={{ color: "#EAF0F6" }}>
          Refer & Earn
        </h3>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(184,255,74,0.12)",
            color: "#B8FF4A",
            border: "1px solid rgba(184,255,74,0.2)",
          }}
        >
          {referralCount} friend{referralCount !== 1 ? "s" : ""} referred
        </span>
      </div>

      {loading ? (
        <div
          className="text-xs text-center py-3"
          style={{ color: "#9AA6B2" }}
          data-ocid="referral.loading_state"
        >
          Loading your referral code...
        </div>
      ) : referralCode ? (
        <>
          <p className="text-xs mb-2" style={{ color: "#9AA6B2" }}>
            Your Referral Code:
          </p>
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-4"
            style={{
              background: "#060A10",
              border: "1px solid rgba(184,255,74,0.3)",
            }}
          >
            <span
              className="flex-1 text-lg font-bold tracking-widest"
              style={{ color: "#B8FF4A" }}
            >
              {referralCode}
            </span>
            <button
              type="button"
              onClick={copyCode}
              data-ocid="referral.copy.button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: "rgba(184,255,74,0.12)",
                color: "#B8FF4A",
                border: "1px solid rgba(184,255,74,0.25)",
              }}
            >
              <Copy size={12} /> Copy
            </button>
          </div>
          <p className="text-xs mb-2" style={{ color: "#9AA6B2" }}>
            Share with friends:
          </p>
          <button
            type="button"
            onClick={shareWhatsApp}
            data-ocid="referral.whatsapp.button"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "#25D366", color: "#ffffff" }}
          >
            <MessageCircle size={15} /> Share on WhatsApp
          </button>
        </>
      ) : (
        <p
          className="text-xs"
          style={{ color: "#9AA6B2" }}
          data-ocid="referral.error_state"
        >
          Could not load referral code. Please try again.
        </p>
      )}
    </div>
  );
}
