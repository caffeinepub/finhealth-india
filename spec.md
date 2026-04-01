# FinHealth AI — Financial Intelligence Platform + Monetization

## Current State
- Full React + Motoko fintech app with dashboard, tools hub, login, onboarding
- DashboardNew.tsx: Health score (basic 5-factor mock), Net Worth card, Income/Expense chart, Smart Alerts, Quick Actions
- Tools available: SIP Calculator, Policy Analyzer (IRR), Tax Optimizer, Goal Planner, EMI Calculator, etc.
- Auth via localStorage session
- No payment/subscription system
- No feature gating (all features free)
- Health score uses simplified mock factors (not weighted financial ratios)
- Stripe component selected and available via backend

## Requested Changes (Diff)

### Add
- **Financial Health Score Engine**: Real weighted scoring (0–100) using 5 factors:
  - Savings Ratio (25%): savings/income → score 0–25
  - Expense Ratio (20%): expenses/income → score 0–20
  - Debt Ratio (20%): EMI/income → score 0–20
  - Investment Quality (20%): equity allocation % → score 0–20
  - Emergency Fund (15%): savings/monthly_expenses → score 0–15
  - Output: score, category (Healthy/Moderate/Risky), actionable insights
- **Upgrade to Pro flow**: Modal/page with ₹199/month and ₹999/year pricing, feature comparison table
- **Stripe payment integration**: Wire up Pro upgrade button to Stripe checkout via backend
- **Feature gating**: `usePlan()` hook reading localStorage `finhealth_plan` (free/pro); lock advanced features with "Upgrade to unlock" overlay
- **Pro-gated features**: Advanced Insurance IRR analysis details, Tax optimization deep-dive, Downloadable reports, Full AI Advisor, Advanced investment analysis
- **AI Insights Engine**: Dynamic insights generated from user's actual financial data (savings %, tax savings estimate, insurance IRR warning)
- **SIP Calculator upgrade**: Add chart showing wealth growth projection (invested vs returns over time)
- **Loan Calculator upgrade**: Add prepayment savings calculation
- **Personalized Dashboard**: Monthly surplus (income - expenses), dynamic insights from real user data
- **PricingPage** (/pricing): Standalone pricing page with Free vs Pro comparison table
- **ProUpgradeModal**: Reusable modal shown when locked feature is tapped

### Modify
- DashboardNew.tsx: Replace mock score with real weighted engine, add monthly surplus display, add "Upgrade to Pro" banner for free users, wire AI insights to real user data
- InsurancePage / PolicyAnalyzerTab: Gate detailed IRR breakdown behind Pro
- TaxOptimizerTab: Gate old vs new regime detailed analysis behind Pro
- AIAssistantPage: Gate full conversation history and advanced responses behind Pro
- AppLayout / GlobalNav: Add /pricing route link
- App.tsx: Add /pricing route

### Remove
- Static mock sub-scores in DashboardNew (replace with real calculated values)

## Implementation Plan
1. Create `src/frontend/src/hooks/usePlan.ts` — reads/writes localStorage `finhealth_plan`, exposes `isPro`, `upgradeToPro()`
2. Create `src/frontend/src/hooks/useFinHealthScore.ts` — real 5-factor weighted calculation from user localStorage data
3. Create `src/frontend/src/components/ProUpgradeModal.tsx` — modal with pricing, feature comparison, Stripe checkout button
4. Create `src/frontend/src/components/PricingPage.tsx` — full pricing comparison page at /pricing
5. Create `src/frontend/src/components/ProGate.tsx` — wrapper component that shows locked overlay for free users
6. Update DashboardNew.tsx — real score engine, monthly surplus, dynamic AI insights, Upgrade to Pro banner
7. Update InsurancePage/PolicyAnalyzerTab — Pro gate on IRR analysis details
8. Update TaxOptimizerTab — Pro gate on detailed tax comparison
9. Update AIAssistantPage — Pro gate on full access
10. Update App.tsx — add /pricing route
11. Wire Stripe checkout via `actor.createStripeCheckoutSession()` from backend
