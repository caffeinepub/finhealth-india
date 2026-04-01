import { Lock } from "lucide-react";
import usePlan from "../hooks/usePlan";

interface ProGateProps {
  children: React.ReactNode;
  feature: string;
  onUpgrade: () => void;
}

export default function ProGate({
  children,
  feature,
  onUpgrade,
}: ProGateProps) {
  const { isPro } = usePlan();

  if (isPro) return <>{children}</>;

  return (
    <div className="relative" data-ocid="pro_gate.panel">
      {/* Blurred content */}
      <div
        className="select-none pointer-events-none"
        style={{ filter: "blur(5px)", opacity: 0.4 }}
      >
        {children}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl"
        style={{
          background: "rgba(10, 8, 22, 0.75)",
          border: "1px solid rgba(176, 92, 255, 0.4)",
          backdropFilter: "blur(2px)",
          zIndex: 10,
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
          style={{
            background:
              "linear-gradient(135deg, rgba(176,92,255,0.3), rgba(122,60,255,0.2))",
            border: "1px solid rgba(176,92,255,0.5)",
          }}
        >
          <Lock size={20} style={{ color: "#B05CFF" }} />
        </div>
        <div className="text-center px-4">
          <div
            className="text-sm font-bold mb-1"
            style={{
              background: "linear-gradient(90deg, #B05CFF, #7A3CFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {feature}
          </div>
          <div className="text-xs" style={{ color: "#9AA6BF" }}>
            Upgrade to Pro to unlock this feature
          </div>
        </div>
        <button
          type="button"
          onClick={onUpgrade}
          data-ocid="pro_gate.open_modal_button"
          className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: "linear-gradient(135deg, #B05CFF, #7A3CFF)",
            color: "white",
            boxShadow: "0 0 20px rgba(176,92,255,0.4)",
          }}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
