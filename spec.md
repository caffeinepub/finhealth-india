# FinHealth India

## Current State
The app has a full LandingPage.tsx with hero, problems, solutions, features grid, market insights, pricing, and CTA sections. The Policy Analyzer (PolicyAnalyzerTab.tsx) is already fully implemented with IRR calculation, comparisons, and verdicts. The Dashboard (FinancialIntelligencePanel.tsx) has FinHealth Score, Money Loss Tracker, Goals, and Alerts.

## Requested Changes (Diff)

### Add
- A new dedicated **FinancialAI Feature Showcase** section on the Landing Page, positioned after the hero and before the existing problem section. This section announces the "Complete FinancialAI Experience" with:
  - Intro banner: "Your platform just got significantly more powerful"
  - 5 feature highlight cards with icons, titles, descriptions, and CTAs:
    1. Policy Analyzer — Know the Truth (CTA: Upload Your Policy)
    2. Wealth Dashboard — See Everything Together (asset list: MF, Stocks, FD, Real Estate, Insurance)
    3. Portfolio Intelligence — Go Beyond Returns (XIRR, rebalancing signals)
    4. AI Financial Insights — Your Smart Advisor (detect low-return products, optimization)
    5. Goal-Based Planning — Build Your Future (retirement, home, education)
  - "Why This Changes Everything" differentiator block (Track OR Sell vs Understand+Evaluate+Improve)
  - "The Complete Package" summary block
  - Three CTA buttons: Upload Your Policy, Explore Dashboard, Start Your Analysis
  - Final tagline: "FinancialAI — From Confusion to Complete Control."

### Modify
- LandingPage.tsx: Insert the new FinancialAI showcase section after the hero

### Remove
- Nothing

## Implementation Plan
1. Add the FinancialAI showcase section inside LandingPage.tsx after the hero section
2. Each feature card should link/navigate to the respective tool (onEnterApp with tab targeting or just onEnterApp)
3. Style consistent with existing dark theme (#060A10, accent #B8FF4A), card-based, smooth animations with motion/react
4. The three CTA buttons at the bottom should call onEnterApp()
