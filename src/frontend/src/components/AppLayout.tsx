import {
  ArrowLeft,
  Bell,
  Bot,
  Calculator,
  CreditCard,
  Grid,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import type { AppPage } from "../App";
import AIAssistantPage from "./AIAssistantPage";
import Dashboard from "./DashboardNew";
import FinancialHealthPage from "./FinancialHealthPage";
import InsurancePage from "./InsurancePage";
import InvestmentsPage from "./InvestmentsPage";
import LoansPage from "./LoansPage";
import PlanningPage from "./PlanningPage";
import TaxPage from "./TaxPage";
import ToolsHub from "./ToolsHub";

export type SidebarPage =
  | "dashboard"
  | "health"
  | "investments"
  | "insurance"
  | "planning"
  | "loans"
  | "tax"
  | "ai"
  | "tools";

interface Props {
  navigate: (to: AppPage) => void;
}

const navItems: {
  id: SidebarPage;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "health", label: "Financial Health", icon: Heart },
  { id: "investments", label: "Investments", icon: TrendingUp },
  { id: "insurance", label: "Insurance", icon: Shield },
  { id: "planning", label: "Planning", icon: Target },
  { id: "loans", label: "Loans", icon: CreditCard },
  { id: "tax", label: "Tax", icon: Calculator },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "tools", label: "Tools Hub", icon: Grid },
];

const pageTitles: Record<SidebarPage, string> = {
  dashboard: "Dashboard",
  health: "Financial Health",
  investments: "Investments",
  insurance: "Insurance",
  planning: "Planning",
  loans: "Loans",
  tax: "Tax Optimizer",
  ai: "AI Assistant",
  tools: "Tools Hub",
};

// Search index for quick navigation
const searchIndex: { label: string; keywords: string[]; page: SidebarPage }[] =
  [
    {
      label: "Dashboard",
      keywords: ["dashboard", "home", "overview"],
      page: "dashboard",
    },
    {
      label: "Financial Health Score",
      keywords: ["health", "score", "finhealth"],
      page: "health",
    },
    {
      label: "SIP Calculator",
      keywords: ["sip", "mutual fund", "investment"],
      page: "investments",
    },
    {
      label: "Portfolio Analyzer",
      keywords: ["portfolio", "stocks", "returns"],
      page: "investments",
    },
    {
      label: "Risk Analysis",
      keywords: ["risk", "profile", "aggressive"],
      page: "investments",
    },
    {
      label: "Policy Analyzer",
      keywords: ["policy", "insurance", "irr", "ulip"],
      page: "insurance",
    },
    {
      label: "IRR Calculator",
      keywords: ["irr", "return", "insurance"],
      page: "insurance",
    },
    {
      label: "Coverage Checker",
      keywords: ["coverage", "life cover", "health cover"],
      page: "insurance",
    },
    {
      label: "Retirement Planner",
      keywords: ["retirement", "corpus", "future"],
      page: "planning",
    },
    {
      label: "Goal Planning",
      keywords: ["goal", "education", "home"],
      page: "planning",
    },
    {
      label: "Wealth Projection",
      keywords: ["wealth", "net worth", "projection"],
      page: "planning",
    },
    {
      label: "EMI Calculator",
      keywords: ["emi", "loan", "home loan", "car loan"],
      page: "loans",
    },
    {
      label: "Loan Comparison",
      keywords: ["loan compare", "interest rate"],
      page: "loans",
    },
    {
      label: "Prepayment Strategy",
      keywords: ["prepayment", "part payment"],
      page: "loans",
    },
    {
      label: "Tax Calculator",
      keywords: ["tax", "old regime", "new regime"],
      page: "tax",
    },
    {
      label: "Deduction Optimizer",
      keywords: ["80c", "deduction", "hra", "save tax"],
      page: "tax",
    },
    {
      label: "AI Financial Assistant",
      keywords: ["ai", "chat", "assistant"],
      page: "ai",
    },
    {
      label: "Tools Hub",
      keywords: ["tools", "toolkit", "all tools"],
      page: "tools",
    },
  ];

function getUserData() {
  const uid = localStorage.getItem("finhealth_current_user_id") || "";
  try {
    return JSON.parse(localStorage.getItem(`finhealth_user_${uid}`) || "{}");
  } catch {
    return {};
  }
}

