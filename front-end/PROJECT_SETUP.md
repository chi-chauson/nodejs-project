# Frontend Setup Guide

This guide explains the Playlister frontend architecture, setup, and development workflow.

## Project Overview

The frontend is a React single-page application (SPA) built with Vite. It provides a complete UI for playlist management **fully integrated** with the Express + MongoDB backend API.

## Directory Structure

```
front-end/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components (Button, Input, Modal, etc.)
│   │   ├── auth/            # Authentication pages and forms
│   │   ├── home/            # Landing page
│   │   ├── playlists/       # Playlist management components
│   │   └── songs/           # Song catalog components
│   ├── App.jsx              # Main app with React Router
│   ├── App.css              # Global styles
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed
- Basic knowledge of React and JavaScript

### Installation

```bash
# Navigate to frontend directory
cd front-end

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the app at `http://localhost:5173`

## Component Architecture

### Design Principles

1. **Component Co-location**: Each component has its own CSS file in the same directory
2. **Reusability**: Common components (Button, Input, Modal) are shared across features
3. **Single Responsibility**: Each component has one clear purpose
4. **Props Over State**: Pass data down, lift state up

### Component Hierarchy

```
App
├── Router
    ├── HomePage
    ├── SignInForm / CreateAccountForm / EditAccountForm
    ├── PlaylistsPage
    │   ├── Navbar
    │   ├── PlaylistSearchSidebar
    │   ├── PlaylistList
    │   │   └── PlaylistCard (multiple)
    │   ├── PlayPlaylistModal
    │   ├── EditPlaylistModal
    │   └── ConfirmationModal
    └── SongCatalogPage
        ├── Navbar
        ├── SongSearchSidebar
        │   └── YouTubePlayer
        ├── SongList
        │   └── SongCard (multiple)
        │       └── SongKebabMenu
        ├── EditSongModal
        └── ConfirmationModal
```

## Key Features

### 1. Routing (React Router)

Routes defined in `App.jsx`:
- `/` - Landing page
- `/signin` - Login
- `/create-account` - Registration
- `/edit-account` - Edit profile
- `/playlists` - Playlist management
- `/songs` - Song catalog

### 2. Authentication Flow

**Implemented** with full backend integration:
- JWT tokens stored in `localStorage`
- Guest mode vs Logged-in mode
- API calls for login/logout/register via `services/api.js`
- Token automatically attached to authenticated requests
- Test accounts: `test@playlister.com`, `alice@playlister.com`, `bob@playlister.com` (all with password `test123`)

### 3. State Management

**Implemented**:
- `useState` for local component state
- `useEffect` for data fetching from backend API
- `ToastContext` for global toast notifications
- Props for parent-child communication
- `localStorage` for JWT token persistence
- API service layer (`services/api.js`) for all HTTP requests

### 4. Styling Strategy

- **Component-specific CSS**: Each component has its own `.css` file
- **Global styles**: `App.css` for resets and shared styles
- **Naming convention**: BEM-inspired (e.g., `.playlist-card`, `.playlist-card-header`)
- **Responsive**: Media queries for mobile/tablet/desktop

## Common Components Guide

### Button Component

```jsx
import Button from './components/common/Button';

<Button 
  variant="primary"    // primary, secondary, delete, edit, copy, play
  size="medium"        // small, medium, large
  onClick={handleClick}
  icon={}      // optional icon
>
  Button Text

```

### Input Component

```jsx
import Input from './components/common/Input';

<Input
  type="text"
  placeholder="Search..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onClear={() => setValue('')}
  showClear={true}
/>
```

### Modal Component

```jsx
import Modal from './components/common/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  headerColor="green"
  backgroundColor="green"
>
  Modal content here

```

## Data Flow

### Current Implementation (Backend Integrated)
```
User Action → Component → API Service → Backend Route →
MongoDB → Response → Update State → UI Display + Toast Notification
```

### Example Flow: Creating a Playlist
1. User clicks "New Playlist" button
2. Component calls `playlistAPI.create({ name, isPublic })`
3. API service sends `POST /api/playlists` with JWT token
4. Backend validates, creates playlist in MongoDB
5. Backend responds with created playlist
6. Component updates state with new playlist
7. Toast notification shows success
8. UI re-renders with updated playlist list

## Adding New Features

### Example: Adding a "Favorites" Feature

1. **Create Components**
   ```
   src/components/favorites/
   ├── FavoritesPage.jsx
   ├── FavoritesPage.css
   ├── FavoritesList.jsx
   └── FavoritesList.css
   ```

2. **Add Route**
   ```jsx
   // In App.jsx
   <Route path="/favorites" element={<FavoritesPage />} />
   ```

