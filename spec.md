# FinHealth AI — Premium Redesign & Enhancement

## Current State

The app already exists with:
- Landing page (LandingPageNew.tsx) with hero, problem/solution/capabilities sections
- Login page (LoginPageNew.tsx) with Google/Apple/email auth
- AppLayout with fixed sidebar (9 items: Dashboard, Financial Health, Investments, Insurance, Planning, Loans, Tax, AI Assistant, Tools Hub)
- Dashboard (DashboardNew.tsx) with SVG gauge, income/expense chart, health sub-scores, smart alerts, quick actions
- Tool Hub (ToolsHub.tsx) with categorized tools grid
- All section pages: InvestmentsPage, InsurancePage, PlanningPage, LoansPage, TaxPage, AIAssistantPage, FinancialHealthPage
- Dark theme (#070A12), blue/purple/cyan gradients, glassmorphism cards
- CSS in index.css: `.glass-card`, `.gradient-btn`, `.gradient-text`, `.sidebar-item`, `.sidebar-item-active`
- localStorage-based auth and user profile

## Requested Changes (Diff)

### Add
- Landing page: update hero headline to "Your Personal Financial Doctor — Powered by AI", subheading to "Analyze your finances, uncover hidden mistakes, and get clear, actionable insights.", primary CTA to "Check My Financial Health", secondary CTA to "Explore Tools"
- Landing page: final CTA section "Start Your Financial Diagnosis Today"
- Dashboard: Smart Alerts / AI Insights section with contextual recommendations ("Your insurance is weak → Analyze Policy", "Optimize your tax → Open Tax Optimizer")
- Dashboard: Net Worth summary card
- Financial Health Score breakdown showing Savings, Investments, Debt, Risk sub-scores
- Smart Recommendation System on dashboard that guides users to actions
- Loading animations on all pages/tools
- Back button functionality throughout the app

### Modify
- Overall UI: enhance glassmorphism depth, add more multi-color gradients (blue #2FE6FF, purple #7A3CFF, cyan glow), stronger neon highlights on key elements
- Landing page: problem section highlighting "people are sold products not advice", "hidden charges in insurance & investments", "no clear financial direction"
- Landing page: solution section as 3-step flow (Add data → Get Score → Get recommendations)
- Landing page: platform capabilities grid (6 cards)
- Dashboard: cleaner layout — show ONLY Health Score gauge, Net Worth, Income vs Expense chart, Smart Alerts
- Dashboard: Financial Health Score breakdown with 4 dimensions: Savings, Investments, Debt, Risk
- Tool Hub: maintain grid layout with search bar, 6 categories with proper icons and descriptions
- All tool pages: ensure all buttons work, navigation is smooth, no freezing
- AppLayout: ensure back button works, mobile hamburger menu works

### Remove
- Nothing should be removed — all existing tools and pages should remain functional

## Implementation Plan

1. Update `index.css` — enhance glassmorphism variables, add stronger neon glow utilities, add `.neon-highlight` and `.gradient-border` classes
2. Update `LandingPageNew.tsx` — new hero copy, problem/solution/capabilities/final CTA sections exactly as specified
3. Update `DashboardNew.tsx` — cleaner 4-card layout (Health Score, Net Worth, Income/Expense, Smart Alerts), Financial Health breakdown shows Savings/Investments/Debt/Risk, Smart Recommendations strip
4. Update `AppLayout.tsx` — ensure back button logic, smooth navigation, loading states on page switch
5. Update `ToolsHub.tsx` — verify all 6 categories with correct tools listed, search works
6. Ensure all section pages have loading animations and work correctly
7. Responsive — mobile sidebar drawer, mobile-friendly tool cards
