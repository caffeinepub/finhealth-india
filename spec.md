# FinHealth AI — Full Platform Upgrade

## Current State

The app uses a **custom state machine for routing** (`page` state in App.tsx with values: `landing | login | signup | app`) — no React Router, no URL updates, browser Back/Forward broken. A secondary state machine inside `AppLayout.tsx` handles sidebar pages. `GlobalNav.tsx` is an orphaned component never mounted anywhere, using a different type system.

**Critical broken items identified:**
- All 10 footer links are `<button>` with zero `onClick` handlers (completely dead)
- Profile icon in AppLayout has no `onClick`
- Bell/notifications button has no `onClick`
- Terms/Privacy links in login are `<span>` with no handler
- Dashboard shows hardcoded data (score: 72, net worth: ₹4.25L) instead of reading from localStorage
- No `/profile` page exists
- No `/disclaimer`, `/privacy-policy`, `/terms` pages with proper routing
- Multi-step signup doesn't exist (single-step login form with tab toggle)
- No centralized router — URL never changes

## Requested Changes (Diff)

### Add
- React Router v6 (`BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`) replacing state machine
- Routes: `/`, `/login`, `/signup`, `/dashboard`, `/tools`, `/profile`, `/disclaimer`, `/privacy-policy`, `/terms`, `/about`, `/contact`, `/financial-health`, `/investments`, `/insurance`, `/planning`, `/loans`, `/tax`, `/ai`
- `/profile` page with 4 sections: Personal Info, Financial Info, KYC, Account Settings
- Profile dropdown in top bar with Name, Plan, Go to Profile, Logout
- Multi-step signup (4 steps): Basic → Financial → Goals → KYC
- `useAuth` hook/context for persistent login state from localStorage
- `ProtectedRoute` wrapper that redirects to `/login` if not authenticated
- Legal pages: `/disclaimer`, `/privacy-policy`, `/terms` with full content
- `/about` and `/contact` pages with basic content
- Fully functional footer with Link components to all routes
- Loading spinner on navigation transitions
- Auth persistence: read from `finhealth_logged_in` on mount, stay logged in on refresh

### Modify
- `App.tsx`: Replace state machine with `<BrowserRouter>` + `<Routes>` + `<Route>` declarations
- `AppLayout.tsx`: Replace `activePage` state machine with `<Outlet>` or nested routes; wire profile button onClick to profile dropdown
- `LandingPageNew.tsx`: Replace all dead `<button>` footer elements with `<Link>` components; fix all CTA buttons to use `<Link to="/signup">` etc.
- `LoginPageNew.tsx`: Fix Terms/Privacy links; wire to router `navigate()`
- `DashboardNew.tsx`: Read user data from `localStorage.getItem('finhealth_user_' + userId)` and render dynamic values
- Sidebar nav items: Use `<Link>` to proper routes

### Remove
- `GlobalNav.tsx` orphaned component (or repurpose)
- All `setPage()` / `navigate("app")` state machine calls
- All `href="#"` placeholder anchors
- All dead button elements with no handlers

## Implementation Plan

1. Install/confirm `react-router-dom` is available (it should already be in deps)
2. Rewrite `App.tsx` with full React Router setup — all routes defined centrally
3. Create `src/hooks/useAuth.ts` — reads/writes localStorage session, exposes `user`, `login()`, `logout()`
4. Create `ProtectedRoute` component — wraps authenticated routes
5. Rewrite `AppLayout.tsx` — use `<Outlet>` for inner routes, wire profile button to dropdown
6. Create `ProfilePage.tsx` — 4-section profile with Personal, Financial, KYC, Account Settings
7. Create `SignupPage.tsx` — 4-step multi-step form storing full user object to localStorage
8. Create legal pages: `DisclaimerPage.tsx`, `PrivacyPolicyPage.tsx`, `TermsPage.tsx`
9. Create simple pages: `AboutPage.tsx`, `ContactPage.tsx`
10. Fix `LandingPageNew.tsx` footer — replace dead buttons with `<Link>` components
11. Fix `DashboardNew.tsx` — read from localStorage user data dynamically
12. Fix all CTA buttons site-wide to use proper routing
13. Validate — typecheck + build
