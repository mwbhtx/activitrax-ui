# Dashboard Connection Flow Redesign

## Overview

Modernize the dashboard service connection experience using progressive disclosure and contextual prompts rather than blocking cards. Users see their real data sooner with guidance integrated into the experience.

## Dashboard States

### State 1: No Strava Connected

Show a two-step onboarding flow:

**Step 1: Connect Strava**
- Centered card (~450px max-width)
- "Step 1 of 2" indicator text
- Strava logo in subtle purple circle
- Heading + brief description
- "Connect Strava" button → OAuth flow

**Step 2: Tracklist Preference**
- Same card styling
- "Step 2 of 2" indicator
- Toggle switch: "Add tracklist to Strava activity descriptions"
- Helper text explaining the feature
- Default: enabled
- "Continue" button → proceeds to dashboard

### State 2: Strava Connected, Spotify Not Connected

Show activities table with a connection banner above:

**Spotify Banner (Expanded)**
- Full-width, subtle background (`custom.primarySubtle`)
- Layout: Spotify icon | explanatory text | "Connect Spotify" button | minimize icon
- Shown by default on first view

**Spotify Banner (Minimized)**
- Thin bar: Spotify icon | "Spotify not connected" | "Connect" link
- Shown after user clicks minimize
- State persisted in localStorage
- Click to expand back to full banner

Activities table displays normally. Rows will show "Not Connected" status for track processing until Spotify is connected.

### State 3: Both Services Connected

Activities table only. No connection UI visible. Presence of data confirms services are working.

## Component Changes

### New Components

- `OnboardingCard` - Reusable card for onboarding steps
- `SpotifyBanner` - Expandable/minimizable connection prompt

### Modified Components

- `ServiceConnectDialogue` - Refactor to handle new states and onboarding flow

### Unchanged

- Settings page (service management remains there)
- Activities table (already has per-row status indicators)
- OAuth redirect flows (`/strava_auth`, `/spotify_auth`)

## Visual Design

- Uses existing theme: dark mode, purple primary (#8B5CF6)
- Cards: Paper with `custom.border`, `borderRadius: 3`
- Buttons: Purple contained buttons for primary actions
- Banner: Subtle `custom.primarySubtle` background, not alert-style
- Step indicator: Simple text, not a heavy stepper component

## User Flow

```
New User
    │
    ▼
┌─────────────────┐
│ Step 1: Strava  │
│ [Connect]       │
└────────┬────────┘
         │ OAuth complete
         ▼
┌─────────────────┐
│ Step 2: Prefs   │
│ [Toggle] [Next] │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Banner: Connect Spotify     │
├─────────────────────────────┤
│ Activities Table            │
│ (status shows "Not          │
│  Connected" per row)        │
└─────────────────────────────┘
         │ OAuth complete
         ▼
┌─────────────────────────────┐
│ Activities Table            │
│ (fully functional)          │
└─────────────────────────────┘
```

## localStorage Keys

- `spotifyBannerMinimized`: boolean - tracks banner collapsed state
