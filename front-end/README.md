# Playlister Frontend

React-based frontend application for The Playlister music playlist manager.

## Features

- 🔐 Full user authentication with JWT tokens (register, login, logout)
- 🎭 Guest mode for browsing without account
- 🎵 Create, edit, delete, and copy playlists
- 🎸 Browse and manage song catalog
- 🔍 Advanced search and filter by name, user, song title, artist, and year
- 📊 Multiple sort options (listeners, name, plays)
- 📺 YouTube video player integration for playing songs
- ✏️ Edit playlist details and song collections
- 🎨 Modern, colorful UI with smooth animations
- 📱 Responsive design for mobile and desktop
- 🔔 Toast notifications for user actions
- 💾 Persistent data storage via MongoDB backend
- ⚡ Real-time updates

## Tech Stack

- **React 19.2** - UI library
- **React Router DOM 7.9** - Navigation and routing
- **Vite 7.2** - Build tool and dev server
- **Lucide React 0.555** - Icon library
- **CSS3** - Styling with gradients and animations
- **Fetch API** - HTTP requests to backend
- **localStorage** - JWT token persistence

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- **Backend API running** on `http://localhost:5000` (see `../back-end/README.md`)

## Installation

```bash
# Install dependencies
npm install

# Create environment file (optional - defaults work for local development)
cp .env.example .env
```

## Environment Configuration

Create a `.env` file in the `front-end` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

This is optional - the default value will work for local development.

## Running the Application

**Important**: Make sure the backend server is running first!

```bash
# In another terminal, start backend (if not already running)
cd ../back-end
npm run dev

# Then start frontend
cd ../front-end
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## Test Accounts

To test the full functionality with logged-in users (created by backend seed script):

- **Email:** `test@playlister.com` / **Password:** `test123` (JoelDemo)
- **Email:** `alice@playlister.com` / **Password:** `test123` (AliceMusic)
- **Email:** `bob@playlister.com` / **Password:** `test123` (BobRocks)

Or register a new account through the app!

## User Modes

### Guest Mode
- Click "Continue as Guest" on the home page
- Browse and play playlists
- Cannot edit or delete playlists
- Cannot create new playlists

### Logged In Mode
- Sign in with test credentials
- Full access to create, edit, and delete your own playlists
- Add songs to playlists
- Manage song catalog

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.jsx / Button.css
│   │   ├── Input.jsx / Input.css
│   │   ├── Modal.jsx / Modal.css
│   │   ├── Navbar.jsx / Navbar.css
│   │   ├── Footer.jsx / Footer.css
│   │   ├── Toast.jsx / Toast.css
│   │   └── ConfirmationModal.jsx / ConfirmationModal.css
│   ├── auth/            # Authentication components
│   │   ├── SignInForm.jsx
│   │   ├── CreateAccountForm.jsx
│   │   ├── EditAccountForm.jsx
│   │   ├── UserDropdown.jsx / UserDropdown.css
│   │   └── Auth.css
│   ├── home/            # Home/landing page
│   │   ├── HomePage.jsx
│   │   └── HomePage.css
│   ├── playlists/       # Playlist management
│   │   ├── PlaylistsPage.jsx / PlaylistsPage.css
│   │   ├── PlaylistSearchSidebar.jsx / PlaylistSearchSidebar.css
│   │   ├── PlaylistList.jsx / PlaylistList.css
│   │   ├── PlaylistCard.jsx / PlaylistCard.css
│   │   ├── PlayPlaylistModal.jsx / PlayPlaylistModal.css
│   │   └── EditPlaylistModal.jsx / EditPlaylistModal.css
│   └── songs/           # Song catalog
│       ├── SongCatalogPage.jsx / SongCatalogPage.css
│       ├── SongSearchSidebar.jsx / SongSearchSidebar.css
│       ├── SongList.jsx / SongList.css
│       ├── SongCard.jsx / SongCard.css
│       ├── SongKebabMenu.jsx / SongKebabMenu.css
│       ├── YouTubePlayer.jsx / YouTubePlayer.css
│       └── EditSongModal.jsx / EditSongModal.css
├── contexts/
│   └── ToastContext.jsx # Toast notification context
├── services/
│   └── api.js           # Backend API service layer
├── App.jsx              # Main app with routing
├── App.css              # Global styles
└── main.jsx             # Application entry point
```

## Component Architecture

### Common Components
Reusable UI components used throughout the app:
- **Button** - Styled button with variants (primary, secondary, delete, edit, copy, play)
- **Input** - Text input with clear button
- **Modal** - Base modal component for dialogs
- **ConfirmationModal** - Confirmation dialog for destructive actions
- **Navbar** - Navigation bar with user menu
- **Footer** - Copyright footer

### Page Components
- **HomePage** - Landing page with guest/login/signup options
- **PlaylistsPage** - Main playlist browsing and management
- **SongCatalogPage** - Browse and manage song catalog

### Feature Components
- **Authentication** - Sign in, create account, edit account forms
- **Playlists** - List, card, search, play, and edit components
- **Songs** - List, card, search, kebab menu, edit components

## Routes

- `/` - Home page (login screen)
- `/signin` - Sign in form
- `/create-account` - Create account form
- `/edit-account` - Edit account form
- `/playlists` - Playlists page
- `/songs` - Song catalog page

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## State Management

- **React useState** - Local component state
- **React useEffect** - Data fetching from backend API
- **ToastContext** - Global toast notification system
- **localStorage** - JWT token and user data persistence
- **API Service Layer** - Centralized HTTP requests (`services/api.js`)

## Styling Approach

- Component-specific CSS files (co-located with components)
- CSS custom properties for consistent theming
- Responsive design with media queries
- Gradients and modern visual effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Backend Integration

The frontend is **fully integrated** with the backend API:

- ✅ JWT authentication with localStorage persistence
- ✅ API service layer (`services/api.js`)
- ✅ Error handling with toast notifications
- ✅ Loading states for async operations
- ✅ Real YouTube video IDs from database
- ✅ Persistent data storage in MongoDB
- ✅ Input validation on forms

See `../back-end/INTEGRATION_GUIDE.md` for integration details.

## Possible Enhancements

1. **Performance**: Add pagination, infinite scroll, caching
2. **Features**: Drag-and-drop song reordering, favorites, dark mode
3. **UX**: Keyboard shortcuts, optimistic updates, offline mode
4. **Testing**: Unit tests, integration tests, E2E tests
5. **Deployment**: Build optimization, CDN, Progressive Web App

## Development Guidelines

### Adding a New Component

1. Create component file: `ComponentName.jsx`
2. Create styles file: `ComponentName.css`
3. Import and use in parent component
4. Keep components focused and reusable

### Code Style

- Use functional components with hooks
- Keep components under 200 lines when possible
- Use descriptive variable names
- Add comments for complex logic
- Follow existing file structure

## Troubleshooting

### Port 5173 already in use
```bash
# Kill the process using the port or change port in vite.config.js
```

### Dependencies not installing
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

### App not updating after changes
```bash
# Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
# Or restart dev server
```

## Contributing

This is part of a larger full-stack project. See main project README for overall contribution guidelines.

---

Built with ❤️ using React and Vite