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
├── back-end/          # Express + MongoDB backend
│   ├── src/
│   ├── package.json
│   ├── README.md      # Backend API documentation
│   ├── SCHEMA.md      # Database schema documentation
│   └── INTEGRATION_GUIDE.md  # Frontend-backend integration guide
├── .gitignore
└── README.md          # This file - project overview
```

## Overview

The Playlister allows users to create and manage music playlists with YouTube integration. Users can browse songs, create custom playlists, and share them with others.

### Current Status
- ✅ **Frontend**: Complete React application with full integration to backend API
- ✅ **Backend**: Complete Express + MongoDB REST API with JWT authentication
- ✅ **Integration**: Frontend connected to backend with real-time data persistence

## Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB 8.2+ running locally (or MongoDB Atlas connection string)

### 1. Setup Backend

```bash
cd back-end
npm install

# Create and configure .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database with test data
npm run seed

# Start backend server
npm run dev
```

The API will be available at `http://localhost:5000`

### 2. Setup Frontend

```bash
cd front-end
npm install

# Create and configure .env file (optional)
cp .env.example .env

# Start frontend dev server
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Test the Application

**Test Accounts:**
- Email: `test@playlister.com`, Password: `test123` (JoelDemo)
- Email: `alice@playlister.com`, Password: `test123` (AliceMusic)
- Email: `bob@playlister.com`, Password: `test123` (BobRocks)

**Guest Mode:**
- Click "Continue as Guest" to browse without authentication

## Tech Stack

### Frontend
- React 19.2 + Vite 7.2
- React Router DOM 7.9
- Lucide React 0.555 (icons)
- CSS3 with modern features

### Backend
- Node.js + Express 4.18
- MongoDB 8.2 + Mongoose 8.0
- JWT Authentication (jsonwebtoken 9.0)
- bcrypt 5.1 for password hashing
- express-validator 7.0 for input validation
- CORS enabled

## Features

### Authentication & User Management
- 🔐 JWT-based authentication with 7-day token expiration
- 👥 User registration and login
- 🎭 Guest mode for browsing without account
- ✏️ User profile management (username, email, avatar, password)
- 🔒 Password hashing with bcrypt
- 🛡️ Protected routes and authorization

### Playlist Management
- 📝 Create, edit, and delete playlists
- 🎵 Add/remove songs from playlists
- 🔄 Reorder songs in playlists
- 📺 Play playlists with YouTube integration
- 📋 Copy existing playlists
- 🔓 Public/private playlist visibility
- 📊 Track playlist play counts and listeners

### Song Catalog
- 🎸 Browse and search song catalog
- ➕ Add new songs with YouTube integration
- ✏️ Edit song details (title, artist, year, YouTube ID, duration)
- 🗑️ Remove songs from catalog
- 🎧 Track song listen counts
- 🔍 Full-text search on titles and artists

### Search & Filter
- 🔍 Filter playlists by: name, user, song title, artist, year
- 🔍 Filter songs by: title, artist, year
- 📊 Multiple sort options (by listeners, name, plays)
- ⚡ Real-time search results

### User Experience
- 🎨 Modern, colorful UI with gradients and animations
- 📱 Responsive design for all devices
- 🔔 Toast notifications for user actions
- ⏳ Loading states for async operations
- ❌ Comprehensive error handling
- 💾 Persistent data storage in MongoDB

## Documentation

- **Frontend README**: `front-end/README.md` - Component architecture, routing, and UI details
- **Frontend Setup Guide**: `front-end/PROJECT_SETUP.md` - Detailed setup and development guide
- **Backend README**: `back-end/README.md` - Complete API documentation with examples
- **Database Schema**: `back-end/SCHEMA.md` - MongoDB schema design and relationships
- **Integration Guide**: `back-end/INTEGRATION_GUIDE.md` - How frontend connects to backend

## Architecture Overview

### Frontend Architecture
- **Component-based**: Reusable UI components (Button, Input, Modal, etc.)
- **Routing**: React Router for client-side navigation
- **State Management**: React hooks (useState, useEffect) with localStorage for persistence
- **API Layer**: Centralized API service (`services/api.js`) with JWT token management

### Backend Architecture
- **REST API**: Express.js with clean route organization
- **Authentication**: JWT middleware for protected routes, optional auth for guest browsing
- **Validation**: express-validator for input sanitization
- **Database**: MongoDB with Mongoose ODM, hybrid schema design (references + denormalization)
- **Security**: bcrypt password hashing, CORS configuration, input validation

### Database Design
- **Hybrid Schema**: Combines references with selective denormalization for optimal performance
- **Collections**: Users, Songs, Playlists
- **Relationships**: Many-to-many with bidirectional references
- **Performance**: Strategic indexing and cached counters

## Development Workflow

### Running Both Services
```bash
# Terminal 1 - Backend
cd back-end
npm run dev

# Terminal 2 - Frontend
cd front-end
npm run dev
```

### Database Management
```bash
# Seed with test data
cd back-end
npm run seed

# Clean database only
npm run seed:clean
```

### Making Changes
1. **Backend Changes**: Edit files in `back-end/src/`, server auto-restarts with nodemon
2. **Frontend Changes**: Edit files in `front-end/src/`, hot module replacement updates instantly
3. **Database Schema**: Update models in `back-end/src/models/`, remember to update documentation

## API Endpoints

Quick reference - see `back-end/README.md` for full documentation:

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Users**: `GET /api/users/me`, `PUT /api/users/me`, `GET /api/users/:id`
- **Playlists**: `GET|POST /api/playlists`, `GET|PUT|DELETE /api/playlists/:id`
- **Songs**: `GET|POST /api/songs`, `GET|PUT|DELETE /api/songs/:id`
- **Health**: `GET /api/health`

## Deployment Considerations

### Backend
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI (MongoDB Atlas recommended)
- Set appropriate `JWT_EXPIRES_IN`
- Configure `FRONTEND_URL` for CORS

### Frontend
- Run `npm run build` to create optimized production build
- Serve `dist/` folder with static file server
- Update `VITE_API_URL` to production backend URL

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running: `mongod` or check system service
- Verify `.env` file exists with correct `MONGODB_URI`
- Check port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:5000`
- Check CORS configuration in backend `.env`
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for errors

### Database issues
- Reset database: `npm run seed` (in back-end folder)
- Check MongoDB connection: `mongosh` then `use playlister`
- Verify MongoDB version 8.2+

## Contributing

This is a personal learning project demonstrating modern full-stack development. Feel free to fork and experiment!

## License

MIT License

---

**Status**: ✅ Full-stack application complete with frontend, backend, and database integration!