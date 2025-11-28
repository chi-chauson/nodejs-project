const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection URL
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'playlister';

// Sample base64 avatar (small 1x1 pixel transparent PNG)
const DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function seedDatabase() {
    const client = new MongoClient(MONGO_URL);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(DB_NAME);

        // Clear existing data
        console.log('\n🗑️  Clearing existing data...');
        await db.collection('users').deleteMany({});
        await db.collection('songs').deleteMany({});
        await db.collection('playlists').deleteMany({});
        console.log('✅ Cleared existing collections');

        // Create Users
        console.log('\n👤 Creating users...');
        const hashedPassword = await bcrypt.hash('test123', 10);

        const users = await db.collection('users').insertMany([
            {
                _id: new ObjectId(),
                username: 'JoelDemo',
                email: 'test@playlister.com',
                passwordHash: hashedPassword,
                avatar: DEFAULT_AVATAR,
                playlistCount: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                username: 'AliceMusic',
                email: 'alice@playlister.com',
                passwordHash: hashedPassword,
                avatar: DEFAULT_AVATAR,
                playlistCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                username: 'BobRocks',
                email: 'bob@playlister.com',
                passwordHash: hashedPassword,
                avatar: DEFAULT_AVATAR,
                playlistCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        const joelId = users.insertedIds[0];
        const aliceId = users.insertedIds[1];
        const bobId = users.insertedIds[2];

        console.log(`✅ Created ${users.insertedCount} users`);
        console.log(`   - JoelDemo (test@playlister.com / test123)`);
        console.log(`   - AliceMusic (alice@playlister.com / test123)`);
        console.log(`   - BobRocks (bob@playlister.com / test123)`);

        // Create Songs
        console.log('\n🎵 Creating songs...');
        const songs = await db.collection('songs').insertMany([
            {
                _id: new ObjectId(),
                title: 'Come Fly With Me',
                artist: 'Frank Sinatra',
                year: 1958,
                youtubeId: 'HmQq6yLe2ww',
                duration: '3:18',
                listens: [
                    {
                        userId: joelId,
                        username: 'JoelDemo',
                        listenedAt: new Date('2024-01-15')
                    },
                    {
                        userId: aliceId,
                        username: 'AliceMusic',
                        listenedAt: new Date('2024-01-16')
                    }
                ],
                listensCount: 2,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Fast Train',
                artist: 'Solomon Burke',
                year: 1985,
                youtubeId: '5OWdRXHqXh8',
                duration: '5:43',
                listens: [
                    {
                        userId: joelId,
                        username: 'JoelDemo',
                        listenedAt: new Date('2024-01-15')
                    }
                ],
                listensCount: 1234567,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Highway Star',
                artist: 'Deep Purple',
                year: 1982,
                youtubeId: 'Wr9ie2J2690',
                duration: '6:05',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Space Oddity',
                artist: 'David Bowie',
                year: 1969,
                youtubeId: 'iYYRH4apXDo',
                duration: '5:18',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'Rocket Man',
                artist: 'Elton John',
                year: 1972,
                youtubeId: 'DtVBCG6ThDk',
                duration: '4:41',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                title: 'I Wish I Knew',
                artist: 'Solomon Burke',
                year: 1968,
                youtubeId: 'dQw4w9WgXcQ',
                duration: '3:45',
                listens: [],
                listensCount: 4567,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        const songIds = Object.values(songs.insertedIds);
        console.log(`✅ Created ${songs.insertedCount} songs`);

        // Create Playlists
        console.log('\n📋 Creating playlists...');
        const playlists = await db.collection('playlists').insertMany([
            {
                _id: new ObjectId(),
                name: "Don't be Rude",
                userId: joelId,
                username: 'JoelDemo',
                avatar: DEFAULT_AVATAR,
                songs: [
                    {
                        songId: songIds[0],
                        title: 'Come Fly With Me',
                        artist: 'Frank Sinatra',
                        year: 1958,
                        duration: '3:18',
                        addedAt: new Date('2024-01-15'),
                        order: 1
                    },
                    {
                        songId: songIds[1],
                        title: 'Fast Train',
                        artist: 'Solomon Burke',
                        year: 1985,
                        duration: '5:43',
                        addedAt: new Date('2024-01-15'),
                        order: 2
                    },
                    {
                        songId: songIds[2],
                        title: 'Highway Star',
                        artist: 'Deep Purple',
                        year: 1982,
                        duration: '6:05',
                        addedAt: new Date('2024-01-15'),
                        order: 3
                    }
                ],
                listeners: [
                    {
                        userId: aliceId,
                        username: 'AliceMusic',
                        listenedAt: new Date('2024-01-16'),
                        playCount: 5
                    },
                    {
                        userId: bobId,
                        username: 'BobRocks',
                        listenedAt: new Date('2024-01-17'),
                        playCount: 2
                    }
                ],
                listenersCount: 137,
                isPublic: true,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
            },
            {
                _id: new ObjectId(),
                name: 'Spacey',
                userId: joelId,
                username: 'JoelDemo',
                avatar: DEFAULT_AVATAR,
                songs: [
                    {
                        songId: songIds[3],
                        title: 'Space Oddity',
                        artist: 'David Bowie',
                        year: 1969,
                        duration: '5:18',
                        addedAt: new Date('2024-01-16'),
                        order: 1
                    },
                    {
                        songId: songIds[4],
                        title: 'Rocket Man',
                        artist: 'Elton John',
                        year: 1972,
                        duration: '4:41',
                        addedAt: new Date('2024-01-16'),
                        order: 2
                    }
                ],
                listeners: [
                    {
                        userId: aliceId,
                        username: 'AliceMusic',
                        listenedAt: new Date('2024-01-18'),
                        playCount: 1
                    }
                ],
                listenersCount: 37,
                isPublic: true,
                createdAt: new Date('2024-01-16'),
                updatedAt: new Date('2024-01-16')
            }
        ]);

        const playlistIds = Object.values(playlists.insertedIds);
        console.log(`✅ Created ${playlists.insertedCount} playlists`);

        // Update songs with playlist references
        console.log('\n🔗 Updating song-playlist references...');
        await db.collection('songs').updateOne(
            { _id: songIds[0] },
            {
                $set: {
                    playlists: [
                        {
                            playlistId: playlistIds[0],
                            playlistName: "Don't be Rude",
                            addedAt: new Date('2024-01-15')
                        }
                    ],
                    playlistCount: 1
                }
            }
        );

        await db.collection('songs').updateOne(
            { _id: songIds[1] },
            {
                $set: {
                    playlists: [
                        {
                            playlistId: playlistIds[0],
                            playlistName: "Don't be Rude",
                            addedAt: new Date('2024-01-15')
                        }
                    ],
                    playlistCount: 123
                }
            }
        );

        await db.collection('songs').updateOne(
            { _id: songIds[2] },
            {
                $set: {
                    playlists: [
                        {
                            playlistId: playlistIds[0],
                            playlistName: "Don't be Rude",
                            addedAt: new Date('2024-01-15')
                        }
                    ],
                    playlistCount: 1
                }
            }
        );

        await db.collection('songs').updateOne(
            { _id: songIds[3] },
            {
                $set: {
                    playlists: [
                        {
                            playlistId: playlistIds[1],
                            playlistName: 'Spacey',
                            addedAt: new Date('2024-01-16')
                        }
                    ],
                    playlistCount: 1
                }
            }
        );

        await db.collection('songs').updateOne(
            { _id: songIds[4] },
            {
                $set: {
                    playlists: [
                        {
                            playlistId: playlistIds[1],
                            playlistName: 'Spacey',
                            addedAt: new Date('2024-01-16')
                        }
                    ],
                    playlistCount: 1
                }
            }
        );

        console.log('✅ Updated song-playlist references');

        // Create indexes
        console.log('\n📊 Creating indexes...');

        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('users').createIndex({ username: 1 }, { unique: true });

        await db.collection('songs').createIndex({ title: 'text', artist: 'text' });
        await db.collection('songs').createIndex({ artist: 1, year: 1 });
        await db.collection('songs').createIndex({ 'listens.userId': 1 });
        await db.collection('songs').createIndex({ 'playlists.playlistId': 1 });

        await db.collection('playlists').createIndex({ userId: 1 });
        await db.collection('playlists').createIndex({ name: 'text' });
        await db.collection('playlists').createIndex({ 'listeners.userId': 1 });

        console.log('✅ Created indexes');

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('✨ Database seeded successfully!');
        console.log('='.repeat(60));
        console.log('\n📊 Summary:');
        console.log(`   Database: ${DB_NAME}`);
        console.log(`   Users: ${users.insertedCount}`);
        console.log(`   Songs: ${songs.insertedCount}`);
        console.log(`   Playlists: ${playlists.insertedCount}`);
        console.log('\n🔑 Test Account:');
        console.log('   Email: test@playlister.com');
        console.log('   Password: test123');
        console.log('\n💡 You can now start your backend server!');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB\n');
    }
}

// Run the seed function
seedDatabase();