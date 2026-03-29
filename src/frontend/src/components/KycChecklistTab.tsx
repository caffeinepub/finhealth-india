import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const KYC_ITEMS = [
  {
    id: "pan",
    label: "PAN Card",
    desc: "Permanent Account Number issued by Income Tax Dept",
  },
  {
    id: "aadhaar",
    label: "Aadhaar Card",
    desc: "12-digit unique identification number",
  },
  {
    id: "bank",
    label: "Bank Account Proof",
    desc: "Cancelled cheque or bank passbook copy",
  },
  {
    id: "address",
    label: "Address Proof",
    desc: "Utility bill or rent agreement (latest 3 months)",
  },
  {
    id: "photo",
    label: "Passport-size Photograph",
    desc: "Recent photograph with white background",
  },
  {
    id: "nominee",
    label: "Nominee Details",
    desc: "Name, relation, and date of birth of nominee",
  },
  {
    id: "mobile",
    label: "Mobile Number Linked to Aadhaar",
    desc: "Registered mobile for OTP-based verification",
  },
  {
    id: "email",
    label: "Email ID Registered with Broker",
    desc: "Active email for trade confirmations and alerts",
  },
];

const CARD_STYLE = {
  background: "#0F141B",
  border: "1px solid #24303A",
  borderRadius: 14,
};

export default function KycChecklistTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("kyc_checklist");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("kyc_checklist", JSON.stringify(checked));
  }, [checked]);

  const total = KYC_ITEMS.length;
  const done = Object.values(checked).filter(Boolean).length;
  const score = Math.round((done / total) * 100);

  const statusLabel =
    score === 100
      ? "KYC Ready"
      : score >= 75
        ? "Almost Ready"
        : score >= 50
          ? "Partially Ready"
          : "Incomplete";
  const statusColor =
    score === 100
      ? "#B8FF4A"
      : score >= 75
        ? "#F59E0B"
        : score >= 50
          ? "#60A5FA"
          : "#F87171";

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <TabsContent value="kyc-checklist">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
        data-ocid="kyc_checklist.section"
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
            <ShieldCheck size={20} style={{ color: "#B8FF4A" }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#E8F0FE" }}>
              KYC Readiness Checklist
            </h2>
            <p className="text-xs" style={{ color: "#9AA6B2" }}>
              SEBI-compliant document checklist for investing
            </p>
          </div>
        </div>

        {/* Score Card */}
        <Card
          style={{
            ...CARD_STYLE,
            boxShadow: `0 0 24px ${statusColor}20`,
            border: `1px solid ${statusColor}40`,
          }}
        >
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: "#9AA6B2" }}
                >
                  KYC Readiness Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: statusColor }}
                  >
                    {score}%
                  </span>
                  <Badge
                    style={{
                      background: `${statusColor}22`,
                      color: statusColor,
                      border: `1px solid ${statusColor}44`,
                      fontSize: 11,
                    }}
                  >
                    {score === 100 ? (
                      <>
                        <CheckCircle2 size={11} className="inline mr-1" />
                        {statusLabel}
                      </>
                    ) : (
                      <>
                        <AlertCircle size={11} className="inline mr-1" />
                        {statusLabel}
                      </>
                    )}
                  </Badge>
                </div>
                <div className="text-xs mt-1" style={{ color: "#4A5568" }}>
                  {done} of {total} documents prepared
                </div>
              </div>
              <div className="flex-1 max-w-sm">
                <Progress
                  value={score}
                  data-ocid="kyc_checklist.toggle"
                  style={{ height: 10, borderRadius: 8, background: "#1E293B" }}
                  className="[&>div]:transition-all [&>div]:duration-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card style={CARD_STYLE}>
          <CardHeader>
            <CardTitle
              className="text-sm font-semibold"
              style={{ color: "#9AA6B2" }}
            >
              Document Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {KYC_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggle(item.id)}
                data-ocid={`kyc_checklist.checkbox.${i + 1}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: checked[item.id] ? "#B8FF4A08" : "#0A0F15",
                  border: checked[item.id]
                    ? "1px solid #B8FF4A33"
                    : "1px solid #1E293B",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Checkbox
                  id={item.id}
                  checked={!!checked[item.id]}
                  onCheckedChange={() => toggle(item.id)}
                  style={{ marginTop: 2 }}
                  className="border-[#24303A] data-[state=checked]:bg-[#B8FF4A] data-[state=checked]:border-[#B8FF4A] data-[state=checked]:text-[#060A10]"
                />
                <div>
                  <Label
                    htmlFor={item.id}
                    className="cursor-pointer font-semibold text-sm"
                    style={{ color: checked[item.id] ? "#B8FF4A" : "#E8F0FE" }}
                  >
                    {item.label}
                  </Label>
                  <p className="text-xs mt-0.5" style={{ color: "#4A5568" }}>
                    {item.desc}
                  </p>
                </div>
                {checked[item.id] && (
                  <CheckCircle2
                    size={16}
                    style={{
                      color: "#B8FF4A",
                      marginLeft: "auto",
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* SEBI Note */}
        <div
          style={{
            background: "#1E293B",
            border: "1px solid #2D3748",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <ShieldCheck
            size={18}
            style={{ color: "#B8FF4A", flexShrink: 0, marginTop: 2 }}
          />
          <p className="text-xs leading-relaxed" style={{ color: "#9AA6B2" }}>
            <span style={{ color: "#B8FF4A", fontWeight: 600 }}>
              SEBI Regulation:{" "}
            </span>
            KYC is mandatory as per SEBI regulations. Ensure all documents are
            valid and up to date. Incomplete KYC may result in restrictions on
            trading and investment activities. Contact your broker or
            SEBI-registered intermediary for assistance.
          </p>
        </div>
      </motion.div>
    </TabsContent>
  );
}
