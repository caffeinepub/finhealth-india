import { BarChart3, FileSearch, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Metric {
  icon: React.ElementType;
  label: string;
  base: number;
  intervalMs: number;
}

const METRICS: Metric[] = [
  { icon: Users, label: "Users Onboarded", base: 1200, intervalMs: 2000 },
  { icon: FileSearch, label: "Policies Analyzed", base: 850, intervalMs: 2700 },
  {
    icon: BarChart3,
    label: "Portfolios Managed",
    base: 3400,
    intervalMs: 2300,
  },
];

function formatNumber(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}K+`;
  }
  return `${n}+`;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    function step(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [active, target, duration]);

  return value;
}

interface MetricCardProps {
  metric: Metric;
  active: boolean;
  extra: number;
}

function MetricCard({ metric, active, extra }: MetricCardProps) {
  const Icon = metric.icon;
  const displayBase = useCountUp(metric.base, active);
  const displayValue = active ? metric.base + extra : displayBase;

  return (
    <div
      data-ocid="trust.counter.card"
      style={{
        background: "#0F141B",
        border: "1px solid #24303A",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(163,255,18,0.3)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(163,255,18,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#24303A";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.4)";
      }}
    >
      {/* Icon badge */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(163,255,18,0.08)",
          border: "1px solid rgba(163,255,18,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} style={{ color: "#A3FF12" }} />
      </div>

      {/* Number + live badge */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 800,
              color: "#A3FF12",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textShadow:
                "0 0 20px rgba(163,255,18,0.6), 0 0 40px rgba(163,255,18,0.3)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {active ? formatNumber(displayValue) : "0+"}
          </span>
          {active && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#A3FF12",
                background: "rgba(163,255,18,0.12)",
                border: "1px solid rgba(163,255,18,0.25)",
                borderRadius: 6,
                padding: "2px 6px",
                letterSpacing: "0.05em",
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              ↑ live
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#9AA6B2",
            fontWeight: 500,
            marginTop: 6,
            letterSpacing: "0.01em",
          }}
        >
          {metric.label}
        </div>
      </div>
    </div>
  );
}

export default function TrustCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [extras, setExtras] = useState([0, 0, 0]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  // IntersectionObserver for scroll trigger
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !visible) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  // After count-up completes (~1.6s), start staggered incremental updates
  useEffect(() => {
    if (!visible) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    METRICS.forEach((metric, idx) => {
      const t = setTimeout(
        () => {
          const iv = setInterval(() => {
            setExtras((prev) => {
              const next = [...prev];
              next[idx] = next[idx] + 1;
              return next;
            });
          }, metric.intervalMs);
          intervalsRef.current[idx] = iv;
        },
        1600 + idx * 200,
      );
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      data-ocid="trust.section"
      style={{
        background: "linear-gradient(135deg, #0A0F18 0%, #060A10 100%)",
        borderTop: "1px solid #24303A",
        borderBottom: "1px solid #24303A",
        padding: "56px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(163,255,18,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="max-w-6xl mx-auto px-4 sm:px-6"
        style={{ position: "relative" }}
      >
        {/* Section title */}
        <div className="text-center mb-10">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(163,255,18,0.07)",
              border: "1px solid rgba(163,255,18,0.2)",
              borderRadius: 100,
              padding: "4px 14px",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#A3FF12",
                boxShadow: "0 0 6px #A3FF12",
                display: "inline-block",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#A3FF12",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Live Stats
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 800,
              color: "#EAF0F6",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Powering Smart{" "}
            <span
              style={{
                color: "#A3FF12",
                textShadow:
                  "0 0 20px rgba(163,255,18,0.5), 0 0 40px rgba(163,255,18,0.25)",
              }}
            >
              Financial Decisions
            </span>
          </h2>
          <p
            style={{
              color: "#9AA6B2",
              fontSize: 14,
              marginTop: 8,
              maxWidth: 400,
              margin: "8px auto 0",
            }}
          >
            Real-time platform activity across all users
          </p>
        </div>

        {/* Metric cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
          className="grid-cols-1 sm:grid-cols-3"
        >
          {METRICS.map((metric, idx) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              active={visible}
              extra={extras[idx]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
