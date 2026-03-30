import { Loader2, Menu, Save, Search, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GlobalNavProps {
  currentPage: "home" | "app" | "advisory";
  setCurrentPage: (page: "home" | "app" | "advisory") => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userProfile: { name: string } | null;
  shortPrincipal: string;
  photoURL?: string;
  onMyAccount: () => void;
  onLogout: () => void;
  isSaving?: boolean;
  onSave?: () => void;
  setToolsSubTab?: (tab: string) => void;
  setAnalysisSubTab?: (tab: string) => void;
}

const SEARCH_ITEMS = [
  {
    label: "Policy Analyzer",
    icon: "📋",
    tab: "tools",
    subTab: "policy-analyzer",
  },
  {
    label: "SIP Calculator",
    icon: "📈",
    tab: "analysis",
    subTab: "sip-calculator",
  },
  { label: "Goal Planner", icon: "🎯", tab: "tools", subTab: "goal-planner" },
  {
    label: "Risk Profile",
    icon: "⚡",
    tab: "analysis",
    subTab: "risk-profile",
  },
  { label: "Loan Prepayment", icon: "🏦", tab: "tools", subTab: "loan" },
  { label: "Dashboard", icon: "🏠", tab: "dashboard", subTab: null },
  { label: "Reports", icon: "📄", tab: "reports", subTab: null },
  { label: "Rebalancing", icon: "⚖️", tab: "tools", subTab: "rebalancing" },
  { label: "Tax Optimizer", icon: "💰", tab: "tools", subTab: "tax" },
  { label: "Stress Test", icon: "🧪", tab: "tools", subTab: "stress-test" },
  { label: "Inflation Tracker", icon: "📊", tab: "tools", subTab: "inflation" },
  { label: "ULIP vs SIP", icon: "🔄", tab: "tools", subTab: "ulip-sip" },
  {
    label: "Spending Analysis",
    icon: "💳",
    tab: "tools",
    subTab: "spending-analysis",
  },
  {
    label: "Financial Analysis",
    icon: "📉",
    tab: "analysis",
    subTab: "financial-analysis",
  },
  {
    label: "Investor Protection",
    icon: "🛡️",
    tab: "analysis",
    subTab: "investor-protection",
  },
];

export default function GlobalNav({
  currentPage,
  setCurrentPage,
  activeTab,
  setActiveTab,
  userProfile,
  shortPrincipal,
  photoURL,
  onMyAccount,
  onLogout,
  isSaving,
  onSave,
  setToolsSubTab,
  setAnalysisSubTab,
}: GlobalNavProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const displayName = userProfile?.name ?? shortPrincipal;
  const initial = displayName.charAt(0).toUpperCase();

  const filteredItems = searchQuery.trim()
    ? SEARCH_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    {
      label: "Home",
      action: () => {
        setCurrentPage("home");
        setShowMobileMenu(false);
      },
    },
    {
      label: "Dashboard",
      action: () => {
        setCurrentPage("app");
        setActiveTab?.("dashboard");
        setShowMobileMenu(false);
      },
    },
    {
      label: "Tools",
      action: () => {
        setCurrentPage("app");
        setActiveTab?.("tools");
        setShowMobileMenu(false);
      },
    },
    {
      label: "Analysis",
      action: () => {
        setCurrentPage("app");
        setActiveTab?.("analysis");
        setShowMobileMenu(false);
      },
    },
    {
      label: "Reports",
      action: () => {
        setCurrentPage("app");
        setActiveTab?.("reports");
        setShowMobileMenu(false);
      },
    },
  ];

  function isLinkActive(label: string) {
    if (label === "Home") return currentPage === "home";
    if (currentPage !== "app") return false;
    const tabMap: Record<string, string> = {
      Dashboard: "dashboard",
      Tools: "tools",
      Analysis: "analysis",
      Reports: "reports",
    };
    return activeTab === tabMap[label];
  }

  function handleSearchNavigate(item: (typeof SEARCH_ITEMS)[0]) {
    setCurrentPage("app");
    setActiveTab?.(item.tab);
    if (item.subTab) {
      if (item.tab === "tools") setToolsSubTab?.(item.subTab);
      if (item.tab === "analysis") setAnalysisSubTab?.(item.subTab);
    }
    setSearchQuery("");
    setShowSearchDropdown(false);
  }

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(6,10,16,0.95)",
          borderBottom: "1px solid #24303A",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          height: 64,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
          {/* Left: Logo */}
          <button
            type="button"
            data-ocid="nav.logo.button"
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-2 flex-shrink-0"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Zap
              size={22}
              style={{
                color: "#B8FF4A",
                filter: "drop-shadow(0 0 6px #B8FF4A80)",
              }}
            />
            <span className="text-lg font-bold" style={{ color: "#EAF0F6" }}>
              FinHealth
            </span>
          </button>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onClick={link.action}
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: isLinkActive(link.label) ? "#B8FF4A" : "#9AA6B2",
                  fontWeight: isLinkActive(link.label) ? 700 : 500,
                  background: isLinkActive(link.label)
                    ? "rgba(184,255,74,0.08)"
                    : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <div
            ref={searchRef}
            className="hidden md:flex"
            style={{ position: "relative", flex: "0 1 220px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #24303A",
                borderRadius: 10,
                padding: "6px 10px",
                gap: 6,
                width: "100%",
                transition: "border-color 0.2s",
              }}
              onFocusCapture={() => setShowSearchDropdown(true)}
            >
              <Search size={13} style={{ color: "#4A5568", flexShrink: 0 }} />
              <input
                data-ocid="nav.search_input"
                type="text"
                placeholder="Search tools, insights, goals..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#EAF0F6",
                  fontSize: 12,
                  width: "100%",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchDropdown(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4A5568",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {showSearchDropdown && filteredItems.length > 0 && (
              <div
                data-ocid="nav.search.dropdown_menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#0F141B",
                  border: "1px solid #24303A",
                  borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  zIndex: 200,
                  overflow: "hidden",
                }}
              >
                {filteredItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSearchNavigate(item)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-all"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#EAF0F6",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(184,255,74,0.08)";
                      (e.currentTarget as HTMLElement).style.color = "#B8FF4A";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "none";
                      (e.currentTarget as HTMLElement).style.color = "#EAF0F6";
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Save button (app page only) */}
            {currentPage === "app" && onSave && (
              <button
                type="button"
                data-ocid="portfolio.save_button"
                onClick={onSave}
                disabled={isSaving}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "rgba(184,255,74,0.12)",
                  color: "#B8FF4A",
                  border: "1px solid rgba(184,255,74,0.25)",
                  cursor: isSaving ? "not-allowed" : "pointer",
                }}
              >
                {isSaving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
            )}

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                data-ocid="profile.open_modal_button"
                onClick={() => setShowProfileMenu((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
                style={{
                  background: showProfileMenu
                    ? "rgba(184,255,74,0.12)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    showProfileMenu ? "rgba(184,255,74,0.3)" : "#24303A"
                  }`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(184,255,74,0.15)",
                    border: "1px solid rgba(184,255,74,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#B8FF4A",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    initial
                  )}
                </div>
                <span
                  className="hidden sm:block text-xs font-semibold"
                  style={{ color: "#EAF0F6" }}
                >
                  {displayName}
                </span>
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 top-full mt-2 z-50 py-1 min-w-[160px]"
                  style={{
                    background: "#0F141B",
                    border: "1px solid #24303A",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                  data-ocid="profile.dropdown_menu"
                >
                  <button
                    type="button"
                    data-ocid="profile.my-account.link"
                    onClick={() => {
                      onMyAccount();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                    style={{
                      color: "#EAF0F6",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    👤 My Account
                  </button>
                  <button
                    type="button"
                    data-ocid="profile.activity-log.link"
                    onClick={() => {
                      setCurrentPage("app");
                      setActiveTab?.("dashboard");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                    style={{
                      color: "#EAF0F6",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    📊 Activity Log
                  </button>
                  <div
                    style={{
                      height: 1,
                      background: "#24303A",
                      margin: "4px 0",
                    }}
                  />
                  <button
                    type="button"
                    data-ocid="profile.logout.button"
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                    style={{
                      color: "#FF4A4A",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              data-ocid="nav.hamburger.button"
              onClick={() => setShowMobileMenu((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all"
              style={{
                background: showMobileMenu
                  ? "rgba(184,255,74,0.12)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${showMobileMenu ? "rgba(184,255,74,0.3)" : "#24303A"}`,
                cursor: "pointer",
                color: "#EAF0F6",
              }}
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {showMobileMenu && (
          <div
            style={{
              background: "rgba(6,10,16,0.98)",
              borderBottom: "1px solid #24303A",
              padding: "12px 16px 16px",
            }}
          >
            {/* Mobile search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #24303A",
                borderRadius: 10,
                padding: "8px 12px",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Search size={14} style={{ color: "#4A5568", flexShrink: 0 }} />
              <input
                data-ocid="nav.mobile.search_input"
                type="text"
                placeholder="Search tools, insights, goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#EAF0F6",
                  fontSize: 13,
                  width: "100%",
                }}
              />
            </div>

            {/* Mobile search results */}
            {filteredItems.length > 0 && (
              <div
                style={{
                  background: "#0F141B",
                  border: "1px solid #24303A",
                  borderRadius: 10,
                  marginBottom: 12,
                  overflow: "hidden",
                }}
              >
                {filteredItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      handleSearchNavigate(item);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#B8FF4A",
                      textAlign: "left",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span style={{ fontSize: 13 }}>{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={link.action}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: isLinkActive(link.label) ? "#B8FF4A" : "#EAF0F6",
                    fontWeight: isLinkActive(link.label) ? 700 : 500,
                    background: isLinkActive(link.label)
                      ? "rgba(184,255,74,0.08)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${
                      isLinkActive(link.label)
                        ? "rgba(184,255,74,0.2)"
                        : "transparent"
                    }`,
                    cursor: "pointer",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <div
                style={{ height: 1, background: "#24303A", margin: "8px 0" }}
              />
              {currentPage === "app" && onSave && (
                <button
                  type="button"
                  onClick={() => {
                    onSave();
                    setShowMobileMenu(false);
                  }}
                  disabled={isSaving}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    color: "#B8FF4A",
                    background: "rgba(184,255,74,0.08)",
                    border: "1px solid rgba(184,255,74,0.2)",
                    cursor: "pointer",
                  }}
                >
                  {isSaving ? "Saving..." : "💾 Save Portfolio"}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onMyAccount();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  color: "#EAF0F6",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                👤 My Account
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  color: "#FF4A4A",
                  background: "rgba(255,74,74,0.05)",
                  border: "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
