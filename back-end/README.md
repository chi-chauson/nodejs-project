# Playlister Backend API

Express.js REST API for the Playlister application with MongoDB and JWT authentication.

## Features

- 🔐 JWT-based authentication
- 📊 MongoDB with Mongoose ODM
- 🎵 Full CRUD operations for playlists and songs
- 👥 User management and profiles
- 🔒 Protected routes with middleware
- ✅ Input validation
- 🌐 CORS enabled for frontend

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation

## Prerequisites

- Node.js 16+ installed
- MongoDB 8.2 running locally
- Frontend application (optional, for testing)

## Installation

```bash
# Navigate to backend directory
cd back-end

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
```

## Environment Variables

Create a `.env` file in the `back-end` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/playlister
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## Seeding the Database

```bash
npm run seed
```

## Cleaning the Database

```bash
npm run seed:clean
```

This will populate MongoDB with test data (users, songs, playlists).

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "avatar": "data:image/png;base64,..." // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "avatar": "...",
    "playlistCount": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### POST `/api/auth/login`
Login with existing account.

**Request:**
```json
{
  "email": "test@playlister.com",
  "password": "test123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Users

#### GET `/api/users/me`
Get current user profile (requires auth).

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT `/api/users/me`
Update current user profile (requires auth).

**Request:**
```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "password": "newpassword",
  "avatar": "data:image/png;base64,..."
}
```

#### GET `/api/users/:id`
Get user by ID (public profile).

### Playlists

#### GET `/api/playlists`
Get all playlists with optional filters.

**Query Parameters:**
- `playlistName` - Filter by playlist name
- `userName` - Filter by username
- `songTitle` - Filter by song title
- `songArtist` - Filter by artist
- `songYear` - Filter by year
- `sortBy` - Sort order: `listeners-hi-lo`, `listeners-lo-hi`, `name-a-z`, `name-z-a`

#### GET `/api/playlists/:id`
Get specific playlist by ID.

#### POST `/api/playlists`
Create new playlist (requires auth).

**Request:**
```json
{
  "name": "My Awesome Playlist",
  "isPublic": true
}
```

#### PUT `/api/playlists/:id`
Update playlist (requires auth, owner only).

**Request:**
```json
{
  "name": "Updated Playlist Name",
  "isPublic": false
}
```

#### DELETE `/api/playlists/:id`
Delete playlist (requires auth, owner only).

#### POST `/api/playlists/:id/songs`
Add song to playlist (requires auth, owner only).

**Request:**
```json
{
  "songId": "507f1f77bcf86cd799439011"
}
```

#### DELETE `/api/playlists/:id/songs/:songId`
Remove song from playlist (requires auth, owner only).

#### POST `/api/playlists/:id/play`
Record a playlist play (requires auth).

### Songs

#### GET `/api/songs`
Get all songs with optional filters.

**Query Parameters:**
- `title` - Filter by song title
- `artist` - Filter by artist
- `year` - Filter by year
- `sortBy` - Sort order: `listens-hi-lo`, `listens-lo-hi`, `title-a-z`, `title-z-a`

#### GET `/api/songs/:id`
Get specific song by ID.

#### POST `/api/songs`
Add new song to catalog (requires auth).

**Request:**
```json
{
  "title": "Fast Train",
  "artist": "Solomon Burke",
  "year": 1985,
  "youtubeId": "5OWdRXHqXh8",
  "duration": "5:43"
}
```

#### PUT `/api/songs/:id`
Update song (requires auth, creator only).

#### DELETE `/api/songs/:id`
Remove song from catalog (requires auth, creator only).

#### POST `/api/songs/:id/listen`
Record a song listen (requires auth).

### Health Check

#### GET `/api/health`
Check API status.

**Response:**
```json
{
  "status": "OK",
  "message": "Playlister API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to Use

1. **Register or Login** to get a token
2. **Include token** in `Authorization` header for protected routes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Protected Routes

Routes requiring authentication:
- All `/api/users/me` endpoints
- POST `/api/playlists`
- PUT/DELETE `/api/playlists/:id`
- POST `/api/playlists/:id/songs`
- POST `/api/songs`
- PUT/DELETE `/api/songs/:id`

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "message": "Error description here"
  }
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (valid token but not authorized)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

### User
```javascript
{
  username: String,
  email: String,
  passwordHash: String,
  avatar: String, // base64
  playlistCount: Number
}
```

### Song
```javascript
{
  title: String,
  artist: String,
  year: Number,
  youtubeId: String,
  duration: String,
  listens: [{ userId, username, listenedAt }],
  listensCount: Number,
  playlists: [{ playlistId, playlistName, addedAt }],
  playlistCount: Number,
  addedBy: ObjectId
}
```

### Playlist
```javascript
{
  name: String,
  userId: ObjectId,
  username: String,
  avatar: String,
  songs: [{ songId, title, artist, year, duration, order }],
  listeners: [{ userId, username, listenedAt, playCount }],
  listenersCount: Number,
  isPublic: Boolean
}
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@playlister.com","password":"test123"}'
```

### Get Playlists
```bash
curl http://localhost:5000/api/playlists
```

### Create Playlist (with auth)
```bash
curl -X POST http://localhost:5000/api/playlists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"My Playlist","isPublic":true}'
```

## Development Tips

### View Logs
```bash
# Server logs show in terminal
npm run dev
```

### Check MongoDB
```bash
# Using MongoDB Compass (GUI)
# Connect to: mongodb://localhost:27017

# Using mongosh (CLI)
mongosh
use playlister
db.users.find().pretty()
db.songs.find().pretty()
db.playlists.find().pretty()
```

### Reset Database
```bash
# Re-run seed script
npm run seed
```

## Next Steps

1. ✅ Backend API is ready
2. 🔄 Connect frontend to backend (replace sessionStorage with API calls)
3. 🎨 Add more features (favorites, comments, etc.)
4. 🚀 Deploy to production

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod` or check if running as service
- Check `MONGODB_URI` in `.env`

### "Token expired"
- Login again to get a new token
- Adjust `JWT_EXPIRES_IN` in `.env`

### "Port already in use"
- Change `PORT` in `.env`
- Or kill process using port 5000

### "Validation error"
- Check request body matches expected format
- Ensure all required fields are provided

---

**Backend is ready! Start the server and test the endpoints.**