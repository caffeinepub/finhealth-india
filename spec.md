# FinHealth India — Guided Journey Architecture

## Current State

The app has a tab-based navigation (Home/Dashboard/Tools/Analysis/Reports) that presents tools as a collection. The GlobalNav uses dropdowns for Tools, Analysis, and Reports. The main app view is controlled by `activeTab` state switching between dashboard, tools, analysis, and reports tabs. The dashboard (FinancialIntelligencePanel + DashboardInsights) already has FinHealth Score, Money Loss Tracker, Goal Tracking, Smart Alerts. All existing tools (PolicyAnalyzerTab, SipCalculatorTab, GoalPlannerTab, etc.) are under Tools/Analysis tabs.

## Requested Changes (Diff)

### Add
- **Financial Overview card** at top of dashboard: 4-metric grid showing Net Worth (₹X), Total Assets (₹X), Total Liabilities (₹X), Policies Analyzed (count)
- **Key Insights strip** below overview: 2–3 auto-generated contextual insight chips (e.g. "Your overall returns appear moderate", "Insurance allocation is high") — pulled from existing portfolio data, labeled "For informational purposes only"
- **Quick Actions row** on dashboard: Upload Policy, Add Investment, View Portfolio — each navigates to correct module
- **Recent Activity section** on dashboard: shows last analyzed policy name/date and last report, drawn from localStorage events
- **New navbar structure** replacing Tools/Analysis/Reports dropdowns with journey-based menu:
  - Understand ▼ → Policy Analyzer
  - Analyze ▼ → Portfolio
  - Improve ▼ → Insights & Comparison
  - Track ▼ → Dashboard / Wealth Tracking
- **Legal footnote** on each module result screen: small muted text "For informational purposes only. Not a recommendation. Estimates based on assumptions."
- **Policies analyzed counter** in state: increment each time a policy upload/analysis is completed, persist in localStorage under `finhealth_stats_{userId}`

### Modify
- **GlobalNav.tsx**: Replace center nav links and dropdowns (Home/Dashboard/Tools/Analysis/Reports) with four journey modules: Understand / Analyze / Improve / Track, each with a dropdown. Keep Home link on logo. Keep search, profile dropdown, mobile hamburger.
- **App.tsx activeTab mapping**: Map new journey modules to existing tab values:
  - Understand → opens tools tab with policy-analyzer subTab
  - Analyze → opens analysis tab with portfolio subTab  
  - Improve → opens analysis tab with insights subTab (new sub-section or existing financial-analysis)
  - Track → opens dashboard tab
- **Dashboard layout**: Restructure dashboard tab to show Financial Overview → Key Insights → Quick Actions → Recent Activity → then existing FinancialIntelligencePanel content (FinHealth Score, Money Loss Tracker, Smart Alerts, Goal Tracking)
- **Policy Analyzer flow**: After analysis completes, increment policies-analyzed counter and fire a state update so dashboard Financial Overview reflects the new count

### Remove
- Old center navbar items: Home (text link), Dashboard, Tools, Analysis, Reports as top-level labels
- No existing tool components are removed — only reorganized under new nav structure

## Implementation Plan

1. **GlobalNav.tsx** — Replace the center navigation with four journey-based dropdown menus (Understand / Analyze / Improve / Track). Each opens a dropdown with one item per the spec. Keep logo → home, search bar, profile dropdown, mobile hamburger. Update props to support new navigation callbacks.
2. **App.tsx** — Add `journeyModule` state or reuse `activeTab` with new mappings. Add `policiesAnalyzed` counter to state (loaded from localStorage `finhealth_stats_{userId}`). Pass `setPoliciesAnalyzed` increment callback down to PolicyAnalyzerTab.
3. **New FinancialOverviewCard component** (or inline in dashboard section of App.tsx) — Shows Net Worth, Total Assets, Total Liabilities, Policies Analyzed. Reads from existing `entries` state (assets/liabilities) and new policiesAnalyzed counter.
4. **KeyInsights strip** — Derives 2–3 insight strings from existing portfolio data (equity %, savings rate, policy count) and renders them as chips with disclaimer label.
5. **QuickActions row** — Three buttons that call `setActiveTab` / `setToolsSubTab` to navigate to the right module.
6. **RecentActivity section** — Reads `finhealth_events_{userId}` from localStorage, filters for `policy_analyzed` and report events, shows last 2 items.
7. **Legal footnote** — Small `<p>` rendered at the bottom of PolicyAnalyzerTab result section, PortfolioAnalysis panel, and Insights panel.
8. **Dashboard layout restructuring** — In App.tsx dashboard TabsContent, insert Financial Overview → Key Insights → Quick Actions → Recent Activity blocks above the existing FinancialIntelligencePanel.
