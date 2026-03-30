# FinHealth India — Homepage Enhancement

## Current State
LandingPage.tsx exists with: Nav, Hero (generic), Stats bar, Features grid (6 cards), How It Works (3 steps), Bottom CTA, Footer.

Missing sections per user request:
- Problem section (4 pain points)
- Solution section (4 features)
- Market Insights section
- Why FinHealth section
- Pricing section (Free + Pro)
- Hero updated with exact copy and Login button

## Requested Changes (Diff)

### Add
- **Problem section**: 4 pain point cards — "Wrong insurance policies", "Low investment returns", "No financial planning", "Lack of clarity" with warning/error visual treatment
- **Solution section**: Headline "FinHealth helps you analyze financial decisions using AI" + 4 feature pills: Policy Analyzer, SIP Planner, Risk Profile, AI Assistant
- **Market Insights section**: 3 insight cards — Inflation impact, SIP vs FD comparison, Wealth growth examples (with sample numbers)
- **Why FinHealth section**: "Millions of people make poor financial decisions due to lack of guidance. FinHealth is built to provide clarity and smarter decisions."
- **Pricing section**: Free Plan (Basic tools) and Pro Plan (AI insights, Advanced tracking, Weekly reports) cards with a highlighted Pro card

### Modify
- **Hero**: Change heading to "Make smarter financial decisions with AI", subtext to "Analyze investments, track your wealth, and avoid costly mistakes", replace Advisory button with a "Login" button (calls onEnterApp for now)
- **Branding**: Keep "FinHealth India" / "FinPulse" as is
- **Features grid section**: Keep existing 6-card features grid (rename heading slightly if needed) — already present, keep intact
- **Final CTA**: Change button text to "Get Started", heading to "Start your financial journey today"

### Remove
- Nothing removed

## Implementation Plan
1. Add Problem section after Hero/Stats
2. Add Solution section after Problem
3. Keep existing Features grid in place
4. Add Market Insights after Features
5. Add Why FinHealth section
6. Add Pricing section
7. Update Hero copy and buttons
8. Update Final CTA copy