3. **Update Navigation**
   ```jsx
   // In Navbar.jsx
   <button onClick={() => navigate('/favorites')}>
     Favorites
   </button>
   ```

4. **State Management**
   - Add state in component or use Context
   - Store data in sessionStorage temporarily
   - Plan API integration for backend

## Performance Optimization

### Current Optimizations
- Vite's fast HMR (Hot Module Replacement)
- Component lazy loading ready (not implemented yet)
- CSS is scoped per component

### Future Optimizations
- React.lazy() and Suspense for code splitting
- Memoization with useMemo and useCallback
- Virtual scrolling for large lists
- Image optimization

## Testing Strategy (Future)

Recommended testing setup:
- **Unit tests**: Jest + React Testing Library
- **Component tests**: Test user interactions
- **E2E tests**: Playwright or Cypress
- **API tests**: Mock API responses

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop with hot reload**
   ```bash
   npm run dev
   ```

3. **Test in browser**
   - Use React DevTools
   - Check responsive design
   - Test all user flows

4. **Build for production**
   ```bash
   npm run build
   npm run preview  # Test production build
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

## Backend Integration

### ✅ Implemented Features

The frontend is **fully integrated** with the backend:

**API Service Layer** (`src/services/api.js`):
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to attach JWT token
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};

// API collections
export const authAPI = {
  login: async ({ email, password }) => { /* ... */ },
  register: async ({ username, email, password, avatar }) => { /* ... */ },
  logout: () => { /* ... */ },
  // ... more methods
};

export const playlistAPI = { /* ... */ };
export const songAPI = { /* ... */ };
export const userAPI = { /* ... */ };
```

**JWT Token Management**:
```javascript
// Stored on login (in authAPI.login)
localStorage.setItem('authToken', token);
localStorage.setItem('currentUser', JSON.stringify(user));

// Retrieved in components
const token = localStorage.getItem('authToken');
const user = JSON.parse(localStorage.getItem('currentUser'));

// Cleared on logout
localStorage.removeItem('authToken');
localStorage.removeItem('currentUser');
```

**Component Example** (using API):
```javascript
// PlaylistsPage.jsx
import { playlistAPI } from '../../services/api';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await playlistAPI.getAll({ sortBy: 'listeners-hi-lo' });
        setPlaylists(data.playlists);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchPlaylists();
  }, []);

  // ... rest of component
};
```

## Troubleshooting

### Common Issues

**Backend connection error (Network Error):**
- Ensure backend is running on `http://localhost:5000`
- Check backend logs for errors
- Verify `.env` has correct `VITE_API_URL`
- Check CORS configuration in backend

**401 Unauthorized:**
- Token might be expired (JWT expires after 7 days)
- Try logging out and logging in again
- Check localStorage for `authToken`

**Empty playlists/songs:**
- Ensure backend database is seeded: `cd ../back-end && npm run seed`
- Check MongoDB is running
- Verify backend API is responding: `curl http://localhost:5000/api/health`

**Port already in use:**
```bash
# Change port in vite.config.js
export default defineConfig({
  server: { port: 3000 }
})
```

**CSS not updating:**
- Hard refresh browser (Cmd/Ctrl + Shift + R)
- Clear browser cache
- Restart dev server

**Component not rendering:**
- Check console for errors
- Verify import/export syntax
- Check React DevTools component tree
- Check Network tab for failed API requests

**Route not working:**
- Verify route path in App.jsx
- Check navigation onClick handlers
- Ensure react-router-dom is installed

## API Integration Reference

For full API documentation, see:
- **Backend API**: `../back-end/README.md`
- **Database Schema**: `../back-end/SCHEMA.md`
- **Integration Guide**: `../back-end/INTEGRATION_GUIDE.md`

### Quick API Reference

**Available API Collections** (in `services/api.js`):
- `authAPI` - login, register, logout, getCurrentUser, isAuthenticated
- `userAPI` - getMe, updateMe, getById
- `playlistAPI` - getAll, getById, create, update, delete, addSong, removeSong, recordPlay
- `songAPI` - getAll, getById, create, update, delete, recordListen
- `healthAPI` - checkHealth

## Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## Development Status

✅ **Frontend**: Complete with full backend integration
✅ **Backend**: Complete REST API with MongoDB
✅ **Authentication**: JWT-based auth with localStorage
✅ **CRUD Operations**: All playlist and song operations working
✅ **Toast Notifications**: Global notification system
✅ **Error Handling**: Comprehensive error handling
✅ **Loading States**: Loading indicators during API calls

## Questions?

For issues or questions:
1. Check this guide and other documentation files
2. Review component code comments
3. Check browser console and Network tab for errors
4. Verify backend is running and accessible
5. Check the main project README

---

Happy coding! The Playlister is fully functional! 🎉