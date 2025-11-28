# Database Schema Documentation

This document describes the MongoDB database schema for the Playlister application.

## Schema Approach

We use a **Hybrid Schema Design** that balances:
- **Read Performance**: Embed frequently accessed data
- **Data Consistency**: Reference related documents
- **Scalability**: Keep document sizes reasonable

This approach combines the best of both normalized and denormalized designs.

---

## Collections Overview

The database has **3 main collections**:

1. **users** - User accounts and profiles
2. **songs** - Music catalog
3. **playlists** - User-created playlists

---

## Collection Schemas

### 1. Users Collection

Stores user account information and authentication data.

```javascript
{
  _id: ObjectId("..."),
  username: String,           // Unique username
  email: String,              // Unique email (lowercase)
  passwordHash: String,       // bcrypt hashed password
  avatar: String,             // Base64 encoded image (optional)
  playlistCount: Number,      // Cached count of user's playlists
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

**Indexes:**
- `email: 1` (unique) - Fast login lookups
- `username: 1` (unique) - Fast username lookups

**Validation:**
- `username`: 3-30 characters, required, unique
- `email`: Valid email format, required, unique
- `passwordHash`: Required (never exposed in API responses)
- `playlistCount`: Default 0

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "JoelDemo",
  "email": "test@playlister.com",
  "passwordHash": "$2b$10$...",
  "avatar": "data:image/png;base64,iVBORw0KGgo...",
  "playlistCount": 2,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### 2. Songs Collection

Stores the music catalog with tracking data.

```javascript
{
  _id: ObjectId("..."),
  title: String,              // Song title
  artist: String,             // Artist name
  year: Number,               // Release year (1900 - current+1)
  youtubeId: String,          // YouTube video ID
  duration: String,           // Duration format: "MM:SS"
  
  // Tracking: Who listened to this song
  listens: [
    {
      userId: ObjectId("..."),
      username: String,       // Denormalized for display
      listenedAt: Date
    }
  ],
  listensCount: Number,       // Cached total (for sorting)
  
  // Tracking: Which playlists contain this song
  playlists: [
    {
      playlistId: ObjectId("..."),
      playlistName: String,   // Denormalized for display
      addedAt: Date
    }
  ],
  playlistCount: Number,      // Cached total (for sorting)
  
  addedBy: ObjectId("..."),   // User who added the song
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ title: 'text', artist: 'text' }` - Full-text search
- `{ artist: 1, year: 1 }` - Filter by artist and year
- `{ 'listens.userId': 1 }` - Find songs listened by user
- `{ 'playlists.playlistId': 1 }` - Find songs in playlist

**Validation:**
- `title`, `artist`, `youtubeId`, `duration`: Required
- `year`: 1900 to current year + 1
- `listensCount`, `playlistCount`: Default 0

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Fast Train",
  "artist": "Solomon Burke",
  "year": 1985,
  "youtubeId": "5OWdRXHqXh8",
  "duration": "5:43",
  "listens": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "username": "JoelDemo",
      "listenedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "listensCount": 1234567,
  "playlists": [
    {
      "playlistId": "507f1f77bcf86cd799439020",
      "playlistName": "Don't be Rude",
      "addedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "playlistCount": 123,
  "addedBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### 3. Playlists Collection

Stores user-created playlists with embedded songs.

```javascript
{
  _id: ObjectId("..."),
  name: String,               // Playlist name
  userId: ObjectId("..."),    // Owner reference
  username: String,           // Denormalized owner username
  avatar: String,             // Denormalized owner avatar (base64)
  
  // Embedded songs with essential display data
  songs: [
    {
      songId: ObjectId("..."),
      title: String,          // Denormalized
      artist: String,         // Denormalized
      year: Number,           // Denormalized
      duration: String,       // Denormalized
      addedAt: Date,
      order: Number           // Position in playlist (1, 2, 3...)
    }
  ],
  
  // Tracking: Who listened/played this playlist
  playlistListeners: [
    {
      userId: ObjectId("..."),
      username: String,       // Denormalized for display
      listenedAt: Date,
      playCount: Number       // How many times user played it
    }
  ],
  listenersCount: Number,     // Cached total (for sorting)
  
  isPublic: Boolean,          // Public vs private playlist
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1 }` - Find user's playlists
- `{ name: 'text' }` - Text search by name
- `{ 'playlistListeners.userId': 1 }` - Find playlists user listened to
- `{ isPublic: 1 }` - Filter public/private

**Validation:**
- `name`: Max 100 characters, required
- `userId`: Required
- `isPublic`: Default true
- `listenersCount`: Default 0

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Don't be Rude",
  "userId": "507f1f77bcf86cd799439011",
  "username": "JoelDemo",
  "avatar": "data:image/png;base64,iVBORw0KGgo...",
  "songs": [
    {
      "songId": "507f1f77bcf86cd799439012",
      "title": "Fast Train",
      "artist": "Solomon Burke",
      "year": 1985,
      "duration": "5:43",
      "addedAt": "2024-01-15T10:00:00.000Z",
      "order": 1
    }
  ],
  "playlistListeners": [
    {
      "userId": "507f1f77bcf86cd799439013",
      "username": "AliceMusic",
      "listenedAt": "2024-01-16T10:00:00.000Z",
      "playCount": 5
    }
  ],
  "listenersCount": 137,
  "isPublic": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

## Relationships

### User → Playlists (One-to-Many)
- **Reference**: `Playlist.userId` → `User._id`
- **Denormalized**: `Playlist.username`, `Playlist.avatar`
- **Counter**: `User.playlistCount`

### User → Songs (Many-to-Many via listens)
- **Embedded**: `Song.listens[]` contains user info
- **Counter**: `Song.listensCount`

### User → Playlists (Many-to-Many via listeners)
- **Embedded**: `Playlist.playlistListeners[]` contains user info
- **Counter**: `Playlist.listenersCount`

### Playlist → Songs (Many-to-Many)
- **Embedded in Playlist**: `Playlist.songs[]` contains song display data
- **Referenced in Song**: `Song.playlists[]` tracks which playlists contain the song
- **Counters**: `Song.playlistCount`, song array length

---

## Data Denormalization Strategy

### What We Denormalize

1. **Display Names**: `username` in playlists, songs, listeners
2. **Avatar**: User avatar in playlists
3. **Song Display Data**: title, artist, year, duration in playlists
4. **Playlist Names**: In song's playlists array
5. **Counters**: playlistCount, listensCount, listenersCount

### Why We Denormalize

✅ **Performance**: Display playlist without joining Users/Songs collections  
✅ **Read-Heavy**: Most operations are reads, not updates  
✅ **User Experience**: Faster page loads  

### Trade-offs

⚠️ **Update Complexity**: Changing song title requires updating all playlists  
⚠️ **Data Duplication**: Same song data stored in multiple playlists  
⚠️ **Consistency**: Must keep denormalized data in sync  

### Sync Strategy

When data changes, update denormalized copies:

**Example: User changes username**
```javascript
// 1. Update User collection
await User.updateOne({ _id: userId }, { username: newUsername });

