# Dashboard Empty State Design

## Overview

Add an encouraging empty state to the dashboard when users have connected their services but haven't recorded any activities yet. The design follows the simple, centered pattern used in the Liked Tracks page but expands with motivational content to encourage users to create their first activity.

## Problem

New users who complete the onboarding flow (connect Strava and Spotify) are left staring at an empty activities table with only the text "No activities yet. Complete a Strava activity while listening to Spotify to see it here!" This provides minimal guidance and doesn't leverage the near real-time sync to build excitement.

## Solution

Replace the minimal empty table message with a centered empty state component that:
- Encourages users to go create their first activity
- Sets clear expectations about sync timing
- Provides helpful tips for success
- Uses visual elements to create interest and energy

## Design Specification

### Visual Hierarchy

**Container:**
- Centered box with vertical padding (`py: 8`)
- Max width: 600px
- Text alignment: center

**Elements (top to bottom):**

1. **Visual Icon Group**
   - Stacked/grouped icons representing the core value: DirectionsRun + MusicNote
   - Color: Purple gradient or `primary.light`
   - Size: 56-64px
   - Spacing below: `mb: 3`

2. **Headline**
   - Text: "Ready to discover your workout soundtrack?"
   - Typography: `variant="h5"`, `fontWeight: 600`
   - Color: `text.primary`
   - Spacing below: `mb: 2`

3. **Body Copy**
   - Line 1: "Go for a run or ride with Spotify playing, and your tracklist will appear here automatically."
   - Line 2: "You'll see what songs powered every mile, when they played, and be able to relive your workout soundtrack."
   - Typography: `variant="body1"`, `color="text.secondary"`
   - Line height: 1.6 for readability
   - Spacing below: `mb: 3`

4. **Tip Card** (optional, subtle)
   - Small outlined box with tip icon
   - Background: `custom.primarySubtle` or very subtle
   - Border: `1px solid`, `borderColor: 'custom.border'`
   - Border radius: 2
   - Padding: `px: 2`, `py: 1.5`
   - Content: Icon (LightbulbOutlined) + "Tip: Start Spotify before you begin your Strava activity for the best results"
   - Typography: `variant="body2"`
   - Spacing below: `mb: 3`

5. **Status Indicator**
   - CheckCircle icon + text: "Connected and ready • Activities sync within minutes"
   - Typography: `variant="caption"`
   - Color: `success.main`
   - Flexbox layout with gap

### Component Structure

```jsx
const EmptyActivitiesState = () => {
  return (
    <Box sx={{
      textAlign: 'center',
      py: 8,
      maxWidth: 600,
      mx: 'auto'
    }}>
      {/* Icon group */}
      {/* Headline */}
      {/* Body copy */}
      {/* Tip card */}
      {/* Status indicator */}
    </Box>
  );
};
```

### Integration Point

**File:** `src/routes/dashboard.js`

**Location:** Lines 556-563 in the ActivitiesTable component

**Current code:**
```jsx
{sortedActivities.length > 0 ? (
  // ...activity rows
) : (
  <TableRow>
    <TableCell colSpan={8} align="center">
      <Typography variant="body2" sx={{ py: 2 }}>
        No activities yet. Complete a Strava activity while listening to Spotify to see it here!
      </Typography>
    </TableCell>
  </TableRow>
)}
```

**Change to:**
```jsx
{sortedActivities.length > 0 ? (
  // ...activity rows
) : (
  <TableRow>
    <TableCell colSpan={8} sx={{ p: 0, border: 'none' }}>
      <EmptyActivitiesState />
    </TableCell>
  </TableRow>
)}
```

## Visual Design Notes

- Follows existing theme: dark mode, purple primary (#8B5CF6)
- Matches Liked Tracks empty state pattern (simple, centered, unobtrusive)
- No heavy illustrations or graphics - keeps it lightweight
- Uses existing MUI icons
- Subtle tip card doesn't overwhelm the main message

## User Experience Goals

1. **Motivation:** Encourage users to go create their first activity immediately
2. **Clarity:** Set expectations about what will happen and when (near real-time sync)
3. **Confidence:** Reassure them the system is working and ready
4. **Success:** Provide a helpful tip to maximize their first experience

## Implementation Notes

- Component should be defined in the same file as ActivitiesTable for simplicity
- No state management needed (purely presentational)
- Uses only existing MUI components and theme values
- No new dependencies required
