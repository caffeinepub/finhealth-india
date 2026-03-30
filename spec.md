# FinHealth India — User Onboarding Flow

## Current State

App has an existing `OnboardingWizard` component (457 lines) that shows after Internet Identity login when `profile.onboardingComplete` is false. It collects: monthly income, risk profile (Conservative/Balanced/Aggressive), and financial goals. Has 3 steps: (1) income+risk+goals input, (2) allocation preview, (3) confirmation screen.

App.tsx wires it via `showOnboarding` state, which triggers after actor loads user profile and finds `onboardingComplete: false`.

## Requested Changes (Diff)

### Add
- New `UserOnboardingFlow` component with full 3-step signup/KYC/profile flow
  - **Step 1 – Signup**: Full Name, Email, Mobile Number, Password; validation (required + email format)
  - **Step 2 – KYC**: PAN Number (format ABCDE1234F), Date of Birth, consent checkbox ("I consent to use my data for financial analysis"), disclaimer note ("We do not store or share your financial data without consent. For educational purposes only.")
  - **Step 3 – Profile Completion**: Monthly Income, Monthly Savings, Risk Appetite (Low/Medium/High), Financial Goals (optional text)
- Step progress indicator (1 → 2 → 3) matching existing dark theme (#060A10, #B8FF4A)
- On final submit: save to localStorage key `finhealth_user_{userId}` with fields: name, email, mobile, panNumber, dob, income, savings, riskProfile, goals, kycStatus: "completed", createdAt
- After save: dismiss onboarding and show Dashboard (call existing `onComplete` callback)

### Modify
- `OnboardingWizard.tsx` → replace entirely with the new `UserOnboardingFlow` logic (rename file to `OnboardingWizard.tsx` to avoid App.tsx changes, keep same component export name and prop interface `onComplete`)
- `onComplete` callback in App.tsx must still receive `{ income, riskProfile, goals }` so the new Step 3 must map: income → income (number), riskProfile → map Low/Medium/High to Conservative/Balanced/Aggressive, goals → array from text input (split by comma)

### Remove
- Old 2-step allocation preview and confirmation steps inside OnboardingWizard (replaced by new 3-step flow)

## Implementation Plan

1. Rewrite `src/frontend/src/components/OnboardingWizard.tsx` as a new 3-step flow:
   - Step 1: Signup form with name/email/mobile/password fields, validation
   - Step 2: KYC form with PAN (regex ABCDE1234F), DOB, consent checkbox, disclaimer
   - Step 3: Profile form with income, savings, risk appetite (Low/Medium/High), goals (optional)
2. On Step 3 submit:
   - Generate userId from email (simple hash or use email as key)
   - Save localStorage key `finhealth_user_{userId}` with all collected fields + kycStatus + createdAt
   - Call `onComplete({ income: Number(income), riskProfile: mapRisk(riskAppetite), goals: parsedGoals })`
3. Keep same component default export `OnboardingWizard` and same props interface to avoid App.tsx changes
4. Dark theme: background #060A10/#0F141B, accent #B8FF4A, text #EAF0F6/#9AA6B2, borders #24303A
