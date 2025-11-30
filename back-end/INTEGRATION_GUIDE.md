# Frontend-Backend Integration Guide

This guide explains how the frontend connects to the backend API. The integration is **complete and functional** - this document serves as reference for understanding the implementation.

## Setup

### 1. Create Environment File

In `front-end/` directory, create `.env`:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Start Backend Server

```bash
cd back-end
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Start Frontend Server

```bash
cd front-end
npm run dev
```

Frontend runs on: `http://localhost:5173`

## How It Works

### API Service Layer

All API calls are centralized in `front-end/src/services/api.js`:

```javascript
import { authAPI, playlistAPI, songAPI, userAPI } from './services/api';
```

### Authentication Flow

1. **Login**:
   ```javascript
   const data = await authAPI.login({ email, password });
   // Token stored in localStorage
   // User data stored in localStorage
   ```

2. **Auto-attach Token**:
   ```javascript
   // All authenticated requests automatically include:
   // Authorization: Bearer <token>
   ```

3. **Logout**:
   ```javascript
   authAPI.logout();
   // Clears localStorage
   ```

### Example Usage

#### Login (SignInForm.jsx)
```javascript
import { authAPI } from '../../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await authAPI.login({ email, password });
    navigate('/playlists');
  } catch (err) {
    setError(err.message);
  }
};
```

#### Fetch Playlists (PlaylistsPage.jsx)
```javascript
import { playlistAPI } from '../../services/api';

useEffect(() => {
  const fetchPlaylists = async () => {
    try {
      const data = await playlistAPI.getAll({ sortBy: 'listeners-hi-lo' });
      setPlaylists(data.playlists);
    } catch (err) {
      setError(err.message);
    }
  };
  fetchPlaylists();
}, [sortBy]);
```

## Integration Architecture

### API Service Layer (`front-end/src/services/api.js`)

The centralized API service provides:
- **Base URL Configuration**: Reads from `VITE_API_URL` environment variable
- **Authentication Helper**: Auto-attaches JWT token to requests
- **Error Handling**: Consistent error parsing and user-friendly messages
- **API Collections**: Organized by domain (auth, user, playlist, song)

### Key Files

**Backend:**
- `back-end/src/server.js` - CORS configuration for frontend origin
- `back-end/src/middleware/auth.js` - JWT verification and optional auth
- `back-end/src/routes/*` - All API endpoints

**Frontend:**
- `front-end/src/services/api.js` - Complete API service layer
- `front-end/.env` - API URL configuration
- All components updated to use API instead of mock data

### Components Using API

**Authentication:**
- `SignInForm.jsx` - `authAPI.login()`
- `CreateAccountForm.jsx` - `authAPI.register()`
- `EditAccountForm.jsx` - `userAPI.updateMe()`
- `HomePage.jsx` - `authAPI.logout()`
- `UserDropdown.jsx` - `authAPI.logout()`

**Playlists:**
- `PlaylistsPage.jsx` - `playlistAPI.getAll()`, `playlistAPI.create()`, `playlistAPI.delete()`
- `EditPlaylistModal.jsx` - `playlistAPI.update()`, `playlistAPI.addSong()`, `playlistAPI.removeSong()`
- `PlayPlaylistModal.jsx` - `playlistAPI.recordPlay()`

**Songs:**
- `SongCatalogPage.jsx` - `songAPI.getAll()`, `songAPI.create()`
- `EditSongModal.jsx` - `songAPI.update()`, `songAPI.delete()`
- `YouTubePlayer.jsx` - `songAPI.recordListen()`

## API Methods Available

### Authentication
```javascript
authAPI.register({ username, email, password, avatar })
authAPI.login({ email, password })
authAPI.logout()
authAPI.getCurrentUser()
authAPI.isAuthenticated()
```

### Users
```javascript
userAPI.getMe()
userAPI.updateMe({ username, email, password, avatar })
userAPI.getById(userId)
```

