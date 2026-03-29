# FinHealth India — Financial Decision Intelligence Platform Upgrade

## Current State
- App has Tools tab with sub-tabs: Stress Test, Inflation, Rebalancing, Tax Optimizer, Life Stage, Gold vs SGB
- Reports tab has DnaReportTab
- Portfolio, Analysis, Trends, Investor Protection, SIP Calculator, KYC tabs exist
- All components are standalone TSX files, frontend-only, local storage

## Requested Changes (Diff)

### Add
- `InvestmentCalculatorTab.tsx`: SIP + Lumpsum calculator with future value, total invested, wealth gain, CAGR, approx XIRR, inflation-adjusted returns, growth chart over time
- `LoanPrepaymentTab.tsx`: Inputs for loan amount, rate, tenure, EMI, extra yearly payment; outputs total interest saved, new tenure, closure timeline, year-wise breakdown table, savings chart
- Two new sub-tabs in Tools: "Investment Calculator" and "Loan Prepayment Analyzer"

### Modify
- Tools sub-tab list in App.tsx: add "investment" and "loan" sub-tabs alongside existing ones
- DnaReportTab: add download as image (html2canvas or canvas-based) for Financial DNA Report
- Insights engine in App.tsx: make insights more numeric and specific (e.g., "Equity is 78%, above recommended 60–70%", "Cash is X%, causing inflation erosion of ₹Y/year")
- Improve compliance footer/disclaimer visibility

### Remove
- Nothing removed

## Implementation Plan
1. Create `InvestmentCalculatorTab.tsx` with SIP/Lumpsum toggle, inputs, computed outputs (FV, invested, gain, CAGR, XIRR approx), inflation-adjusted output, area chart of growth over time
2. Create `LoanPrepaymentTab.tsx` with inputs, amortization engine, year-wise table, bar chart comparing with/without prepayment
3. Update `App.tsx`: import new tabs, add to toolsSubTab options, improve insights engine with numeric specifics
4. Update `DnaReportTab.tsx`: add download as PNG using native canvas approach (no new library needed)
5. Validate and build