export default function AppLayout({ navigate }: Props) {
  const [activePage, setActivePage] = useState<SidebarPage>("dashboard");
  const [pageHistory, setPageHistory] = useState<SidebarPage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const user = getUserData();

  const navigateTo = (page: SidebarPage) => {
    setPageHistory((prev) => [...prev, activePage]);
    setActivePage(page);
    setSidebarOpen(false);
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const prev = pageHistory[pageHistory.length - 1];
      setPageHistory((h) => h.slice(0, -1));
      setActivePage(prev);
    } else {
      setActivePage("dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("finhealth_logged_in");
    navigate("landing");
  };

  const searchResults =
    searchQuery.trim().length > 0
      ? searchIndex
          .filter(
            (item) =>
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.keywords.some((k) =>
                k.toLowerCase().includes(searchQuery.toLowerCase()),
              ),
          )
          .slice(0, 6)
      : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="p-5 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <span
          className="font-bold"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          <span className="gradient-text">FinHealth</span>
          <span className="text-white"> AI</span>
        </span>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full text-left ${active ? "sidebar-item-active" : "sidebar-item"}`}
              data-ocid={`sidebar.${item.id}_link`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        className="p-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user.name || "User"}
            </div>
            <div className="text-xs truncate" style={{ color: "#9AA6BF" }}>
              {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-all"
          style={{ color: "#9AA6BF", background: "transparent" }}
          data-ocid="sidebar.logout_button"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#070A12" }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 w-60"
        style={{
          background: "rgba(10,14,24,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 30,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setSidebarOpen(false)}
            onKeyDown={() => setSidebarOpen(false)}
            role="presentation"
            tabIndex={-1}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{
              background: "rgba(10,14,24,0.98)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                style={{ color: "#9AA6BF" }}
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-60">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-4 sm:px-6 h-16 flex-shrink-0"
          style={{
            background: "rgba(7,10,18,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <button
            type="button"
            className="md:hidden"
            style={{ color: "#9AA6BF" }}
            onClick={() => setSidebarOpen(true)}
            data-ocid="topbar.menu_button"
          >
            <Menu size={20} />
          </button>

          {/* Back button — visible when not on dashboard */}
          {activePage !== "dashboard" && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                color: "#9AA6BF",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              data-ocid="topbar.back_button"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          <h1
            className="font-bold text-white text-lg flex-1"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            {pageTitles[activePage]}
          </h1>

          {/* Search */}
          <div className="relative hidden sm:block">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                minWidth: "180px",
              }}
            >
              <Search size={14} style={{ color: "#9AA6BF" }} />
              <input
                className="bg-transparent text-sm outline-none flex-1"
                style={{ color: "#9AA6BF" }}
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                data-ocid="topbar.search_input"
              />
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div
                className="absolute top-full mt-1 right-0 w-64 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{
                  background: "rgba(18,24,42,0.98)",
                  border: "1px solid rgba(47,230,255,0.2)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {searchResults.map((r) => (
                  <button
                    type="button"
                    key={r.label}
                    className="w-full text-left px-4 py-2.5 text-sm transition-all"
                    style={{ color: "#F2F5FF" }}
                    onMouseDown={() => {
                      navigateTo(r.page);
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(47,230,255,0.08)";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(47,230,255,0.08)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                  >
                    {r.label}
                    <span className="ml-2 text-xs" style={{ color: "#9AA6BF" }}>
                      → {pageTitles[r.page]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="relative"
            style={{ color: "#9AA6BF" }}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-btn text-xs flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center cursor-pointer">
            <User size={14} className="text-white" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative" style={{ zIndex: 1 }}>
          <div className="p-4 sm:p-6">
            {activePage === "dashboard" && (
              <Dashboard setActivePage={navigateTo} />
            )}
            {activePage === "health" && <FinancialHealthPage />}
            {activePage === "investments" && <InvestmentsPage />}
            {activePage === "insurance" && <InsurancePage />}
            {activePage === "planning" && <PlanningPage />}
            {activePage === "loans" && <LoansPage />}
            {activePage === "tax" && <TaxPage />}
            {activePage === "ai" && <AIAssistantPage />}
            {activePage === "tools" && <ToolsHub setActivePage={navigateTo} />}
          </div>
        </main>
      </div>
    </div>
  );
}