### Playlists
```javascript
playlistAPI.getAll(filters)
playlistAPI.getById(playlistId)
playlistAPI.create({ name, isPublic })
playlistAPI.update(playlistId, updates)
playlistAPI.delete(playlistId)
playlistAPI.addSong(playlistId, songId)
playlistAPI.removeSong(playlistId, songId)
playlistAPI.recordPlay(playlistId)
```

### Songs
```javascript
songAPI.getAll(filters)
songAPI.getById(songId)
songAPI.create({ title, artist, year, youtubeId, duration })
songAPI.update(songId, updates)
songAPI.delete(songId)
songAPI.recordListen(songId)
```

## Error Handling

All API methods throw errors that can be caught:

```javascript
try {
  const data = await playlistAPI.getAll();
  setPlaylists(data.playlists);
} catch (err) {
  setError(err.message);
  console.error('API Error:', err);
}
```

## Testing

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### 2. Test Login
Open browser console and try:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@playlister.com',
    password: 'test123'
  })
}).then(r => r.json()).then(console.log)
```

### 3. Use the App
1. Go to `http://localhost:5173`
2. Click "Login"
3. Use credentials: `test@playlister.com` / `test123`
4. You should see real playlists from MongoDB!

## Current Status

### ✅ Fully Implemented Features

**Authentication & Users:**
- User registration with validation
- Login/logout with JWT tokens
- Profile updates (username, email, password, avatar)
- Token persistence in localStorage
- Guest mode for unauthenticated browsing

**Playlist Management:**
- Browse all playlists with filters and sorting
- Create new playlists (public/private)
- Edit playlist details
- Delete playlists with confirmation
- Add/remove songs from playlists
- Copy existing playlists
- Play playlists with YouTube integration
- Track play counts

**Song Catalog:**
- Browse all songs with filters and sorting
- Add new songs to catalog
- Edit song details
- Delete songs from catalog
- Track listen counts
- YouTube player integration

**User Experience:**
- Toast notifications for all actions
- Loading states during API calls
- Error handling with user-friendly messages
- Responsive design
- Real-time data updates

### 🎯 Possible Enhancements

1. **Advanced Features:**
   - Playlist collaboration (multiple owners)
   - Song/playlist favorites
   - User profiles and social features
   - Playlist comments and descriptions

2. **Performance:**
   - Implement pagination for large lists
   - Add infinite scroll
   - Optimize image loading
   - Cache frequently accessed data

3. **User Experience:**
   - Drag-and-drop for song reordering (UI exists, needs backend integration)
   - Keyboard shortcuts
   - Dark mode toggle
   - Mobile app version

4. **Deployment:**
   - Deploy backend to Vercel/Heroku
   - Deploy frontend to Vercel/Netlify
   - Use MongoDB Atlas for production database
   - Set up CI/CD pipeline

## Troubleshooting

### CORS Error
If you see CORS errors in console:
- Make sure backend `.env` has: `FRONTEND_URL=http://localhost:5173`
- Backend should show: `🌐 CORS enabled for: http://localhost:5173`

### 401 Unauthorized
- Token might be expired
- Try logging in again
- Check localStorage for `authToken`

### Network Error
- Make sure backend is running on port 5000
- Check backend logs for errors
- Verify `.env` has correct `VITE_API_URL`

### Empty Playlists
- Make sure you seeded the database: `npm run seed`
- Check MongoDB has data: `mongosh` → `use playlister` → `db.playlists.find()`

## localStorage vs sessionStorage

The app uses **localStorage** for persistent authentication:

```javascript
// Stored on login
localStorage.setItem('authToken', token)
localStorage.setItem('currentUser', JSON.stringify(user))

// Retrieved on app load
const token = localStorage.getItem('authToken')
const user = JSON.parse(localStorage.getItem('currentUser'))

// Cleared on logout
localStorage.removeItem('authToken')
localStorage.removeItem('currentUser')
```

