import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { DollarSign, Loader2, PiggyBank, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SmartTooltip, { FINANCE_TERMS } from "./SmartTooltip";

function formatINR(val: number) {
  if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(2)} Cr`;
  if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(2)} L`;
  if (val >= 1_000) return `₹${(val / 1_000).toFixed(1)} K`;
  return `₹${val.toFixed(0)}`;
}

const CARD_STYLE = {
  background: "#0F141B",
  border: "1px solid #24303A",
  borderRadius: 14,
};

const INPUT_STYLE = {
  background: "#0A0F15",
  border: "1px solid #24303A",
  color: "#E8F0FE",
  borderRadius: 8,
};

export default function SipCalculatorTab() {
  const [monthly, setMonthly] = useState("5000");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [years, setYears] = useState("10");
  const [calculated, setCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const P = Number.parseFloat(monthly) || 0;
  const annualRate = Number.parseFloat(annualReturn) || 0;
  const Y = Math.min(Math.max(Number.parseFloat(years) || 1, 1), 40);

  const results = useMemo(() => {
    const r = annualRate / 12 / 100;
    const n = Y * 12;
    const maturity = r === 0 ? P * n : P * ((((1 + r) ** n - 1) / r) * (1 + r));
    const invested = P * n;
    const returns = maturity - invested;
    return { maturity, invested, returns };
  }, [P, annualRate, Y]);

  const chartData = useMemo(() => {
    const r = annualRate / 12 / 100;
    const points: { year: string; invested: number; value: number }[] = [];
    for (let y = 1; y <= Y; y++) {
      const n = y * 12;
      const value = r === 0 ? P * n : P * ((((1 + r) ** n - 1) / r) * (1 + r));
      points.push({ year: `Y${y}`, invested: P * n, value: Math.round(value) });
    }
    return points;
  }, [P, annualRate, Y]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setCalculated(false);
    setTimeout(() => {
      setIsCalculating(false);
      setCalculated(true);
    }, 350);
  };

  return (
    <TabsContent value="sip-calculator">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
        data-ocid="sip_calculator.section"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div
            style={{
              background:
                "linear-gradient(135deg, #B8FF4A22 0%, #B8FF4A11 100%)",
              border: "1px solid #B8FF4A44",
              borderRadius: 10,
              padding: "8px 12px",
            }}
          >
            <TrendingUp size={20} style={{ color: "#B8FF4A" }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#E8F0FE" }}>
              SIP Calculator
            </h2>
            <p className="text-xs" style={{ color: "#9AA6B2" }}>
              Estimate your Systematic Investment Plan returns
            </p>
          </div>
        </div>

        {/* Inputs */}
        <Card style={CARD_STYLE}>
          <CardHeader>
            <CardTitle
              className="text-sm font-semibold"
              style={{ color: "#9AA6B2" }}
            >
              Investment Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label
                  style={{ color: "#9AA6B2", fontSize: 12 }}
                  className="flex items-center gap-1"
                >
                  Monthly SIP Amount (₹)
                  <SmartTooltip term="SIP" explanation={FINANCE_TERMS.SIP} />
                </Label>
                <Input
                  type="number"
                  min="100"
                  value={monthly}
                  onChange={(e) => {
                    setMonthly(e.target.value);
                    setCalculated(false);
                  }}
                  style={INPUT_STYLE}
                  data-ocid="sip_calculator.input"
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="space-y-2">
                <Label
                  style={{ color: "#9AA6B2", fontSize: 12 }}
                  className="flex items-center gap-1"
                >
                  Expected Annual Return (%)
                  <SmartTooltip
                    term="Expected Returns"
                    explanation={FINANCE_TERMS["Expected Returns"]}
                  />
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={annualReturn}
                  onChange={(e) => {
                    setAnnualReturn(e.target.value);
                    setCalculated(false);
                  }}
                  style={INPUT_STYLE}
                  data-ocid="sip_calculator.input"
                  placeholder="e.g. 12"
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: "#9AA6B2", fontSize: 12 }}>
                  Investment Duration (Years)
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="40"
                  value={years}
                  onChange={(e) => {
                    setYears(e.target.value);
                    setCalculated(false);
                  }}
                  style={INPUT_STYLE}
                  data-ocid="sip_calculator.input"
                  placeholder="1–40"
                />
              </div>
            </div>
            <div className="mt-5">
              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                data-ocid="sip_calculator.primary_button"
                style={{
                  background: "#B8FF4A",
                  color: "#060A10",
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: "8px 24px",
                  border: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {isCalculating ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  "Calculate Returns"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading state */}
        {isCalculating && (
          <div
            className="flex items-center justify-center gap-3 py-8"
            data-ocid="sip_calculator.loading_state"
          >
            <Loader2
              size={22}
              className="animate-spin"
              style={{ color: "#B8FF4A" }}
            />
            <span style={{ color: "#9AA6B2", fontSize: 13 }}>
              Calculating your SIP returns...
            </span>
          </div>
        )}

        {/* Results */}
        {calculated && !isCalculating && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Result cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Invested",
                  value: formatINR(results.invested),
                  icon: <PiggyBank size={18} style={{ color: "#60A5FA" }} />,
                  accent: "#60A5FA",
                  bg: "#60A5FA22",
                },
                {
                  label: "Estimated Returns",
                  value: formatINR(results.returns),
                  icon: <TrendingUp size={18} style={{ color: "#B8FF4A" }} />,
                  accent: "#B8FF4A",
                  bg: "#B8FF4A22",
                },
                {
                  label: "Maturity Value",
                  value: formatINR(results.maturity),
                  icon: <DollarSign size={18} style={{ color: "#F59E0B" }} />,
                  accent: "#F59E0B",
                  bg: "#F59E0B22",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  data-ocid="sip_calculator.card"
                  style={{
                    ...CARD_STYLE,
                    padding: "20px 18px",
                    boxShadow: `0 0 18px ${item.accent}18`,
                    cursor: "default",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      style={{
                        background: item.bg,
                        borderRadius: 8,
                        padding: 6,
                      }}
                    >
                      {item.icon}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#9AA6B2" }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: item.accent }}
                  >
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <Card style={CARD_STYLE}>
              <CardHeader>
                <CardTitle
                  className="text-sm font-semibold"
                  style={{ color: "#9AA6B2" }}
                >
                  Portfolio Growth Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="sipValueGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#B8FF4A"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#B8FF4A"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                      <linearGradient
                        id="sipInvestedGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#60A5FA"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#60A5FA"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                      dataKey="year"
                      stroke="#4A5568"
                      tick={{ fill: "#9AA6B2", fontSize: 11 }}
                      interval={Math.max(0, Math.floor(Y / 10) - 1)}
                    />
                    <YAxis
                      stroke="#4A5568"
                      tick={{ fill: "#9AA6B2", fontSize: 11 }}
                      tickFormatter={(v) => formatINR(v)}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0F141B",
                        border: "1px solid #24303A",
                        borderRadius: 10,
                        color: "#E8F0FE",
                      }}
                      formatter={(value: number, name: string) => [
                        formatINR(value),
                        name === "value" ? "Portfolio Value" : "Total Invested",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      stroke="#60A5FA"
                      strokeWidth={2}
                      fill="url(#sipInvestedGrad)"
                      strokeDasharray="4 2"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#B8FF4A"
                      strokeWidth={2.5}
                      fill="url(#sipValueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-5 justify-center mt-3">
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "#9AA6B2" }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 2,
                        background: "#B8FF4A",
                        borderRadius: 1,
                      }}
                    />
                    Portfolio Value
                  </div>
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "#9AA6B2" }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 2,
                        background: "#60A5FA",
                        borderRadius: 1,
                        borderTop: "2px dashed #60A5FA",
                      }}
                    />
                    Total Invested
                  </div>
                </div>
              </CardContent>
            </Card>

            <p
              className="text-xs"
              style={{ color: "#4A5568", textAlign: "center" }}
            >
              * Calculations are indicative and based on assumed constant
              returns. Actual returns may vary. Past performance is not
              indicative of future results.
            </p>
          </motion.div>
        )}
      </motion.div>
    </TabsContent>
  );
}
