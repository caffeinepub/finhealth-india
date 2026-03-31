import { useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  goals: string[];
  kyc_status: "Pending" | "Verified";
  pan?: string;
  aadhaar?: string;
  plan: "free" | "pro";
  riskProfile: string;
  createdAt: string;
}

export function useAuth() {
  const [, forceUpdate] = useState(0);

  const userId = localStorage.getItem("finhealth_current_user_id") || "";
  const isLoggedIn = localStorage.getItem("finhealth_logged_in") === "true";
  const userStr = userId
    ? localStorage.getItem(`finhealth_user_${userId}`)
    : null;
  const user: UserProfile | null = userStr ? JSON.parse(userStr) : null;

  const login = (userData: Omit<UserProfile, "id">) => {
    const id = `user_${Date.now()}`;
    const fullUser = { ...userData, id };
    localStorage.setItem("finhealth_logged_in", "true");
    localStorage.setItem("finhealth_current_user_id", id);
    localStorage.setItem(`finhealth_user_${id}`, JSON.stringify(fullUser));
    forceUpdate((n) => n + 1);
    return fullUser;
  };

  const logout = () => {
    localStorage.removeItem("finhealth_logged_in");
    forceUpdate((n) => n + 1);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (userId && user) {
      const updated = { ...user, ...updates };
      localStorage.setItem(`finhealth_user_${userId}`, JSON.stringify(updated));
      forceUpdate((n) => n + 1);
      return updated;
    }
    return user;
  };

  return { isLoggedIn, user, userId, login, logout, updateUser };
}
