# FinHealth India

## Current State
App has a multi-page layout managed by `currentPage` state in App.tsx. `MyAccountPage` is a full-screen fixed overlay (`fixed inset-0 z-50`) when `showMyAccount === true`. GlobalNav links (Home, Dashboard, Tools, etc.) change `currentPage` but do NOT close the MyAccountPage overlay — users get stuck because the overlay stays open.

## Requested Changes (Diff)

### Add
- `onCloseMyAccount?: () => void` prop to GlobalNav; call it in every nav link action and search navigate so clicking any nav item dismisses the MyAccount overlay

### Modify
- App.tsx: pass `onCloseMyAccount={() => setShowMyAccount(false)}` to GlobalNav
- MyAccountPage empty state: title "Profile not set up yet", button "Complete Profile"
- Back button in MyAccountPage always visible and always calls onClose

### Remove
- No global profile-blocking logic exists to remove (app already renders normally)

## Implementation Plan
1. Add `onCloseMyAccount?` to GlobalNav interface and call it in all navLinks actions + handleSearchNavigate
2. Pass the prop from App.tsx
3. Update MyAccountPage empty state copy
