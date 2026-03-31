# FinHealth India

## Current State

The app uses a `currentPage` state with values `"home" | "app" | "advisory"` to switch between pages. Navigation is handled by `GlobalNav`. The landing page (`LandingPage.tsx`) has a footer and CTAs. The Advisory page (`AdvisoryPage.tsx`) is a separate full-page component. There is no dedicated disclaimer/legal page for FinancialAI's positioning.

## Requested Changes (Diff)

### Add
- New page component: `FinancialAIPage.tsx` — a full-page legal/compliance disclosure for FinancialAI
  - Hero section: "FinancialAI — Data, Insights, and Clarity (Not Advice)" with tagline
  - Scope section: what FinancialAI provides (document analysis, portfolio metrics, IRR/XIRR, forecasts, AI insights)
  - Important Clarification section: NOT a financial/investment/insurance advisor or portfolio manager
  - No Guarantees section: no returns guaranteed, projections indicative only
  - Nature of Insights section: informational, educational, not intended to direct decisions
  - User Responsibility section: user is solely responsible, must consult professionals
  - Data Usage & Privacy section: data processed for analysis only, no selling, deletion on request
  - Compliance Positioning section: technology-driven platform, no regulated activities
  - Platform Philosophy section: simplify complexity, present clearly, enable understanding
  - Final Statement banner: "FinancialAI — From Data to Understanding. Decisions remain yours."
- Extend `currentPage` type to include `"financialai"` in App.tsx
- Add conditional render for `currentPage === "financialai"` in App.tsx
- Add "FinancialAI" or "Disclaimer" link in the landing page footer and/or GlobalNav to navigate to this page
- Pass `setCurrentPage` to `LandingPage` footer so it can link to the new page

### Modify
- `App.tsx`: extend page type and add render branch for `"financialai"` page
- `LandingPage.tsx`: add a footer link "FinancialAI Disclaimer" that sets page to `"financialai"`
- `GlobalNav.tsx`: optionally add a footer link or update sitemap to include the new page

### Remove
- Nothing removed

## Implementation Plan

1. Create `src/frontend/src/components/FinancialAIPage.tsx` with all content sections using dark theme (#060A10), accent (#B8FF4A), card-based layout
2. Update `App.tsx` to extend `currentPage` type to `"home" | "app" | "advisory" | "financialai"` and add the render branch with BackButton pointing back to home
3. Update `LandingPage.tsx` footer to include a "FinancialAI" or "About FinancialAI" link
4. Pass `onGoFinancialAI` callback prop from App.tsx → LandingPage.tsx (or use a shared setter)
