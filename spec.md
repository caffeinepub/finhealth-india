# FinHealth India – Legal, Compliance & Usage Framework

## Current State

The app has a `FinancialAIPage.tsx` component (~647 lines) accessible via `currentPage === 'financialai'` and linked from the LandingPage footer as "FinancialAI Disclaimer". It currently covers a basic disclaimer with 9 sections (scope, what we're not, no guarantees, nature of insights, user responsibility, data privacy, compliance positioning, platform philosophy, final statement).

The page type union in App.tsx is: `"home" | "app" | "advisory" | "financialai"`.

The LandingPage footer button calls `onGoFinancialAI?.()` which sets `currentPage = 'financialai'`.

## Requested Changes (Diff)

### Add
- 6 new sections not currently present:
  - Section 2: Nature of Services (what FinancialAI is NOT)
  - Section 3: No Advisory or Recommendation
  - Section 8: AI Usage & Guardrails (Allowed/Prohibited/Mandatory Language table)
  - Section 10: Legal Compliance (India) — IT Act 2000, DPDPA 2023
  - Section 11: Prohibited Use
  - Section 13: Modifications
  - Section 14: Governing Law
- Collapsible accordion navigation so users can jump to any section from a sticky sidebar or top TOC
- Prominent top hero banner with the final statement tagline
- Section numbering matching the 15-section framework

### Modify
- Rewrite all existing sections to match the exact language in the Legal Framework document (sections 1, 4, 5, 6, 7, 9, 12, 15)
- Update footer link label from "FinancialAI Disclaimer" to "Legal & Compliance" (optional: keep both terms)
- Improve visual hierarchy: section icons, dividers, colored tags (Allowed=green, Prohibited=red, Mandatory=amber)

### Remove
- Remove old "policy analyzer walkthrough" content that was previously part of this page (it belongs on FinancialAIPage only if it's the policy analyzer; this page should be purely legal/compliance)

## Implementation Plan

1. Fully rewrite `src/frontend/src/components/FinancialAIPage.tsx` with all 15 sections:
   - Hero banner: title + tagline + "Last Updated" date
   - Table of Contents (sticky on desktop, scrollable on mobile) linking to section anchors
   - 15 numbered sections rendered as `<SectionCard>` blocks with anchor IDs
   - Section 8 AI Guardrails: three-column layout (Allowed / Prohibited / Mandatory Language)
   - Section 9 Data Privacy: two-column grid (Data Collected + Usage, Security + Rights)
   - Section 4 Scope: four sub-cards (Document Analysis, Financial Calculations, Projections, AI Insights)
   - Final Statement banner with tagline
2. Update `src/frontend/src/components/LandingPage.tsx` footer button label to "Legal & Compliance Framework" for clarity
3. No changes to App.tsx routing (page type stays `'financialai'`)
