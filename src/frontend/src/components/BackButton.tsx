interface BackButtonProps {
  onBack?: () => void;
  defaultFallback?: () => void;
}

export default function BackButton({
  onBack,
  defaultFallback,
}: BackButtonProps) {
  function handleClick() {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      defaultFallback?.();
    }
  }

  return (
    <button
      type="button"
      data-ocid="nav.back.button"
      onClick={handleClick}
      className="flex items-center gap-1.5 transition-all"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid #24303A",
        color: "#9AA6B2",
        borderRadius: 10,
        padding: "6px 12px",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#B8FF4A";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(184,255,74,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#9AA6B2";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#24303A";
      }}
    >
      ← Back
    </button>
  );
}
