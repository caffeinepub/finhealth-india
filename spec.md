# FinHealth India — Financial Intelligence Dashboard

## Current State
- Dashboard tab exists with portfolio management, analysis actions, DashboardInsights panel, and alerts.
- `userProfile` has: name, income, goals[], riskProfile
- `userId` is the principal string
- localStorage keys: `finhealth_user_{userId}`, `finhealth_events_{userId}`
- `equityPct`, `totalAssets`, `cashPct` already computed in App.tsx
- Navigation: `setActiveTab` for tabs (dashboard/analysis/tools/reports), `setToolsSubTab` for tools sub-tabs
- DashboardInsights component already placed after Activity Insights

## Requested Changes (Diff)

### Add
- New `FinancialIntelligencePanel` component inserted into Dashboard tab (before DashboardInsights)
- FinHealth Score card (out of 100) with color coding (red/yellow/green)
- Money Loss Tracker (locked behind free plan paywall)
- Goal Tracking section with progress bars per goal
- Smart Alerts section (equity >70%, savings <20%, no goals)
- Action Buttons (Open Goal Planner, Open Policy Analyzer, Open SIP Calculator)
- Paywall overlay for free plan users on Money Loss details

### Modify
- App.tsx: import and render `FinancialIntelligencePanel` in Dashboard tab, passing required props

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/FinancialIntelligencePanel.tsx`
2. Props: userId, userProfile (name/income/goals/riskProfile), equityPct, totalAssets, entries, setActiveTab, setToolsSubTab
3. Calculate all 5 score dimensions from localStorage + props
4. Render 6 sections: Score, Money Loss (paywalled), Goal Tracking, Smart Alerts, Action Buttons
5. Import and add to App.tsx dashboard tab