**Benefits:**
- Users stay logged in after closing browser
- Better user experience (no repeated logins)
- JWT tokens expire after 7 days (configurable in backend `.env`)

## Security Considerations

**Current Implementation:**
- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens with expiration
- ✅ Input validation on all endpoints
- ✅ CORS restricted to frontend origin
- ✅ MongoDB injection prevention via Mongoose
- ✅ Authorization checks (owner-only operations)

**Production Recommendations:**
- Use HTTPS for all requests
- Store JWT in httpOnly cookies (more secure than localStorage)
- Implement rate limiting
- Add CSRF protection
- Use environment-specific JWT secrets
- Enable MongoDB authentication
- Implement refresh tokens for better security

## Request/Response Flow Example

### Creating a Playlist

**1. User Action (Frontend):**
```javascript
// PlaylistsPage.jsx
const handleCreatePlaylist = async (name) => {
  try {
    const newPlaylist = await playlistAPI.create({ name, isPublic: true });
    setPlaylists([...playlists, newPlaylist]);
    toast.success('Playlist created!');
  } catch (err) {
    toast.error(err.message);
  }
};
```

**2. API Call (Service Layer):**
```javascript
// services/api.js
create: async ({ name, isPublic }) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, isPublic })
  });
  return response;
}
```

**3. Backend Processing (Express Route):**
```javascript
// routes/playlists.js
router.post('/', authenticateToken, async (req, res) => {
  // Validate input
  // Create playlist in MongoDB
  // Return created playlist
});
```

**4. Database Operation (Mongoose Model):**
```javascript
const playlist = new Playlist({
  name,
  userId: req.user.id,
  username: req.user.username,
  avatar: req.user.avatar,
  isPublic,
  songs: [],
  playlistListeners: [],
  listenersCount: 0
});
await playlist.save();
```

**5. Response Flow:**
```
Database → Mongoose Model → Express Route → API Response →
Service Layer → Component State → UI Update
```

## Testing the Integration

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Logout
- [ ] Access protected route without token (should fail)
- [ ] Browse as guest

**Playlists:**
- [ ] View all playlists
- [ ] Create new playlist
- [ ] Edit playlist name
- [ ] Delete playlist (with confirmation)
- [ ] Add song to playlist
- [ ] Remove song from playlist
- [ ] Copy playlist
- [ ] Play playlist (YouTube player)
- [ ] Filter playlists by various criteria
- [ ] Sort playlists by different options

**Songs:**
- [ ] View all songs
- [ ] Add new song to catalog
- [ ] Edit song details
- [ ] Delete song (with confirmation)
- [ ] Add song to playlist from catalog
- [ ] Filter songs by various criteria
- [ ] Sort songs by different options

**User Profile:**
- [ ] View profile
- [ ] Update username
- [ ] Update email
- [ ] Update password
- [ ] Update avatar

### Automated Testing (Future)

Consider implementing:
- **Backend**: Jest + Supertest for API endpoint testing
- **Frontend**: React Testing Library for component testing
- **E2E**: Playwright or Cypress for full user flows
- **Integration**: Test frontend + backend together

---

## Summary

✅ **Integration Complete**: Frontend and backend are fully connected and functional.

**What Works:**
- Full authentication flow with JWT
- All CRUD operations for playlists and songs
- User profile management
- Search, filter, and sort functionality
- YouTube player integration
- Guest mode support
- Toast notifications
- Error handling

**Technology Stack:**
- Frontend: React 19.2 + Vite 7.2 + React Router 7.9
- Backend: Express 4.18 + MongoDB 8.2 + Mongoose 8.0
- Auth: JWT + bcrypt
- API: RESTful with JSON responses

**Data Flow:**
```
User Action → Component → API Service → Backend Route →
Database → Response → State Update → UI Render
```

---

**The Playlister is now a fully functional full-stack application! 🎉**