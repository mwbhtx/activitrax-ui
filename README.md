# Activitrax

**[activitrax.app](https://activitrax.app/)**

Activitrax connects your Strava workouts with your Spotify listening history. When you finish a run, ride, or workout, it automatically matches the activity with the songs you were listening to — so you can relive the soundtrack to every workout.

## How It Works

1. Connect your Strava and Spotify accounts via OAuth
2. Complete a workout with Spotify playing
3. Activitrax automatically detects the new activity via Strava webhooks and fetches your Spotify listening history for that time window
4. View your activity tracklist, preview tracks, save favorites, and optionally write the tracklist back to your Strava activity description

## Tech Stack

**Frontend (this repo)**
- React 18 with React Router
- Material UI 5
- Auth0 (authentication)
- Axios (API client)
- Deployed on Netlify

**[Backend](https://github.com/mwbhtx/activitrax-api)**
- Node.js / Express
- MongoDB (Atlas)
- Strava & Spotify OAuth + API integrations
- Strava webhook listener for real-time activity sync
- Auth0 M2M tokens for secure service-to-service calls
- Deployed on Heroku

## Features

- OAuth flows for Strava and Spotify with token refresh and automatic disconnect detection
- Real-time activity sync via Strava webhooks
- Per-activity tracklist with album art, Spotify links, and 30-second audio previews
- Mini player with play/pause and progress tracking
- Liked tracks system synced with Spotify
- Responsive design with mobile-specific layouts
- User feedback system with topic threading

<details>
<summary><strong>Local Development</strong></summary>

```bash
# Requires Node 22
nvm use

# Install dependencies
npm i

# Set up environment variables (see .env.example)
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

See [`.env.example`](.env.example) for the full list. You'll need:
- Auth0 domain, client ID, audience, and redirect URI
- Strava and Spotify OAuth client IDs and redirect URIs
- API URL pointing to the backend

### Related

- [activitrax-api](https://github.com/mwbhtx/activitrax-api) — Backend API

</details>
