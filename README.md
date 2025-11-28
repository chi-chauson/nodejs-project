# The Playlister

A modern web application for creating, managing, and sharing music playlists with YouTube integration.

## Features

- 🎵 Create and manage personal playlists
- 🔍 Search and filter playlists by name, user, song title, artist, and year
- 📺 YouTube video player integration for playing songs
- 👥 User authentication (login/guest mode)
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

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd playlister
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd front-end
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload if you make changes to the code

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
front-end/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components (Button, Input, Modal, etc.)
│   │   ├── auth/            # Authentication components (Login, Create Account, etc.)
│   │   ├── home/            # Home page component
│   │   ├── playlists/       # Playlist management components
│   │   └── songs/           # Song catalog components
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # Global styles
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Key Features Explained

### Playlist Management
- Create new playlists with custom names
- Add multiple songs to playlists
- Edit playlist details and song order
- Delete playlists (owner only)
- Copy playlists from other users
- Expand/collapse to view all songs in a playlist

### Song Catalog
- Browse all available songs
- Search by title, artist, or year
- Add songs to your playlists
- Edit song metadata
- Remove songs from catalog
- View listen count and playlist usage statistics

### Play Modal
- YouTube video player integration
- Song list with clickable tracks
- Previous/Next controls
- Auto-play next song (when implemented with backend)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

- All data is currently stored in sessionStorage (will be replaced with backend API)
- YouTube videos use placeholder IDs
- No real authentication (test account is hardcoded)
- No persistence between sessions (data resets on page refresh)

## Future Enhancements

- Backend API integration with Express
- MongoDB database for data persistence
- Real user authentication with JWT
- Social features (follow users, like playlists)
- Playlist sharing with unique URLs
- Advanced search and filtering
- Playlist recommendations
- Audio playback controls

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - feel free to use this project for learning purposes.

## Contact

For questions or feedback, please open an issue in the repository.

---

Built with ❤️ using React and Vite