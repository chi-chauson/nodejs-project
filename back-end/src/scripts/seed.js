require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

// Sample base64 avatar (small 1x1 pixel transparent PNG)
const DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Song.deleteMany({});
        await Playlist.deleteMany({});
        console.log('✅ Cleared existing collections');

        // Create Users
        console.log('\n👤 Creating users...');
        const hashedPassword = await bcrypt.hash('test123', 10);

        const users = await User.insertMany([
            {
                username: 'JoelDemo',
                email: 'test@playlister.com',
                passwordHash: hashedPassword,
                avatar: DEFAULT_AVATAR,
                playlistCount: 2
            },
            {
                username: 'AliceMusic',
                email: 'alice@playlister.com',
                passwordHash: hashedPassword,
                avatar: DEFAULT_AVATAR,
                playlistCount: 0
            },
            {
                username: 'BobRocks',
                email: 'bob@playlister.com',
                passwordHash: hashedPassword,
                avatar: DEFAULT_AVATAR,
                playlistCount: 0
            }
        ]);

        const joelId = users[0]._id;
        const aliceId = users[1]._id;
        const bobId = users[2]._id;

        console.log(`✅ Created ${users.length} users`);
        console.log(`   - JoelDemo (test@playlister.com / test123)`);
        console.log(`   - AliceMusic (alice@playlister.com / test123)`);
        console.log(`   - BobRocks (bob@playlister.com / test123)`);

        // Create Songs
        console.log('\n🎵 Creating songs...');
        const songs = await Song.insertMany([
            {
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
                addedBy: joelId
            },
            {
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
                addedBy: joelId
            },
            {
                title: 'Highway Star',
                artist: 'Deep Purple',
                year: 1982,
                youtubeId: 'Wr9ie2J2690',
                duration: '6:05',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId
            },
            {
                title: 'Space Oddity',
                artist: 'David Bowie',
                year: 1969,
                youtubeId: 'iYYRH4apXDo',
                duration: '5:18',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId
            },
            {
                title: 'Rocket Man',
                artist: 'Elton John',
                year: 1972,
                youtubeId: 'DtVBCG6ThDk',
                duration: '4:41',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId
            },
            {
                title: 'I Wish I Knew',
                artist: 'Solomon Burke',
                year: 1968,
                youtubeId: 'dQw4w9WgXcQ',
                duration: '3:45',
                listens: [],
                listensCount: 4567,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId
            }
        ]);

        const songIds = songs.map(s => s._id);
        console.log(`✅ Created ${songs.length} songs`);

        // Create Playlists
        console.log('\n📋 Creating playlists...');
        const playlists = await Playlist.insertMany([
            {
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
                playlistListeners: [
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
                isPublic: true
            },
            {
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
                isPublic: true
            }
        ]);

        const playlistIds = playlists.map(p => p._id);
        console.log(`✅ Created ${playlists.length} playlists`);

        // Update songs with playlist references
        console.log('\n🔗 Updating song-playlist references...');
        await Song.findByIdAndUpdate(songIds[0], {
            playlists: [
                {
                    playlistId: playlistIds[0],
                    playlistName: "Don't be Rude",
                    addedAt: new Date('2024-01-15')
                }
            ],
            playlistCount: 1
        });

        await Song.findByIdAndUpdate(songIds[1], {
            playlists: [
                {
                    playlistId: playlistIds[0],
                    playlistName: "Don't be Rude",
                    addedAt: new Date('2024-01-15')
                }
            ],
            playlistCount: 123
        });

        await Song.findByIdAndUpdate(songIds[2], {
            playlists: [
                {
                    playlistId: playlistIds[0],
                    playlistName: "Don't be Rude",
                    addedAt: new Date('2024-01-15')
                }
            ],
            playlistCount: 1
        });

        await Song.findByIdAndUpdate(songIds[3], {
            playlists: [
                {
                    playlistId: playlistIds[1],
                    playlistName: 'Spacey',
                    addedAt: new Date('2024-01-16')
                }
            ],
            playlistCount: 1
        });

        await Song.findByIdAndUpdate(songIds[4], {
            playlists: [
                {
                    playlistId: playlistIds[1],
                    playlistName: 'Spacey',
                    addedAt: new Date('2024-01-16')
                }
            ],
            playlistCount: 1
        });

        console.log('✅ Updated song-playlist references');

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('✨ Database seeded successfully!');
        console.log('='.repeat(60));
        console.log('\n📊 Summary:');
        console.log(`   Database: ${mongoose.connection.name}`);
        console.log(`   Users: ${users.length}`);
        console.log(`   Songs: ${songs.length}`);
        console.log(`   Playlists: ${playlists.length}`);
        console.log('\n🔑 Test Account:');
        console.log('   Email: test@playlister.com');
        console.log('   Password: test123');
        console.log('\n💡 You can now start your backend server!');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB\n');
        process.exit(0);
    }
}

// Run the seed function
seedDatabase();