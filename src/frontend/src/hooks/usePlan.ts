import { useState } from "react";

export type PlanType = "free" | "pro";

export default function usePlan() {
  const [plan, setPlan] = useState<PlanType>(() => {
    return (localStorage.getItem("finhealth_plan") as PlanType) || "free";
  });

  const isPro = plan === "pro";

  const upgradeToPro = () => {
    localStorage.setItem("finhealth_plan", "pro");
    setPlan("pro");
  };

  const downgradeToPro = () => {
    localStorage.setItem("finhealth_plan", "free");
    setPlan("free");
  };

  return { isPro, plan, upgradeToPro, downgradeToPro };
}
