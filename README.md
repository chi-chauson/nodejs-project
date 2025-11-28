# The Playlister

A modern full-stack web application for creating, managing, and sharing music playlists with YouTube integration.

## Project Structure

```
playlister/
├── front-end/          # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md      # Frontend-specific documentation
├── back-end/          # Express + MongoDB backend (coming soon)
├── .gitignore
└── README.md          # This file - project overview
```

## Overview

The Playlister allows users to create and manage music playlists with YouTube integration. Users can browse songs, create custom playlists, and share them with others.

### Current Status
- ✅ **Frontend**: Complete React application with routing, authentication flow, and UI components
- 🚧 **Backend**: In development (Express + MongoDB)

## Quick Start

### Frontend Development

```bash
cd front-end
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

**Test Account:**
- Email: `test@playlister.com`
- Password: `test123`

### Backend Development (Coming Soon)

```bash
cd back-end
npm install
npm run dev
```

## Tech Stack

### Frontend
- React 18 + Vite
- React Router
- Lucide React (icons)
- CSS3

### Backend (Planned)
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

## Features

### Current (Frontend Only)
- 🎵 Browse and search playlists
- 🔍 Filter by name, user, song, artist, year
- 📺 YouTube video player integration
- 👥 Authentication flow (UI only, using sessionStorage)
- ✏️ Create, edit, delete playlists (UI only)
- 🎨 Modern, responsive design

### Planned (With Backend)
- 🔐 Real JWT authentication
- 💾 Persistent data storage in MongoDB
- 🔄 Real-time playlist updates
- 👤 User profiles and social features
- 📊 Analytics and recommendations

## Documentation

- **Frontend README**: See `front-end/README.md` for detailed frontend setup, architecture, and component documentation
- **Backend README**: Coming soon in `back-end/README.md`

## Development Workflow

1. **Frontend Development**: Work in `front-end/` directory
2. **Backend Development**: Work in `back-end/` directory (coming soon)
3. **Integration**: Frontend will connect to backend API

## Contributing

This is a personal learning project. Feel free to fork and experiment!

## License

MIT License

---

**Note**: Frontend is complete and functional with mock data. Backend integration is the next phase of development.