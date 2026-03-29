import { Calculator, Calendar, Leaf } from "lucide-react";
import { useState } from "react";

type Category = "Equity" | "Debt" | "Cash" | "Gold" | "Mutual Funds";
type EntryType = "Asset" | "Liability";
interface Entry {
  id: string;
  type: EntryType;
  category: Category;
  amount: number;
}

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000)
    return `${sign}\u20b9${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}\u20b9${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}\u20b9${(abs / 1_000).toFixed(1)}K`;
  return `${sign}\u20b9${abs.toLocaleString("en-IN")}`;
}

const LTCG_EXEMPTION = 1_00_000;
const LTCG_RATE = 0.1;
const STCG_RATE = 0.15;

export default function TaxOptimizerTab({ entries }: { entries: Entry[] }) {
  const equityAssets = entries.filter(
    (e) => e.type === "Asset" && e.category === "Equity",
  );
  const equityTotal = equityAssets.reduce((s, e) => s + e.amount, 0);

  const [equityValue, setEquityValue] = useState(
    equityTotal > 0 ? equityTotal.toString() : "",
  );
  const [costBasis, setCostBasis] = useState("");
  const [holdingMonths, setHoldingMonths] = useState(14);

  const val = Number.parseFloat(equityValue) || 0;
  const basis = Number.parseFloat(costBasis) || 0;
  const gain = Math.max(0, val - basis);
  const isLTCG = holdingMonths >= 12;
  const taxableGain = Math.max(0, gain - LTCG_EXEMPTION);
  const exemptionUsed = Math.min(gain, LTCG_EXEMPTION);
  const exemptionRemaining = Math.max(0, LTCG_EXEMPTION - gain);
  const ltcgTax = taxableGain * LTCG_RATE;
  const stcgTax = gain * STCG_RATE;

  const harvestAmount = LTCG_EXEMPTION;
  const harvestSaving = LTCG_EXEMPTION * LTCG_RATE;

  const now = new Date();
  const fyStart = new Date(
    now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1,
    3,
    1,
  );
  const fyEnd = new Date(fyStart.getFullYear() + 1, 2, 31);
  const fyPct = Math.round(
    ((now.getTime() - fyStart.getTime()) /
      (fyEnd.getTime() - fyStart.getTime())) *
      100,
  );
  const currentMonth = now.getMonth();
  const isTaxSeason = currentMonth >= 0 && currentMonth <= 2;

  return (
    <div className="space-y-6">
      <div className="fintech-card p-6">
        <h2
          className="text-base font-bold mb-1 flex items-center gap-2"
          style={{ color: "#EAF0F6" }}
        >
          <Calculator size={18} style={{ color: "#B8FF4A" }} />
          Tax Optimizer
        </h2>
        <p className="text-xs mb-5" style={{ color: "#9AA6B2" }}>
          India LTCG/STCG optimizer with tax harvesting recommendations for FY
          2025\u201326.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label
              htmlFor="equity-value"
              className="text-xs mb-1 block"
              style={{ color: "#9AA6B2" }}
            >
              Equity Portfolio Value (\u20b9)
            </label>
            <input
              id="equity-value"
              type="number"
              value={equityValue}
              onChange={(e) => setEquityValue(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{
                background: "#0F141B",
                border: "1px solid #24303A",
                color: "#EAF0F6",
                outline: "none",
              }}
              data-ocid="tax.equity_value.input"
            />
          </div>
          <div>
            <label
              htmlFor="cost-basis"
              className="text-xs mb-1 block"
              style={{ color: "#9AA6B2" }}
            >
              Cost Basis / Purchase Price (\u20b9)
            </label>
            <input
              id="cost-basis"
              type="number"
              value={costBasis}
              onChange={(e) => setCostBasis(e.target.value)}
              placeholder="e.g. 350000"
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{
                background: "#0F141B",
                border: "1px solid #24303A",
                color: "#EAF0F6",
                outline: "none",
              }}
              data-ocid="tax.cost_basis.input"
            />
          </div>
          <div>
            <div
              className="text-xs mb-1 flex justify-between"
              style={{ color: "#9AA6B2" }}
            >
              <span>Holding Period (months)</span>
              <span style={{ color: "#B8FF4A" }}>{holdingMonths}m</span>
            </div>
            <input
              id="holding-period"
              type="range"
              min={1}
              max={60}
              value={holdingMonths}
              onChange={(e) => setHoldingMonths(Number(e.target.value))}
              className="w-full accent-[#B8FF4A] mt-2"
              data-ocid="tax.holding_period.input"
              aria-label="Holding period in months"
            />
            <div
              className="flex justify-between text-xs mt-1"
              style={{ color: "#9AA6B2" }}
            >
              <span>1m</span>
              <span>5yr</span>
            </div>
          </div>
        </div>

        {val > 0 && basis > 0 && (
          <div className="space-y-4 mb-5">
            {!isLTCG && (
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,74,74,0.08)",
                  border: "1px solid #FF4A4A33",
                }}
              >
                <div
                  className="text-sm font-semibold mb-2"
                  style={{ color: "#FF4A4A" }}
                >
                  \u26a0\ufe0f Short-Term Capital Gains (STCG)
                </div>
                <div className="text-xs mb-2" style={{ color: "#9AA6B2" }}>
                  Holding {holdingMonths} months \u2014 need{" "}
                  {12 - holdingMonths} more months for LTCG treatment
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div style={{ color: "#9AA6B2" }}>STCG Tax (15%)</div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{ color: "#FF4A4A" }}
                    >
                      {formatINR(stcgTax)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9AA6B2" }}>
                      If you wait \u2192 LTCG Tax (10%)
                    </div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{ color: "#B8FF4A" }}
                    >
                      {formatINR(ltcgTax)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs" style={{ color: "#FFD74A" }}>
                  \ud83d\udca1 Waiting {12 - holdingMonths} more months saves
                  you {formatINR(stcgTax - ltcgTax)} in taxes.
                </div>
              </div>
            )}

            {isLTCG && (
              <div
                className="p-4 rounded-xl"
                style={{
                  background:
                    gain <= LTCG_EXEMPTION
                      ? "rgba(184,255,74,0.08)"
                      : "rgba(255,157,74,0.08)",
                  border: `1px solid ${gain <= LTCG_EXEMPTION ? "#B8FF4A44" : "#FF9A4A44"}`,
                }}
              >
                <div
                  className="text-sm font-semibold mb-3"
                  style={{ color: "#B8FF4A" }}
                >
                  Long-Term Capital Gains (LTCG) \u2014 10%
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div style={{ color: "#9AA6B2" }}>Total Gain</div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{ color: "#EAF0F6" }}
                    >
                      {formatINR(gain)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9AA6B2" }}>Exemption Used</div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{ color: "#B8FF4A" }}
                    >
                      {formatINR(exemptionUsed)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9AA6B2" }}>Exemption Left</div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{ color: "#4AB8FF" }}
                    >
                      {formatINR(exemptionRemaining)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9AA6B2" }}>Tax Payable</div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{ color: ltcgTax > 0 ? "#FF4A4A" : "#B8FF4A" }}
                    >
                      {formatINR(ltcgTax)}
                    </div>
                  </div>
                </div>
                {gain <= LTCG_EXEMPTION ? (
                  <div className="mt-3 text-xs" style={{ color: "#B8FF4A" }}>
                    \u2705 You are within the \u20b91L LTCG exemption. No tax on
                    gains this FY.
                  </div>
                ) : (
                  <div className="mt-3 text-xs" style={{ color: "#FFD74A" }}>
                    \ud83d\udca1 Tax Harvest: Book {formatINR(harvestAmount)} in
                    gains this FY. Potential annual saving:{" "}
                    {formatINR(harvestSaving)}.
                  </div>
                )}
              </div>
            )}

            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(74,184,255,0.06)",
                border: "1px solid #4AB8FF33",
              }}
            >
              <div className="flex items-start gap-2">
                <Leaf size={16} style={{ color: "#4AB8FF", marginTop: 2 }} />
                <div>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#4AB8FF" }}
                  >
                    Section 80C \u2014 ELSS Tax Saving
                  </div>
                  <p className="text-xs" style={{ color: "#9AA6B2" }}>
                    Invest up to{" "}
                    <strong style={{ color: "#EAF0F6" }}>
                      \u20b91.5L in ELSS mutual funds
                    </strong>{" "}
                    to save up to{" "}
                    <strong style={{ color: "#B8FF4A" }}>
                      \u20b946,800 in income tax
                    </strong>{" "}
                    (at 30% slab) under Section 80C.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="p-4 rounded-xl"
          style={{ background: "#0F141B", border: "1px solid #24303A" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} style={{ color: "#B8FF4A" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "#EAF0F6" }}
            >
              FY 2025\u201326 Progress
            </span>
          </div>
          <div
            className="h-3 rounded-full mb-2"
            style={{ background: "#1F2A38" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${fyPct}%`,
                background: "linear-gradient(90deg, #B8FF4A, #4AB8FF)",
              }}
            />
          </div>
          <div className="text-xs mb-3" style={{ color: "#9AA6B2" }}>
            {fyPct}% of FY complete \u2022 Resets April 1, 2026
          </div>
          <div className="grid grid-cols-12 gap-0.5">
            {[
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
              "Jan",
              "Feb",
              "Mar",
            ].map((m, i) => {
              const isCurrentMonth =
                (fyStart.getMonth() + i) % 12 === currentMonth;
              const isSaving = i >= 9;
              return (
                <div
                  key={m}
                  className="text-center py-1.5 rounded"
                  style={{
                    background: isCurrentMonth
                      ? "#B8FF4A"
                      : isSaving
                        ? "rgba(184,255,74,0.12)"
                        : "transparent",
                    color: isCurrentMonth
                      ? "#060A10"
                      : isSaving
                        ? "#B8FF4A"
                        : "#9AA6B2",
                    fontSize: 9,
                    fontWeight: isCurrentMonth || isSaving ? 700 : 400,
                  }}
                >
                  {m}
                </div>
              );
            })}
          </div>
          {isTaxSeason && (
            <div className="mt-2 text-xs" style={{ color: "#B8FF4A" }}>
              \ud83c\udf1f Tax Saving Season \u2014 Last chance to book LTCG
              exemptions for this FY!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
