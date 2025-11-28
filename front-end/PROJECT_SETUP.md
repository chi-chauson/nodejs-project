# Frontend Setup Guide

This guide explains the Playlister frontend architecture, setup, and development workflow.

## Project Overview

The frontend is a React single-page application (SPA) built with Vite. It provides a complete UI for playlist management with mock data, ready to be connected to the backend API.

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

**Current Implementation** (Mock):
- Uses `sessionStorage` to store user state
- Guest mode vs Logged-in mode
- Test account: `test@playlister.com` / `test123`

**Future** (Backend Integration):
- Replace with JWT tokens
- Store in localStorage or httpOnly cookies
- API calls for login/logout/register

### 3. State Management

Currently using:
- `useState` for local component state
- `useEffect` to read from sessionStorage
- Props for parent-child communication

**When backend is ready:**
- Consider Context API or Redux for global state
- API service layer for HTTP requests

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

### Current (Mock Data)
```
Component State → sessionStorage → UI Display
```

### Future (Backend Integration)
```
User Action → API Request → Backend → Response → Update State → UI Display
```

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

## Connecting to Backend (Future)

### Step 1: Create API Service Layer

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  login: (credentials) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
  
  getPlaylists: (token) =>
    fetch(`${API_BASE_URL}/playlists`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
  
  // ... more API methods
};
```

### Step 2: Replace sessionStorage with JWT

```javascript
// Store token
localStorage.setItem('token', response.token);

// Get token
const token = localStorage.getItem('token');

// Remove token on logout
localStorage.removeItem('token');
```

### Step 3: Update Components

Replace mock data with API calls:
```javascript
useEffect(() => {
  const fetchPlaylists = async () => {
    const token = localStorage.getItem('token');
    const response = await api.getPlaylists(token);
    const data = await response.json();
    setPlaylists(data);
  };
  fetchPlaylists();
}, []);
```

## Troubleshooting

### Common Issues

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

**Route not working:**
- Verify route path in App.jsx
- Check navigation onClick handlers
- Ensure react-router-dom is installed

## Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Lucide React Icons](https://lucide.dev/)

## Questions?

For issues or questions about the frontend:
1. Check this README
2. Review component documentation in code comments
3. Check the main project README
4. Open an issue on GitHub

---

Happy coding! 🚀