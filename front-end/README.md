# Playlister Frontend

React-based frontend application for The Playlister music playlist manager.

## Features

- 🎵 Create and manage personal playlists
- 🔍 Search and filter playlists by name, user, song title, artist, and year
- 📺 YouTube video player integration for playing songs
- 👥 User authentication flow (login/guest mode)
- ✏️ Edit playlist details and song collections
- 🎨 Modern, colorful UI with smooth animations
- 📱 Responsive design for mobile and desktop

## Tech Stack

- **React 18** - UI library
- **React Router** - Navigation and routing
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS3** - Styling with gradients and animations

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Start development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## Test Account

To test the full functionality with a logged-in user:

- **Email:** `test@playlister.com`
- **Password:** `test123`

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
│   │   ├── EditPlaylistModal.jsx / EditPlaylistModal.css
│   └── songs/           # Song catalog
│       ├── SongCatalogPage.jsx / SongCatalogPage.css
│       ├── SongSearchSidebar.jsx / SongSearchSidebar.css
│       ├── SongList.jsx / SongList.css
│       ├── SongCard.jsx / SongCard.css
│       ├── SongKebabMenu.jsx / SongKebabMenu.css
│       ├── YouTubePlayer.jsx / YouTubePlayer.css
│       ├── EditSongModal.jsx / EditSongModal.css
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

Currently using:
- **React useState** - Local component state
- **sessionStorage** - Temporary user authentication state

Future: Will integrate with backend API and potentially add Context API or Redux for global state management.

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

## Known Limitations

- All data is currently stored in sessionStorage (temporary)
- YouTube videos use placeholder IDs
- No real authentication (test account is hardcoded)
- No persistence between sessions (data resets on page refresh)
- No backend integration yet

## Next Steps (Backend Integration)

When backend is ready, this frontend will need:
1. Replace sessionStorage with JWT tokens stored in localStorage
2. Add API service layer for HTTP requests
3. Implement proper error handling and loading states
4. Add form validation with backend verification
5. Connect YouTube player to real video IDs from database

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