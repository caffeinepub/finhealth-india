import {
  BarChart3,
  ChevronDown,
  FileText,
  Loader2,
  Menu,
  Save,
  Search,
  Shield,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GlobalNavProps {
  currentPage: "home" | "app" | "advisory" | "financialai" | "login";
  setCurrentPage: (
    page: "home" | "app" | "advisory" | "financialai" | "login",
  ) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userProfile: { name: string } | null;
  shortPrincipal: string;
  photoURL?: string;
  onMyAccount: () => void;
  onCloseMyAccount?: () => void;
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

type NavDropdown = "tools" | "analysis" | null;

interface DropdownItem {
  icon: React.ElementType;
  label: string;
  action: () => void;
}

const dropdownPanelStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  minWidth: 200,
  background: "#0D1420",
  border: "1px solid #24303A",
  borderRadius: 12,
  boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
  zIndex: 150,
  overflow: "hidden",
};

function DropdownPanel({
  items,
  visible,
}: { items: DropdownItem[]; visible: boolean }) {
  return (
    <div
      style={{
        ...dropdownPanelStyle,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 180ms ease-out, transform 180ms ease-out",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="w-full flex items-center gap-3"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "11px 16px",
              textAlign: "left",
              color: "#EAF0F6",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(184,255,74,0.08)";
              el.style.color = "#B8FF4A";
              const iconEl = el.querySelector(".dd-icon") as HTMLElement | null;
              if (iconEl) iconEl.style.color = "#B8FF4A";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "none";
              el.style.color = "#EAF0F6";
              const iconEl = el.querySelector(".dd-icon") as HTMLElement | null;
              if (iconEl) iconEl.style.color = "#6B7A8D";
            }}
          >
            <Icon
              size={15}
              className="dd-icon"
              style={{
                color: "#6B7A8D",
                flexShrink: 0,
                transition: "color 150ms ease",
              }}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

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
  onCloseMyAccount,
}: GlobalNavProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [openDropdown, setOpenDropdown] = useState<NavDropdown>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        setSelectedIndex(-1);
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigate(
    page: "home" | "app" | "advisory",
    tab?: string,
    toolsTab?: string,
    analysisTab?: string,
  ) {
    onCloseMyAccount?.();
    setCurrentPage(page);
    if (tab) setActiveTab?.(tab);
    if (toolsTab) setToolsSubTab?.(toolsTab);
    if (analysisTab) setAnalysisSubTab?.(analysisTab);
    setOpenDropdown(null);
    setShowMobileMenu(false);
  }

  const toolsItems: DropdownItem[] = [
    {
      icon: FileText,
      label: "Policy Analyzer",
      action: () => navigate("app", "tools", "policy-analyzer"),
    },
    {
      icon: Target,
      label: "Goal Planner",
      action: () => navigate("app", "tools", "goal-planner"),
    },
    {
      icon: TrendingUp,
      label: "Loan Prepayment",
      action: () => navigate("app", "tools", "loan"),
    },
    {
      icon: BarChart3,
      label: "Rebalancing",
      action: () => navigate("app", "tools", "rebalancing"),
    },
    {
      icon: Zap,
      label: "Tax Optimizer",
      action: () => navigate("app", "tools", "tax"),
    },
  ];

  const analysisItems: DropdownItem[] = [
    {
      icon: TrendingUp,
      label: "SIP Calculator",
      action: () => navigate("app", "analysis", undefined, "sip-calculator"),
    },
    {
      icon: Zap,
      label: "Risk Profile",
      action: () => navigate("app", "analysis", undefined, "risk-profile"),
    },
    {
      icon: BarChart3,
      label: "Financial Analysis",
      action: () =>
        navigate("app", "analysis", undefined, "financial-analysis"),
    },
    {
      icon: Shield,
      label: "Investor Protection",
      action: () =>
        navigate("app", "analysis", undefined, "investor-protection"),
    },
  ];

  function isNavActive(key: string) {
    if (key === "home") return currentPage === "home";
    if (key === "dashboard")
      return currentPage === "app" && activeTab === "dashboard";
    if (key === "tools") return currentPage === "app" && activeTab === "tools";
    if (key === "analysis")
      return currentPage === "app" && activeTab === "analysis";
    if (key === "reports")
      return currentPage === "app" && activeTab === "reports";
    return false;
  }

  function handleSearchNavigate(item: (typeof SEARCH_ITEMS)[0]) {
    onCloseMyAccount?.();
    setCurrentPage("app");
    setActiveTab?.(item.tab);
    if (item.subTab) {
      if (item.tab === "tools") setToolsSubTab?.(item.subTab);
      if (item.tab === "analysis") setAnalysisSubTab?.(item.subTab);
    }
    setSearchQuery("");
    setShowSearchDropdown(false);
    setSelectedIndex(-1);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSearchDropdown || filteredItems.length === 0) {
      if (e.key === "Escape") {
        setSearchQuery("");
        setShowSearchDropdown(false);
        setSelectedIndex(-1);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
        handleSearchNavigate(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setSearchQuery("");
      setShowSearchDropdown(false);
      setSelectedIndex(-1);
    }
  }

  function handleDropdownMouseEnter(key: NavDropdown) {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    hoverTimerRef.current = setTimeout(() => {
      setOpenDropdown(key);
    }, 150);
  }

  function handleDropdownMouseLeave() {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    leaveTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }

  // Simple link button component
  function NavLink({
    label,
    active,
    onClick,
    "data-ocid": ocid,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    "data-ocid": string;
  }) {
    return (
      <button
        type="button"
        data-ocid={ocid}
        onClick={onClick}
        className="px-3 py-1.5 rounded-lg text-sm font-medium"
        style={{
          color: active ? "#B8FF4A" : "#9AA6B2",
          fontWeight: active ? 600 : 500,
          background: active ? "rgba(184,255,74,0.08)" : "transparent",
          border: "none",
          cursor: "pointer",
          transition: "all 150ms ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.color = "#B8FF4A";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(184,255,74,0.06)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.color = "#9AA6B2";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }
        }}
      >
        {label}
      </button>
    );
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
          {/* Logo */}
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

          {/* Center Nav (desktop) */}
          <nav ref={navRef} className="hidden md:flex items-center gap-0.5">
            {/* Home */}
            <NavLink
              label="Home"
              active={isNavActive("home")}
              onClick={() => setCurrentPage("home")}
              data-ocid="nav.home.link"
            />

            {/* Dashboard */}
            <NavLink
              label="Dashboard"
              active={isNavActive("dashboard")}
              onClick={() => navigate("app", "dashboard")}
              data-ocid="nav.dashboard.link"
            />

            {/* Tools dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => handleDropdownMouseEnter("tools")}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                type="button"
                data-ocid="nav.tools.link"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  color:
                    isNavActive("tools") || openDropdown === "tools"
                      ? "#B8FF4A"
                      : "#9AA6B2",
                  fontWeight:
                    isNavActive("tools") || openDropdown === "tools"
                      ? 600
                      : 500,
                  background:
                    isNavActive("tools") || openDropdown === "tools"
                      ? "rgba(184,255,74,0.08)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isNavActive("tools") && openDropdown !== "tools") {
                    (e.currentTarget as HTMLElement).style.color = "#B8FF4A";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(184,255,74,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isNavActive("tools") && openDropdown !== "tools") {
                    (e.currentTarget as HTMLElement).style.color = "#9AA6B2";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }
                }}
              >
                Tools
                <ChevronDown
                  size={13}
                  style={{
                    transition: "transform 180ms ease",
                    transform:
                      openDropdown === "tools"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
              </button>
              <DropdownPanel
                items={toolsItems}
                visible={openDropdown === "tools"}
              />
            </div>

            {/* Analysis dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => handleDropdownMouseEnter("analysis")}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                type="button"
                data-ocid="nav.analysis.link"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  color:
                    isNavActive("analysis") || openDropdown === "analysis"
                      ? "#B8FF4A"
                      : "#9AA6B2",
                  fontWeight:
                    isNavActive("analysis") || openDropdown === "analysis"
                      ? 600
                      : 500,
                  background:
                    isNavActive("analysis") || openDropdown === "analysis"
                      ? "rgba(184,255,74,0.08)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isNavActive("analysis") && openDropdown !== "analysis") {
                    (e.currentTarget as HTMLElement).style.color = "#B8FF4A";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(184,255,74,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isNavActive("analysis") && openDropdown !== "analysis") {
                    (e.currentTarget as HTMLElement).style.color = "#9AA6B2";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }
                }}
              >
                Analysis
                <ChevronDown
                  size={13}
                  style={{
                    transition: "transform 180ms ease",
                    transform:
                      openDropdown === "analysis"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
              </button>
              <DropdownPanel
                items={analysisItems}
                visible={openDropdown === "analysis"}
              />
            </div>

            {/* Reports */}
            <NavLink
              label="Reports"
              active={isNavActive("reports")}
              onClick={() => navigate("app", "reports")}
              data-ocid="nav.reports.link"
            />
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
                placeholder="Search tools, insights..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(-1);
                  setShowSearchDropdown(true);
                }}
                onKeyDown={handleSearchKeyDown}
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
                    setSelectedIndex(-1);
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
                {filteredItems.map((item, idx) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSearchNavigate(item)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-all"
                    style={{
                      background:
                        idx === selectedIndex
                          ? "rgba(184,255,74,0.12)"
                          : "none",
                      borderLeft:
                        idx === selectedIndex
                          ? "2px solid #B8FF4A"
                          : "2px solid transparent",
                      cursor: "pointer",
                      color: idx === selectedIndex ? "#B8FF4A" : "#EAF0F6",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (idx !== selectedIndex) {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(184,255,74,0.08)";
                        (e.currentTarget as HTMLElement).style.color =
                          "#B8FF4A";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (idx !== selectedIndex) {
                        (e.currentTarget as HTMLElement).style.background =
                          "none";
                        (e.currentTarget as HTMLElement).style.color =
                          "#EAF0F6";
                      }
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
            {/* Save button */}
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
                  border: `1px solid ${showProfileMenu ? "rgba(184,255,74,0.3)" : "#24303A"}`,
                  cursor: "pointer",
                  transition: "transform 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
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
                  data-ocid="profile.dropdown_menu"
                  className="absolute right-0 top-full mt-2 z-50 py-1 min-w-[160px]"
                  style={{
                    background: "#0F141B",
                    border: "1px solid #24303A",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
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
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl"
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

        {/* Mobile menu */}
        {showMobileMenu && (
          <div
            style={{
              background: "rgba(6,10,16,0.98)",
              borderBottom: "1px solid #24303A",
              padding: "12px 16px 16px",
              maxHeight: "calc(100vh - 64px)",
              overflowY: "auto",
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
                placeholder="Search tools, insights..."
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

            {/* Mobile nav links */}
            <div className="flex flex-col gap-1 mb-3">
              {[
                {
                  label: "🏠 Home",
                  action: () => {
                    onCloseMyAccount?.();
                    setCurrentPage("home");
                    setShowMobileMenu(false);
                  },
                },
                {
                  label: "📊 Dashboard",
                  action: () => navigate("app", "dashboard"),
                },
                {
                  label: "📋 Policy Analyzer",
                  action: () => navigate("app", "tools", "policy-analyzer"),
                },
                {
                  label: "🎯 Goal Planner",
                  action: () => navigate("app", "tools", "goal-planner"),
                },
                {
                  label: "📈 SIP Calculator",
                  action: () =>
                    navigate("app", "analysis", undefined, "sip-calculator"),
                },
                {
                  label: "⚡ Risk Profile",
                  action: () =>
                    navigate("app", "analysis", undefined, "risk-profile"),
                },
                {
                  label: "📄 Reports",
                  action: () => navigate("app", "reports"),
                },
              ].map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={link.action}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: "#EAF0F6",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

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
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium mb-2"
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
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium mb-1"
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
        )}
      </header>
    </>
  );
}
