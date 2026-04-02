# FinHealth AI

## Current State
Fully functional fintech SaaS landing page (LandingPageNew.tsx) with hero, problem, solution, capabilities, pricing, and footer sections. The "Check My Financial Health" button in the hero currently calls `navigate('/login')`. There is no API integration with the external backend.

Backend URL: `https://financialai-backend.onrender.com`
Known endpoint: `GET /` → returns `{"message": "FinancialAI backend is running 🚀"}`

## Requested Changes (Diff)

### Add
- `src/lib/api.ts` — API client module with `BACKEND_URL` constant and a typed `checkFinancialHealth()` function that calls `GET https://financialai-backend.onrender.com/`
- On homepage load: call `GET /` and store the response (or error) in state
- API status banner on the landing page hero — shows backend status (e.g. "FinancialAI backend is running 🚀") when loaded, loading state while fetching, error state if it fails
- "Check My Financial Health" button now calls the backend API and displays the JSON response in a modal/card below the hero instead of navigating to /login
- A dismissible response card that shows the raw JSON response from the API in a styled panel

### Modify
- `LandingPageNew.tsx`: add `useEffect` on mount to call backend, add state for `apiStatus`, `apiLoading`, `apiError`, `healthResponse`, `healthLoading`; update "Check My Financial Health" button onClick

### Remove
- Nothing — all existing UI, navigation, sections, and layout must be preserved exactly

## Implementation Plan
1. Create `src/frontend/src/lib/api.ts` with `BACKEND_URL` and `callHealthCheck()` function
2. Update `LandingPageNew.tsx`:
   - Import useState, useEffect
   - On mount: call `GET /` to get backend status, show in a subtle status pill in the hero
   - Wire "Check My Financial Health" button to call backend and display response in a result card below the hero CTAs
   - Show loading spinner on the button during API call
   - Display API response (message field + full JSON) in a styled glassmorphism card
   - Show error message if API call fails
   - Do NOT change any other UI element, navigation, or section
