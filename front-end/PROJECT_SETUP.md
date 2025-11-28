# Project Setup Guide

This guide will help you organize your Playlister project structure for both frontend and future backend development.

## Step 1: Create Project Structure

Create a new repository with this structure:

```
playlister/
├── front-end/           # React frontend application
├── .gitignore          # Git ignore file
└── README.md           # Main project README
```

## Step 2: Move Frontend Code

1. Create a `front-end` folder in your project root
2. Move all your current Vite/React files into `front-end/`:
   - `src/`
   - `public/`
   - `index.html`
   - `package.json`
   - `vite.config.js`
   - `package-lock.json` (if exists)
   - Any other config files

Your structure should look like:

```
playlister/
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
├── .gitignore
└── README.md
```

## Step 3: Initialize Git Repository

```bash
# Navigate to your project root
cd playlister

# Initialize git (if not already done)
git init

# Add the .gitignore file
# (Copy the provided .gitignore content)

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: Frontend setup with React + Vite"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. **Don't** initialize with README, .gitignore, or license (you already have these)
3. Copy the repository URL

## Step 5: Push to GitHub

```bash
# Add the remote repository
git remote add origin <your-github-repo-url>

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 6: Verify Everything Works

```bash
# Navigate to frontend
cd front-end

# Install dependencies (if not already done)
npm install

# Start dev server to test
npm run dev
```

## Future Backend Setup (Not Yet)

When you're ready to add the backend, you'll create:

```
playlister/
├── front-end/          # Your existing React app
├── back-end/           # Future Express + MongoDB backend
│   ├── src/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## Typical Development Workflow

```bash
# Frontend development
cd front-end
npm run dev

# (Future) Backend development
cd back-end
npm run dev

# Git workflow
git add .
git commit -m "Your commit message"
git push
```

## Important Notes

1. **Don't commit `node_modules/`** - It's in .gitignore
2. **Don't commit `.env` files** - They contain sensitive data
3. **Don't commit `dist/` or `build/`** - These are generated files
4. **Do commit `package.json` and `package-lock.json`** - Others need these to install dependencies

## Useful Git Commands

```bash
# Check status
git status

# See what changed
git diff

# Create a new branch for a feature
git checkout -b feature-name

# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# View commit history
git log --oneline
```

## IDE Recommendations

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier - Code formatter
- Auto Rename Tag
- GitLens

### WebStorm
Works great out of the box with React and Vite!

---

You're now ready to start developing! The frontend is properly organized and ready for future backend integration.