# FinHealth India — Version 10: Client Communication & Website Enhancement

## Current State
- Full-stack fintech app with Motoko backend + React/Tailwind/TypeScript frontend
- Dark theme (#060A10 bg, #B8FF4A accent)
- Header: logo, user principal/name badge, Save button, Sign Out button
- Footer: single-line disclaimer + caffeine.ai link
- Tab navigation: Dashboard, Analysis, Tools, Reports
- No floating chat, no sitemap, no contact page, no footer nav links
- User profile stored in backend (name, email, photoURL, riskProfile, goals, income, onboardingComplete)

## Requested Changes (Diff)

### Add
- **ClientChatBox component**: floating button (bottom-right, #B8FF4A), opens chat modal, user can type/send messages, messages stored in localStorage (keyed by userId/principal), admin-reply-ready data structure `{ id, text, sender: 'user'|'admin', timestamp }`, dark theme modal
- **Footer navigation**: About Us, Contact Us, Privacy Policy, Terms of Use links (scroll to sections or open modals)
- **Footer disclaimer**: "For educational purposes only. Not investment advice."
- **Sitemap page/section**: accessible from footer, lists all pages: Dashboard, Analysis, Tools, Reports with descriptions
- **Contact Section**: modal or page with name/email/message form, saves to localStorage under `contactMessages` array with `{ id, name, email, message, timestamp }`
- **About Us section**: brief modal/page about FinHealth India
- **Privacy Policy & Terms of Use**: modal content pages
- **Header improvement**: show user avatar (initials-based if no photo) + display name from userProfile.name

### Modify
- **Footer**: expand from single-line to multi-column footer with nav links, disclaimer, and copyright
- **Header**: add user avatar circle showing initials or photo, show name next to/replacing the principal badge

### Remove
- Nothing removed

## Implementation Plan
1. Create `ClientChatBox.tsx` — floating chat button + modal, localStorage-backed messages, future-ready admin structure
2. Create `ContactModal.tsx` — name/email/message form, saves to localStorage contactMessages
3. Create `SitemapModal.tsx` — lists all sections/pages
4. Create `AboutModal.tsx`, `PrivacyModal.tsx`, `TermsModal.tsx` — static content modals
5. Update `App.tsx` header to show user avatar (initials from name) + name display
6. Update `App.tsx` footer to multi-column layout with nav links, disclaimer
7. Integrate `ClientChatBox` at root level so it floats across all tabs
