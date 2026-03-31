# FinHealth India – Secure Login System

## Current State
- App opens on a Landing Page (`currentPage === 'home'`) with Get Started / Login buttons
- Authentication is a mix of mock Google login (stored in localStorage as `finhealth_google_user_id`) and a 5-step OnboardingWizard (shown via `showOnboarding` state)
- There is no dedicated login/signup UI — new users only hit onboarding, returning users auto-login via localStorage
- No Apple login, no CAPTCHA, no email+password auth form

## Requested Changes (Diff)

### Add
- `LoginPage` component: premium fintech-style login/signup screen
  - Google login button (mock OAuth, stores to localStorage)
  - Apple login button (mock, stores to localStorage)
  - OR divider
  - Email + Password form with validation
  - Cloudflare Turnstile CAPTCHA widget (UI simulation — real token gated behind submit)
  - Toggle between Login and Sign Up modes
  - "Forgot Password?" link
  - Terms & Conditions / Privacy Policy consent checkbox
  - Loading spinner on submit
  - Clear inline error messages (invalid email, wrong password, duplicate account)
  - Auto-login if session exists in localStorage → skip to Dashboard
- `currentPage` gains a new `'login'` state
- Landing page "Login" and "Get Started" buttons route to `currentPage = 'login'`
- After successful login/signup → route to `currentPage = 'app'` (Dashboard)

### Modify
- `App.tsx`: add `'login'` to `currentPage` type, render `<LoginPage>` when `currentPage === 'login'`
- Landing page CTAs: "Get Started" → login page in signup mode, "Login" → login page in login mode
- Auto-login on app load: if `finhealth_auth_session` exists in localStorage, skip login page and go straight to app

### Remove
- Nothing removed; existing onboarding wizard remains for profile completion post-login

## Implementation Plan
1. Create `src/frontend/src/components/LoginPage.tsx` with full UI and logic
2. Update `App.tsx` to add `'login'` page state and wire CTAs
3. Session key: `finhealth_auth_session` stored as JSON `{userId, email, name, loginType, token, createdAt}`
4. Turnstile: render widget UI with site key placeholder; simulate token on click for demo
5. Google mock: generate userId from email, store session, redirect
6. Apple mock: same pattern
7. Email/password: validate format + min-6 chars, check localStorage for existing user, store hashed-style session
