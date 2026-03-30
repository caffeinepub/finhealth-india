import {
  ArrowLeft,
  Camera,
  CheckCircle,
  CreditCard,
  Download,
  Edit2,
  Lock,
  LogOut,
  Shield,
  Trash2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UserData {
  name: string;
  email: string;
  mobile: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  panNumber?: string;
  dob?: string;
  income?: number;
  savings?: number;
  riskProfile?: string;
  goals?: string[];
  plan?: string;
  createdAt?: string;
  photoURL?: string;
}

interface MyAccountPageProps {
  onClose: () => void;
  onStartOnboarding?: () => void;
  userId: string;
}

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #141a22 0%, #0f141b 100%)",
  border: "1px solid #24303A",
  borderRadius: 18,
  padding: 24,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#9AA6B2",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  background: "#060A10",
  border: "1px solid #24303A",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#EAF0F6",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

export default function MyAccountPage({
  onClose,
  userId,
  onStartOnboarding,
}: MyAccountPageProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editingFinancial, setEditingFinancial] = useState(false);
  const [editIncome, setEditIncome] = useState("");
  const [editSavings, setEditSavings] = useState("");
  const [editRisk, setEditRisk] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storageKey = `finhealth_user_${userId}`;

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as UserData;
        setUserData(parsed);
        setEditIncome(String(parsed.income ?? ""));
        setEditSavings(String(parsed.savings ?? ""));
        setEditRisk(parsed.riskProfile ?? "");
      } catch {}
    }
  }, [storageKey]);

  function saveUserData(updated: UserData) {
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setUserData(updated);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      if (userData) saveUserData({ ...userData, photoURL: base64 });
    };
    reader.readAsDataURL(file);
  }

  function handleFinancialSave() {
    if (!userData) return;
    saveUserData({
      ...userData,
      income: Number(editIncome),
      savings: Number(editSavings),
      riskProfile: editRisk,
    });
    setEditingFinancial(false);
    toast.success("Financial profile updated!");
  }

  function handlePasswordChange() {
    if (!newPw || !currentPw) {
      toast.error("Please fill all fields.");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    toast.success("Password updated!");
    setChangingPassword(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  }

  function handleDownloadData() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      toast.error("No data to download.");
      return;
    }
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finhealth_data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data downloaded!");
  }

  function handleDeleteAccount() {
    localStorage.removeItem(storageKey);
    toast.success("Account deleted. Logging out...");
    setTimeout(onClose, 1200);
  }

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const riskColor = (r?: string) => {
    if (r === "Conservative" || r === "Low") return "#4ADE80";
    if (r === "Aggressive" || r === "High") return "#FF4A4A";
    return "#FFBE0B";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "rgba(6,10,16,0.98)", backdropFilter: "blur(8px)" }}
      data-ocid="my-account.modal"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 sm:px-8 py-4"
        style={{
          background: "rgba(6,10,16,0.95)",
          borderBottom: "1px solid #24303A",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "#9AA6B2",
            border: "1px solid #24303A",
          }}
          data-ocid="my-account.close_button"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
          My Account
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {!userData ? (
          <div className="text-center py-20" style={{ color: "#9AA6B2" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "#EAF0F6" }}
            >
              No profile found
            </p>
            <p className="mb-6">
              Complete onboarding to set up your financial profile.
            </p>
            <button
              type="button"
              onClick={() => {
                onStartOnboarding?.();
                onClose();
              }}
              style={{
                background: "#B8FF4A",
                color: "#060A10",
                border: "none",
                borderRadius: 10,
                padding: "12px 32px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Complete Onboarding
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ── 1. PROFILE SECTION ── */}
            <motion.div
              style={cardStyle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              <h2
                className="text-base font-bold mb-4"
                style={{ color: "#EAF0F6" }}
              >
                👤 Profile
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold"
                    style={{
                      background: userData.photoURL
                        ? "transparent"
                        : "rgba(184,255,74,0.15)",
                      border: "2px solid rgba(184,255,74,0.4)",
                      color: "#B8FF4A",
                    }}
                  >
                    {userData.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: "#B8FF4A",
                      border: "2px solid #060A10",
                      cursor: "pointer",
                    }}
                    data-ocid="my-account.upload_button"
                  >
                    <Camera size={12} style={{ color: "#060A10" }} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoUpload}
                    data-ocid="my-account.dropzone"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs" style={{ color: "#9AA6B2" }}>
                      Full Name
                    </p>
                    <p
                      className="text-base font-semibold"
                      style={{ color: "#EAF0F6" }}
                    >
                      {userData.name}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-xs" style={{ color: "#9AA6B2" }}>
                        Email
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm" style={{ color: "#EAF0F6" }}>
                          {userData.email}
                        </p>
                        {userData.emailVerified ? (
                          <CheckCircle size={13} style={{ color: "#4ADE80" }} />
                        ) : (
                          <XCircle size={13} style={{ color: "#FF4A4A" }} />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: "#9AA6B2" }}>
                        Mobile
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm" style={{ color: "#EAF0F6" }}>
                          {userData.mobile}
                        </p>
                        {userData.mobileVerified ? (
                          <CheckCircle size={13} style={{ color: "#4ADE80" }} />
                        ) : (
                          <XCircle size={13} style={{ color: "#FF4A4A" }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ── 2. FINANCIAL PROFILE ── */}
              <motion.div
                style={cardStyle}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-base font-bold"
                    style={{ color: "#EAF0F6" }}
                  >
                    📊 Financial Profile
                  </h2>
                  {!editingFinancial && (
                    <button
                      type="button"
                      onClick={() => setEditingFinancial(true)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: "rgba(184,255,74,0.1)",
                        color: "#B8FF4A",
                        border: "1px solid rgba(184,255,74,0.2)",
                        cursor: "pointer",
                      }}
                      data-ocid="my-account.edit_button"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                  )}
                </div>

                {!editingFinancial ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: "#9AA6B2" }}>
                        Monthly Income
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#EAF0F6" }}
                      >
                        ₹{(userData.income ?? 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: "#9AA6B2" }}>
                        Monthly Savings
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#EAF0F6" }}
                      >
                        ₹{(userData.savings ?? 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "#9AA6B2" }}>
                        Risk Profile
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: `${riskColor(userData.riskProfile)}20`,
                          color: riskColor(userData.riskProfile),
                          border: `1px solid ${riskColor(userData.riskProfile)}40`,
                        }}
                      >
                        {userData.riskProfile ?? "Not set"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="edit-income" style={labelStyle}>
                        Monthly Income (₹)
                      </label>
                      <input
                        id="edit-income"
                        type="number"
                        value={editIncome}
                        onChange={(e) => setEditIncome(e.target.value)}
                        style={inputStyle}
                        data-ocid="my-account.input"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-savings" style={labelStyle}>
                        Monthly Savings (₹)
                      </label>
                      <input
                        id="edit-savings"
                        type="number"
                        value={editSavings}
                        onChange={(e) => setEditSavings(e.target.value)}
                        style={inputStyle}
                        data-ocid="my-account.input"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-risk" style={labelStyle}>
                        Risk Profile
                      </label>
                      <select
                        id="edit-risk"
                        value={editRisk}
                        onChange={(e) => setEditRisk(e.target.value)}
                        style={{ ...inputStyle, cursor: "pointer" }}
                        data-ocid="my-account.select"
                      >
                        <option value="Conservative">Conservative (Low)</option>
                        <option value="Balanced">Balanced (Medium)</option>
                        <option value="Aggressive">Aggressive (High)</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingFinancial(false)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "#9AA6B2",
                          border: "1px solid #24303A",
                          cursor: "pointer",
                        }}
                        data-ocid="my-account.cancel_button"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleFinancialSave}
                        className="flex-1 py-2 rounded-lg text-xs font-bold"
                        style={{
                          background: "#B8FF4A",
                          color: "#060A10",
                          cursor: "pointer",
                        }}
                        data-ocid="my-account.save_button"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* ── 3. LINKED ACCOUNTS ── */}
              <motion.div
                style={cardStyle}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <h2
                  className="text-base font-bold mb-4"
                  style={{ color: "#EAF0F6" }}
                >
                  🔗 Linked Accounts
                </h2>
                <div className="space-y-3">
                  {/* Google */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #24303A",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">G</span>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#EAF0F6" }}
                        >
                          Google Account
                        </p>
                        <p className="text-xs" style={{ color: "#9AA6B2" }}>
                          Not Connected
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Coming soon!")}
                      className="text-xs px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(74,184,255,0.1)",
                        color: "#4AB8FF",
                        border: "1px solid rgba(74,184,255,0.2)",
                        cursor: "pointer",
                      }}
                      data-ocid="my-account.secondary_button"
                    >
                      Connect
                    </button>
                  </div>

                  {/* Mobile */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #24303A",
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#EAF0F6" }}
                      >
                        Mobile
                      </p>
                      <p className="text-xs" style={{ color: "#9AA6B2" }}>
                        {userData.mobile}
                      </p>
                    </div>
                    {userData.mobileVerified ? (
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: "#4ADE80" }}
                      >
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "#FF4A4A" }}>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #24303A",
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#EAF0F6" }}
                      >
                        Email
                      </p>
                      <p className="text-xs" style={{ color: "#9AA6B2" }}>
                        {userData.email}
                      </p>
                    </div>
                    {userData.emailVerified ? (
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: "#4ADE80" }}
                      >
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "#FF4A4A" }}>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Bank */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #24303A",
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#EAF0F6" }}
                      >
                        Bank Account
                      </p>
                      <p className="text-xs" style={{ color: "#9AA6B2" }}>
                        Not Linked
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Bank linking coming soon!")}
                      className="text-xs px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(184,255,74,0.1)",
                        color: "#B8FF4A",
                        border: "1px solid rgba(184,255,74,0.2)",
                        cursor: "pointer",
                      }}
                      data-ocid="my-account.secondary_button"
                    >
                      Link
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* ── 4. SECURITY SETTINGS ── */}
              <motion.div
                style={cardStyle}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2
                  className="text-base font-bold mb-4"
                  style={{ color: "#EAF0F6" }}
                >
                  🔐 Security Settings
                </h2>
                <div className="space-y-3">
                  {/* Change Password */}
                  <div>
                    {!changingPassword ? (
                      <button
                        type="button"
                        onClick={() => setChangingPassword(true)}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-sm"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid #24303A",
                          color: "#EAF0F6",
                          cursor: "pointer",
                        }}
                        data-ocid="my-account.secondary_button"
                      >
                        <div className="flex items-center gap-2">
                          <Lock size={14} style={{ color: "#9AA6B2" }} />
                          <span>Change Password</span>
                        </div>
                        <span style={{ color: "#9AA6B2", fontSize: 12 }}>
                          ›
                        </span>
                      </button>
                    ) : (
                      <div
                        className="space-y-2 p-3 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid #24303A",
                        }}
                      >
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          style={inputStyle}
                          data-ocid="my-account.input"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          style={inputStyle}
                          data-ocid="my-account.input"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          style={inputStyle}
                          data-ocid="my-account.input"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setChangingPassword(false)}
                            className="flex-1 py-2 rounded-lg text-xs"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              color: "#9AA6B2",
                              border: "1px solid #24303A",
                              cursor: "pointer",
                            }}
                            data-ocid="my-account.cancel_button"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handlePasswordChange}
                            className="flex-1 py-2 rounded-lg text-xs font-bold"
                            style={{
                              background: "#B8FF4A",
                              color: "#060A10",
                              cursor: "pointer",
                            }}
                            data-ocid="my-account.save_button"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2FA Toggle */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #24303A",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={14} style={{ color: "#9AA6B2" }} />
                      <span className="text-sm" style={{ color: "#EAF0F6" }}>
                        Two-Factor Auth
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFaEnabled((v) => !v);
                        toast.info("2FA coming soon!");
                      }}
                      className="relative w-10 h-5 rounded-full transition-colors"
                      style={{
                        background: twoFaEnabled ? "#B8FF4A" : "#24303A",
                        cursor: "pointer",
                        border: "none",
                      }}
                      data-ocid="my-account.switch"
                    >
                      <span
                        className="absolute top-0.5 transition-transform w-4 h-4 rounded-full bg-white"
                        style={{
                          transform: twoFaEnabled
                            ? "translateX(22px)"
                            : "translateX(2px)",
                        }}
                      />
                    </button>
                  </div>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      toast.success("Logged out!");
                      setTimeout(onClose, 800);
                    }}
                    className="w-full flex items-center gap-2 p-3 rounded-xl text-sm font-semibold"
                    style={{
                      background: "rgba(255,74,74,0.08)",
                      border: "1px solid rgba(255,74,74,0.2)",
                      color: "#FF4A4A",
                      cursor: "pointer",
                    }}
                    data-ocid="my-account.secondary_button"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </motion.div>

              {/* ── 5. SUBSCRIPTION ── */}
              <motion.div
                style={{
                  ...cardStyle,
                  border: "1px solid rgba(184,255,74,0.3)",
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <h2
                  className="text-base font-bold mb-1"
                  style={{ color: "#EAF0F6" }}
                >
                  💳 Subscription
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: "rgba(184,255,74,0.15)",
                      color: "#B8FF4A",
                      border: "1px solid rgba(184,255,74,0.3)",
                    }}
                  >
                    FREE
                  </span>
                  <span className="text-xs" style={{ color: "#9AA6B2" }}>
                    Current Plan
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  {[
                    "Basic Analytics",
                    "Portfolio Tracking",
                    "Chat Assistant",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#9AA6B2" }}
                    >
                      <CheckCircle size={13} style={{ color: "#B8FF4A" }} />
                      {f}
                    </div>
                  ))}
                  {[
                    "Advanced AI Insights",
                    "Tax Optimizer",
                    "Priority Support",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#4A5568" }}
                    >
                      <Lock size={13} style={{ color: "#4A5568" }} />
                      {f} <span className="text-xs">(Pro)</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toast.info("Pro subscription coming soon at ₹99/month!")
                  }
                  className="w-full py-2.5 rounded-xl text-sm font-bold"
                  style={{
                    background: "#B8FF4A",
                    color: "#060A10",
                    cursor: "pointer",
                    border: "none",
                  }}
                  data-ocid="my-account.primary_button"
                >
                  <CreditCard size={14} className="inline mr-1.5" /> Upgrade to
                  Pro
                </button>
              </motion.div>
            </div>

            {/* ── 6. DATA & PRIVACY ── */}
            <motion.div
              style={cardStyle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2
                className="text-base font-bold mb-4"
                style={{ color: "#EAF0F6" }}
              >
                📂 Data & Privacy
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownloadData}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(74,184,255,0.1)",
                    color: "#4AB8FF",
                    border: "1px solid rgba(74,184,255,0.2)",
                    cursor: "pointer",
                  }}
                  data-ocid="my-account.secondary_button"
                >
                  <Download size={14} /> Download My Data
                </button>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      background: "rgba(255,74,74,0.1)",
                      color: "#FF4A4A",
                      border: "1px solid rgba(255,74,74,0.2)",
                      cursor: "pointer",
                    }}
                    data-ocid="my-account.delete_button"
                  >
                    <Trash2 size={14} /> Delete Account
                  </button>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 p-3 rounded-xl"
                      style={{
                        background: "rgba(255,74,74,0.08)",
                        border: "1px solid rgba(255,74,74,0.3)",
                      }}
                    >
                      <span className="text-sm" style={{ color: "#FF4A4A" }}>
                        Are you sure? This cannot be undone.
                      </span>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{
                          background: "#FF4A4A",
                          color: "#fff",
                          cursor: "pointer",
                          border: "none",
                        }}
                        data-ocid="my-account.confirm_button"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 rounded-lg text-xs"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          color: "#9AA6B2",
                          border: "1px solid #24303A",
                          cursor: "pointer",
                        }}
                        data-ocid="my-account.cancel_button"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            {/* Disclaimer */}
            <p
              className="text-center text-xs pb-4"
              style={{ color: "#4A5568" }}
            >
              For educational purposes only. Not investment advice.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
