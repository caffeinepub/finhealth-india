import {
  AlertTriangle,
  CreditCard,
  LogOut,
  Save,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Tab = "personal" | "financial" | "kyc" | "settings";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>("personal");
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Personal
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(user?.dob || "");

  // Financial
  const [income, setIncome] = useState(String(user?.income || ""));
  const [expenses, setExpenses] = useState(String(user?.expenses || ""));
  const [savings, setSavings] = useState(String(user?.savings || ""));
  const [investments, setInvestments] = useState(
    String(user?.investments || ""),
  );

  // KYC
  const [pan, setPan] = useState(user?.pan || "");
  const [aadhaar, setAadhaar] = useState(user?.aadhaar || "");

  const handleSave = () => {
    if (tab === "personal") updateUser({ name, email, phone, dob });
    if (tab === "financial")
      updateUser({
        income: Number(income),
        expenses: Number(expenses),
        savings: Number(savings),
        investments: Number(investments),
      });
    if (tab === "kyc") updateUser({ pan, aadhaar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = () => {
    const uid = localStorage.getItem("finhealth_current_user_id") || "";
    localStorage.removeItem(`finhealth_user_${uid}`);
    localStorage.removeItem("finhealth_logged_in");
    localStorage.removeItem("finhealth_current_user_id");
    navigate("/");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#F2F5FF",
    padding: "10px 14px",
    width: "100%",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    color: "#9AA6BF",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  };

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
  }[] = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "financial", label: "Financial Info", icon: CreditCard },
    { id: "kyc", label: "KYC", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          My Profile
        </h2>
        <p className="text-sm mt-1" style={{ color: "#9AA6BF" }}>
          Manage your personal and financial information
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl overflow-x-auto"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {tabs.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center"
            style={{
              background:
                tab === t.id ? "rgba(47,230,255,0.15)" : "transparent",
              color: tab === t.id ? "#2FE6FF" : "#9AA6BF",
              border:
                tab === t.id
                  ? "1px solid rgba(47,230,255,0.3)"
                  : "1px solid transparent",
            }}
            data-ocid={`profile.${t.id}_tab`}
          >
            <t.icon size={15} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(18,24,42,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Personal Info */}
        {tab === "personal" && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">
              Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div style={labelStyle}>Full Name</div>
                <input
                  style={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  data-ocid="profile.name_input"
                />
              </div>
              <div>
                <div style={labelStyle}>Email Address</div>
                <input
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  data-ocid="profile.email_input"
                />
              </div>
              <div>
                <div style={labelStyle}>Phone Number</div>
                <input
                  style={inputStyle}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  data-ocid="profile.phone_input"
                />
              </div>
              <div>
                <div style={labelStyle}>Date of Birth</div>
                <input
                  style={inputStyle}
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  data-ocid="profile.dob_input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Financial Info */}
        {tab === "financial" && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">
              Financial Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div style={labelStyle}>Monthly Income (₹)</div>
                <input
                  style={inputStyle}
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="85000"
                  data-ocid="profile.income_input"
                />
              </div>
              <div>
                <div style={labelStyle}>Monthly Expenses (₹)</div>
                <input
                  style={inputStyle}
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  placeholder="52000"
                  data-ocid="profile.expenses_input"
                />
              </div>
              <div>
                <div style={labelStyle}>Current Savings (₹)</div>
                <input
                  style={inputStyle}
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="32000"
                  data-ocid="profile.savings_input"
                />
              </div>
              <div>
                <div style={labelStyle}>Total Investments (₹)</div>
                <input
                  style={inputStyle}
                  type="number"
                  value={investments}
                  onChange={(e) => setInvestments(e.target.value)}
                  placeholder="0"
                  data-ocid="profile.investments_input"
                />
              </div>
            </div>
          </div>
        )}

        {/* KYC */}
        {tab === "kyc" && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">
              KYC Information
            </h3>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
              style={{
                background:
                  user?.kyc_status === "Verified"
                    ? "rgba(49,233,129,0.08)"
                    : "rgba(251,206,36,0.08)",
                border: `1px solid ${user?.kyc_status === "Verified" ? "rgba(49,233,129,0.3)" : "rgba(251,206,36,0.3)"}`,
              }}
            >
              <span
                className="text-sm font-medium"
                style={{
                  color:
                    user?.kyc_status === "Verified" ? "#31E981" : "#FBCE24",
                }}
              >
                KYC Status: {user?.kyc_status || "Pending"}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div style={labelStyle}>PAN Number</div>
                <input
                  style={inputStyle}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  data-ocid="profile.pan_input"
                />
              </div>
              <div>
                <div style={labelStyle}>
                  Aadhaar Number{" "}
                  <span style={{ color: "#9AA6BF", fontWeight: 400 }}>
                    (optional)
                  </span>
                </div>
                <input
                  style={inputStyle}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="xxxx xxxx xxxx"
                  maxLength={14}
                  data-ocid="profile.aadhaar_input"
                />
              </div>
            </div>
            <p className="text-xs" style={{ color: "#9AA6BF" }}>
              KYC data is stored locally on your device and used only for
              analysis purposes.
            </p>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">
              Account Settings
            </h3>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>
                <div className="text-white text-sm font-medium">
                  Current Plan
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#9AA6BF" }}>
                  {user?.plan === "pro"
                    ? "Pro Plan — All features unlocked"
                    : "Free Plan — Basic features"}
                </div>
              </div>
              {user?.plan !== "pro" && (
                <button
                  type="button"
                  className="gradient-btn px-4 py-2 rounded-lg text-xs font-semibold"
                  data-ocid="profile.upgrade_button"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F2F5FF",
                }}
                data-ocid="profile.logout_button"
              >
                <LogOut size={16} /> Log Out
              </button>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#ef4444",
                  }}
                  data-ocid="profile.delete_button"
                >
                  <Trash2 size={16} /> Delete Account
                </button>
              ) : (
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                  data-ocid="profile.delete_confirm_dialog"
                >
                  <p className="text-sm text-white mb-3">
                    Are you sure? This will permanently delete your account and
                    all data.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2 rounded-lg text-sm font-medium"
                      style={{ background: "#ef4444", color: "white" }}
                      data-ocid="profile.confirm_button"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "#9AA6BF",
                      }}
                      data-ocid="profile.cancel_button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab !== "settings" && (
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              data-ocid="profile.save_button"
            >
              <Save size={15} /> Save Changes
            </button>
            {saved && (
              <span className="text-sm" style={{ color: "#31E981" }}>
                ✓ Saved!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
