# Liked Tracks Feature - Design Document

**Goal:** Allow users to "like" tracks from their activity tracklists, persist them in Activitrax, and view them on a dedicated page with future analytics potential.

**Status:** Design complete, ready for implementation after playlist feature is tested.

---

## Data Model

### Tracks Collection (shared metadata)
One document per unique Spotify track. Created on first like, reused across all users.

```javascript
// Collection: tracks
{
  _id: ObjectId,
  spotify_track_id: "4iV5W9uYEdYUVa79Axb7Rh",  // unique index
  spotify_uri: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
  name: "Track Name",
  artist: "Artist Name",
  album: "Album Name",
  album_image: "https://i.scdn.co/image/...",
  spotify_url: "https://open.spotify.com/track/...",
  duration_ms: 210000,
  created_at: ISODate("2026-01-12T...")
}

// Index: { spotify_track_id: 1 } unique
```

### Liked Tracks Collection (user relationships)
Lightweight documents linking users to tracks they've liked.

```javascript
// Collection: liked_tracks
{
  _id: ObjectId,
  auth0_uid: "auth0|123...",
  track_id: ObjectId("..."),  // reference to tracks collection
  liked_at: ISODate("2026-01-12T...")
}

// Index: { auth0_uid: 1, track_id: 1 } unique (prevents duplicate likes)
// Index: { auth0_uid: 1, liked_at: -1 } (for fetching user's likes sorted by date)
```

---

## Benefits of Normalized Model

1. **Storage efficient** - Track metadata stored once, no matter how many users like it
2. **Easy updates** - If we need to refresh metadata, update one document
3. **Global analytics** - Can compute "most liked tracks" across all users
4. **Future-proof** - Can add more track metadata without migration headaches

---

## API Endpoints

### POST /user/liked-tracks
Like a track (creates track doc if needed, then creates like relationship)

**Request:**
```json
{
  "track": {
    "spotify_track_id": "4iV5W9uYEdYUVa79Axb7Rh",
    "spotify_uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
    "name": "Track Name",
    "artist": "Artist Name",
    "album": "Album Name",
    "album_image": "https://...",
    "spotify_url": "https://open.spotify.com/track/...",
    "duration_ms": 210000
  }
}
```

**Response:** `{ "liked": true }`

### DELETE /user/liked-tracks/:spotify_track_id
Unlike a track (removes like relationship, keeps track doc for other users)

**Response:** `{ "liked": false }`

### GET /user/liked-tracks
Get user's liked tracks with full metadata (uses $lookup aggregation)

**Response:**
```json
{
  "tracks": [
    {
      "spotify_track_id": "4iV5W9uYEdYUVa79Axb7Rh",
      "name": "Track Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "album_image": "https://...",
      "spotify_url": "https://open.spotify.com/track/...",
      "liked_at": "2026-01-12T..."
    }
  ]
}
```

### GET /user/liked-tracks/ids
Get just the spotify_track_ids the user has liked (for checking like state on dashboard)

**Response:**
```json
{
  "liked_track_ids": ["4iV5W9uYEdYUVa79Axb7Rh", "7ouMYWpwJ422jRcDASAM9z"]
}
```

---

## UI Components

### LikeButton Component
- Heart icon (outlined when not liked, filled when liked)
- Placed before AddToPlaylistButton: ❤️ 📋 🔗
- Optimistic UI update (fill heart immediately, revert on error)
- No loading state needed (fast operation)

### Liked Tracks Page (/liked-tracks)
- Grid or list of liked tracks with album art
- Sort by: Recently liked, Artist, Album
- Search/filter
- Play preview button
- Link to Spotify
- Unlike button

---

## Dashboard Integration

On dashboard load:
1. Fetch user's liked track IDs via `GET /user/liked-tracks/ids`
2. Store in state/context
3. Pass to TrackItem components
4. Heart shows filled/outlined based on whether track ID is in the set

When user likes via heart button:
1. Optimistically update local state
2. POST to /user/liked-tracks
3. On error, revert state

When user adds track to Spotify playlist:
1. Also auto-like the track (POST to /user/liked-tracks)
2. Heart fills automatically

---

## Future Analytics Potential

With this data model, we can later add:
- "You ran 15 activities while listening to this track"
- "Your fastest pace with this track: 7:30/mi"
- "Most played tracks during workouts"
- "Tracks you discovered via Activitrax"

These would join liked_tracks → tracks → tracklists → activities.

---

## Implementation Tasks (estimate)

1. Create MongoDB collections and indexes
2. Create track.repository.js with upsert logic
3. Create liked_tracks.repository.js
4. Add API endpoints to user.router.js
5. Create LikeButton component
6. Integrate LikeButton into dashboard TrackItem
7. Fetch liked IDs on dashboard load
8. Auto-like on playlist add
9. Create Liked Tracks page
10. Add navigation to Liked Tracks page
