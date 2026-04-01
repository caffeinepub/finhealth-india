import {
  ArrowLeft,
  Bell,
  Bot,
  Calculator,
  CreditCard,
  Crown,
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
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems: {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/financial-health", label: "Financial Health", icon: Heart },
  { path: "/investments", label: "Investments", icon: TrendingUp },
  { path: "/insurance", label: "Insurance", icon: Shield },
  { path: "/planning", label: "Planning", icon: Target },
  { path: "/loans", label: "Loans", icon: CreditCard },
  { path: "/tax", label: "Tax", icon: Calculator },
  { path: "/ai", label: "AI Assistant", icon: Bot },
  { path: "/tools", label: "Tools Hub", icon: Grid },
  { path: "/pricing", label: "Pricing", icon: Crown },
];

const searchIndex: { label: string; keywords: string[]; path: string }[] = [
  {
    label: "Dashboard",
    keywords: ["dashboard", "home", "overview"],
    path: "/dashboard",
  },
  {
    label: "Financial Health Score",
    keywords: ["health", "score", "finhealth"],
    path: "/financial-health",
  },
  {
    label: "SIP Calculator",
    keywords: ["sip", "mutual fund", "investment"],
    path: "/investments",
  },
  {
    label: "Portfolio Analyzer",
    keywords: ["portfolio", "stocks", "returns"],
    path: "/investments",
  },
  {
    label: "Risk Analysis",
    keywords: ["risk", "profile", "aggressive"],
    path: "/investments",
  },
  {
    label: "Policy Analyzer",
    keywords: ["policy", "insurance", "irr", "ulip"],
    path: "/insurance",
  },
  {
    label: "IRR Calculator",
    keywords: ["irr", "return", "insurance"],
    path: "/insurance",
  },
  {
    label: "Coverage Checker",
    keywords: ["coverage", "life cover"],
    path: "/insurance",
  },
  {
    label: "Retirement Planner",
    keywords: ["retirement", "corpus", "future"],
    path: "/planning",
  },
  {
    label: "Goal Planning",
    keywords: ["goal", "education", "home"],
    path: "/planning",
  },
  {
    label: "EMI Calculator",
    keywords: ["emi", "loan", "home loan"],
    path: "/loans",
  },
  {
    label: "Loan Comparison",
    keywords: ["loan compare", "interest rate"],
    path: "/loans",
  },
  {
    label: "Tax Calculator",
    keywords: ["tax", "old regime", "new regime"],
    path: "/tax",
  },
  {
    label: "Deduction Optimizer",
    keywords: ["80c", "deduction", "hra"],
    path: "/tax",
  },
  {
    label: "AI Financial Assistant",
    keywords: ["ai", "chat", "assistant"],
    path: "/ai",
  },
  {
    label: "Tools Hub",
    keywords: ["tools", "toolkit", "all tools"],
    path: "/tools",
  },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/financial-health": "Financial Health",
  "/investments": "Investments",
  "/insurance": "Insurance",
  "/planning": "Planning",
  "/loans": "Loans",
  "/tax": "Tax Optimizer",
  "/ai": "AI Assistant",
  "/tools": "Tools Hub",
  "/pricing": "Pricing",
  "/profile": "My Profile",
};

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
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

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="p-5 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <Link
          to="/dashboard"
          className="font-bold"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          <span className="gradient-text">FinHealth</span>
          <span className="text-white"> AI</span>
        </Link>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all w-full ${
                active ? "sidebar-item-active" : "sidebar-item"
              }`}
              data-ocid={`sidebar.${item.path.slice(1)}_link`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
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
              {user?.name || "User"}
            </div>
            <div className="text-xs truncate" style={{ color: "#9AA6BF" }}>
              {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
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

          {location.pathname !== "/dashboard" && (
            <button
              type="button"
              onClick={() => navigate(-1)}
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
            {currentTitle}
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
                      navigate(r.path);
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
                      → {pageTitles[r.path] || r.path}
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

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((v) => !v)}
              className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center cursor-pointer"
              data-ocid="topbar.profile_button"
            >
              <User size={14} className="text-white" />
            </button>
            {showProfileMenu && (
              <div
                className="absolute top-full right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{
                  background: "rgba(18,24,42,0.98)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="text-sm font-semibold text-white">
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#9AA6BF" }}>
                    {user?.plan === "pro" ? "Pro Plan" : "Free Plan"}
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5"
                  style={{ color: "#F2F5FF" }}
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                  data-ocid="profile_menu.profile_link"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-white/5"
                  style={{ color: "#FF6B6B" }}
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  data-ocid="profile_menu.logout_button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative" style={{ zIndex: 1 }}>
          <div className="p-4 sm:p-6 page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
