# MongoDB Seed Script

This script populates your MongoDB database with test data for the Playlister application.

## Prerequisites

1. **MongoDB 8.2** installed and running
2. **Node.js** installed

## Setup

### 1. Create a seed directory (temporary)

```bash
# In your project root
mkdir seed-data
cd seed-data
```

### 2. Copy the files

Copy these files into the `seed-data` directory:
- `seed.js`
- `package.json`

### 3. Install dependencies

```bash
npm install
```

## Running the Seed Script

### 1. Start MongoDB (if not already running)

```bash
# On macOS/Linux
mongod --dbpath /path/to/your/data

# On Windows
mongod --dbpath C:\path\to\your\data

# Or if MongoDB is running as a service, it should already be running
```

### 2. Run the seed script

```bash
npm run seed
```

You should see output like:

```
Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing existing data...
✅ Cleared existing collections

👤 Creating users...
✅ Created 3 users
   - JoelDemo (test@playlister.com / test123)
   - AliceMusic (alice@playlister.com / test123)
   - BobRocks (bob@playlister.com / test123)

🎵 Creating songs...
✅ Created 6 songs

📋 Creating playlists...
✅ Created 2 playlists

🔗 Updating song-playlist references...
✅ Updated song-playlist references

📊 Creating indexes...
✅ Created indexes

============================================================
✨ Database seeded successfully!
============================================================

📊 Summary:
   Database: playlister
   Users: 3
   Songs: 6
   Playlists: 2

🔑 Test Account:
   Email: test@playlister.com
   Password: test123

💡 You can now start your backend server!
============================================================
```

## What Gets Created

### Users (3)
- **JoelDemo** - test@playlister.com (password: test123)
- **AliceMusic** - alice@playlister.com (password: test123)
- **BobRocks** - bob@playlister.com (password: test123)

### Songs (6)
1. Come Fly With Me - Frank Sinatra (1958)
2. Fast Train - Solomon Burke (1985)
3. Highway Star - Deep Purple (1982)
4. Space Oddity - David Bowie (1969)
5. Rocket Man - Elton John (1972)
6. I Wish I Knew - Solomon Burke (1968)

### Playlists (2)
1. **"Don't be Rude"** by JoelDemo
   - 3 songs
   - 137 listeners
   - Listeners: AliceMusic (5 plays), BobRocks (2 plays)

2. **"Spacey"** by JoelDemo
   - 2 songs
   - 37 listeners
   - Listeners: AliceMusic (1 play)

### Additional Data
- Song listen tracking (who listened to which songs)
- Playlist references in songs (which playlists contain each song)
- Proper indexes for performance

## Verify the Data

### Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Browse the `playlister` database
4. Check the `users`, `songs`, and `playlists` collections

### Using MongoDB Shell

```bash
# Start mongo shell
mongosh

# Switch to database
use playlister

# Check users
db.users.find().pretty()

# Check songs
db.songs.find().pretty()

# Check playlists
db.playlists.find().pretty()

# Count documents
db.users.countDocuments()
db.songs.countDocuments()
db.playlists.countDocuments()
```

## Re-seeding the Database

The script automatically clears existing data before seeding. To re-seed:

```bash
npm run seed
```

This is safe to run multiple times.

## Customizing the Seed Data

Edit `seed.js` to:
- Add more users, songs, or playlists
- Change the test account credentials
- Modify default data
- Add more realistic data

## Troubleshooting

### "MongoServerError: Authentication failed"

MongoDB might have authentication enabled. Update the connection URL in `seed.js`:

```javascript
const MONGO_URL = 'mongodb://username:password@localhost:27017';
```

### "Cannot find module 'mongodb'"

Install dependencies:

```bash
npm install
```

### "Connection refused"

Make sure MongoDB is running:

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Or on Windows
tasklist | findstr mongod

# Start MongoDB if needed
mongod
```

### "Database already exists"

That's fine! The script clears existing data automatically.

## Next Steps

After seeding:

1. Start building your backend Express server
2. Connect to the `playlister` database
3. Use the test account to login
4. The frontend will now work with real MongoDB data!

## Cleanup (Optional)

After you've confirmed everything works and your backend is set up, you can:

```bash
# Delete the seed-data directory
cd ..
rm -rf seed-data
```

Your data will remain in MongoDB.

---

**Note**: This is test data for development. Don't use these passwords in production!