// 2. Update Playlists collection
await Playlist.updateMany(
  { userId: userId },
  { username: newUsername }
);

// 3. Update Songs collection (listens array)
await Song.updateMany(
  { 'listens.userId': userId },
  { $set: { 'listens.$.username': newUsername } }
);

// 4. Update Playlists collection (listeners array)
await Playlist.updateMany(
  { 'playlistListeners.userId': userId },
  { $set: { 'playlistListeners.$.username': newUsername } }
);
```

---

## Common Query Patterns

### Get All Public Playlists with Songs
```javascript
const playlists = await Playlist.find({ isPublic: true })
  .sort({ listenersCount: -1 })
  .limit(20);
// ✅ Single query - all song data already embedded
```

### Get User's Playlists
```javascript
const playlists = await Playlist.find({ userId: userId })
  .sort({ updatedAt: -1 });
// ✅ Single query with index on userId
```

### Search Songs
```javascript
const songs = await Song.find({ 
  $text: { $search: 'Solomon Burke' } 
}).sort({ listensCount: -1 });
// ✅ Text index on title and artist
```

### Get Song with Full Details (including which playlists contain it)
```javascript
const song = await Song.findById(songId);
// ✅ Single query - playlist references embedded
// song.playlists contains all playlists with this song
```

### Add Song to Playlist
```javascript
// 1. Add to playlist's songs array
await Playlist.updateOne(
  { _id: playlistId },
  { $push: { songs: songData } }
);

// 2. Add playlist reference to song
await Song.updateOne(
  { _id: songId },
  { 
    $push: { playlists: playlistData },
    $inc: { playlistCount: 1 }
  }
);
// ⚠️ Two updates to maintain both sides
```

---

## Scalability Considerations

### Current Limits

- **Playlist Size**: ~1000 songs before document gets large (each ~100 bytes)
- **Listeners Array**: ~1000 listeners before migration needed
- **Listen History**: ~1000 listens per song before migration needed

### Migration Path (if needed)

If arrays grow too large (> 1000 items), create separate collections:

```javascript
// New collections for high-volume data
SongListens {
  songId: ObjectId,
  userId: ObjectId,
  username: String,
  listenedAt: Date
}

PlaylistListeners {
  playlistId: ObjectId,
  userId: ObjectId,
  username: String,
  listenedAt: Date,
  playCount: Number
}
```

**Trigger**: When `array.length > 1000`

---

## Backup and Maintenance

### Recommended Indexes (already created)

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

// Songs
db.songs.createIndex({ title: 'text', artist: 'text' })
db.songs.createIndex({ artist: 1, year: 1 })
db.songs.createIndex({ 'listens.userId': 1 })
db.songs.createIndex({ 'playlists.playlistId': 1 })

// Playlists
db.playlists.createIndex({ userId: 1 })
db.playlists.createIndex({ name: 'text' })
db.playlists.createIndex({ 'playlistListeners.userId': 1 })
db.playlists.createIndex({ isPublic: 1 })
```

### Regular Maintenance

```bash
# Check index usage
db.playlists.aggregate([{ $indexStats: {} }])

# Rebuild indexes if needed
db.playlists.reIndex()

# Check collection stats
db.playlists.stats()
```

---

## Summary

**Schema Type**: Hybrid (Reference + Selective Embedding)

**Collections**: 3 (Users, Songs, Playlists)

**Key Design Decisions**:
- ✅ Embed frequently accessed data (song details in playlists)
- ✅ Denormalize display fields (username, avatar)
- ✅ Use references for relationships (userId, songId)
- ✅ Cache aggregated counts (listensCount, playlistCount)
- ✅ Index all query patterns

**Best For**:
- Read-heavy applications
- Fast page loads
- Moderate write frequency
- Social features (tracking listeners, plays)

---

*Last Updated: 2024-01-15*