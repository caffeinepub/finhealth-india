# FinHealth India — Version 9: Full-Stack Upgrade

## Current State

FinHealth India is a frontend-heavy app with:
- Internet Identity authentication (already working)
- Motoko backend storing portfolio as JSON string per user
- 4-tab layout: Dashboard, Analysis, Tools, Reports
- All tools implemented modularly as separate components
- Local storage for history/KYC/risk profile
- No onboarding flow, no transactions, no social sharing, no referral system

## Requested Changes (Diff)

### Add
- **Onboarding flow**: Multi-step wizard after first login — collect income, risk appetite, goals → suggest allocation → show dashboard
- **FinHealth Score Engine (upgraded)**: Score out of 100 across 5 dimensions — Diversification (20), Inflation-adjusted returns (20), Insurance efficiency (20), Goal readiness (20), Expense control (20). Displayed as score gauge with improvement suggestions.
- **Card & Spending Analysis Tab** (new tool): Manual transaction entry with categories (Food, Travel, EMI, Shopping, Investments, Subscriptions). Monthly spend totals, top categories, wasteful spend detection, savings suggestions.
- **Social Sharing**: Share DNA Report via WhatsApp, Email, Copy link buttons
- **Referral System**: Generate unique referral code per user (based on Principal), track referral count in backend, display referral card in profile/dashboard
- **User Profile Panel**: Show logged-in user info (Principal shortened), onboarding data (income, risk, goals), FinHealth score
- **Enhanced Insights Engine**: Add expense leak detection, insurance mis-selling detection, portfolio inefficiency signals, goal shortfall alerts
- **Dashboard Alerts Panel**: Overspending alert, wrong policy alert, goal gap alert based on user data
- **Backend APIs**: saveUserProfile, getUserProfile (with income, riskProfile, goals, onboardingComplete), saveTransactions, getTransactions, getReferralCode, recordReferral

### Modify
- **Dashboard**: Add FinHealth Score gauge (5-dimension model), net worth summary card, monthly savings card, alert panel
- **Reports/DNA tab**: Add sharing buttons (WhatsApp/Email/Copy link)
- **Insights engine**: Upgrade to include new signal types
- **App.tsx**: Add onboarding flow gating (show wizard before dashboard if not onboarded), integrate new backend calls

### Remove
- Nothing removed; all existing tools preserved

## Implementation Plan

1. **Backend**: Add UserProfile type (name, income, riskProfile, goals, onboardingComplete), Transaction type; APIs: saveUserProfile, getCallerUserProfile/saveCallerUserProfile (extend), saveTransactions, getTransactions, getReferralCode (deterministic from Principal hash)
2. **Onboarding Wizard**: 3-step component — Step 1: income + risk + goals; Step 2: suggested allocation based on profile; Step 3: redirect to dashboard. Gated by onboardingComplete flag from backend.
3. **FinHealth Score (5-dimension)**: New scoring model — Diversification, Inflation returns, Insurance efficiency, Goal readiness, Expense control
4. **Card & Spending Analysis**: New CardAnalysisTab component with manual transaction input, category pie chart, wasteful spend detection
5. **Social Sharing**: Share buttons in DnaReportTab using Web Share API / WhatsApp URL / mailto / clipboard
6. **Referral System**: ReferralCard component using getReferralCode backend API, copy/share referral link
7. **Dashboard Upgrade**: New alert panel + monthly savings + FinHealth Score gauge
8. **Insights Upgrade**: Add 5 new insight signals to computeInsights
