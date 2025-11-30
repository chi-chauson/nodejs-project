require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

// Sample base64 avatar (small 1x1 pixel transparent PNG)
const DEFAULT_AVATAR = '🎵';

// Check if --clean flag is passed
const isCleanOnly = process.argv.includes('--clean');

async function cleanDatabase() {
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Song.deleteMany({});
    await Playlist.deleteMany({});
    console.log('✅ Cleared existing collections');
}

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Always clean first
        await cleanDatabase();

        // If --clean flag, stop here
        if (isCleanOnly) {
            console.log('\n✨ Database cleaned successfully!');
            console.log('💡 Run "npm run seed" to populate with test data.\n');
            await mongoose.connection.close();
            console.log('Disconnected from MongoDB\n');
            process.exit(0);
            return;
        }

        // Create Users
        console.log('\n👤 Creating users...');
        const hashedPassword = await bcrypt.hash('test123', 10);

        const users = await User.insertMany([
            {
                username: 'JoelDemo',
                email: 'test@playlister.com',
                passwordHash: hashedPassword,
                avatar: '🎸',
                playlistCount: 2
            },
            {
                username: 'AliceMusic',
                email: 'alice@playlister.com',
                passwordHash: hashedPassword,
                avatar: '🎤',
                playlistCount: 2
            },
            {
                username: 'BobRocks',
                email: 'bob@playlister.com',
                passwordHash: hashedPassword,
                avatar: '🎧',
                playlistCount: 1
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
                title: 'I Want It That Way',
                artist: 'Backstreet Boys',
                year: 1999,
                youtubeId: '4fndeDfaWCg',
                duration: '3:39',
                listens: [
                    {
                        userId: joelId,
                        username: 'JoelDemo',
                        listenedAt: new Date('2024-01-15')
                    }
                ],
                listensCount: 1,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId
            },
            {
                title: 'Highway Star',
                artist: 'Deep Purple',
                year: 1972,
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
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId
            },
            // 70s classics
            {
                title: 'Bohemian Rhapsody',
                artist: 'Queen',
                year: 1975,
                youtubeId: 'fJ9rUzIMcZQ',
                duration: '5:55',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: aliceId
            },
            {
                title: 'Stairway to Heaven',
                artist: 'Led Zeppelin',
                year: 1971,
                youtubeId: 'QkF3oxziUI4',
                duration: '8:02',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: aliceId
            },
            {
                title: 'Hotel California',
                artist: 'Eagles',
                year: 1977,
                youtubeId: '09839DpTctU',
                duration: '6:30',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: aliceId
            },
            {
                title: 'Dreams',
                artist: 'Fleetwood Mac',
                year: 1977,
                youtubeId: 'mrZRURcb1cM',
                duration: '4:17',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: bobId
            },
            {
                title: 'September',
                artist: 'Earth, Wind & Fire',
                year: 1978,
                youtubeId: 'Gs069dndIYk',
                duration: '3:35',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: bobId
            },
            // 80s classics
            {
                title: 'Sweet Child O Mine',
                artist: 'Guns N Roses',
                year: 1987,
                youtubeId: '1w7OgIMMRc4',
                duration: '5:56',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: bobId
            },
            {
                title: 'Livin on a Prayer',
                artist: 'Bon Jovi',
                year: 1986,
                youtubeId: 'lDK9QqIzhwk',
                duration: '4:09',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: aliceId
            },
            {
                title: 'Every Breath You Take',
                artist: 'The Police',
                year: 1983,
                youtubeId: 'OMOGaugKpzs',
                duration: '4:13',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: aliceId
            },
            {
                title: 'Billie Jean',
                artist: 'Michael Jackson',
                year: 1982,
                youtubeId: 'Zi_XLOBDo_Y',
                duration: '4:54',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: bobId
            },
            {
                title: 'Take On Me',
                artist: 'a-ha',
                year: 1985,
                youtubeId: 'djV11Xbc914',
                duration: '3:46',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: joelId
            },
            // 90s classics
            {
                title: 'Smells Like Teen Spirit',
                artist: 'Nirvana',
                year: 1991,
                youtubeId: 'hTWKbfoikeg',
                duration: '5:01',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: bobId
            },
            {
                title: 'Wonderwall',
                artist: 'Oasis',
                year: 1995,
                youtubeId: 'bx1Bh8ZvH84',
                duration: '4:18',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: aliceId
            },
            {
                title: 'Under the Bridge',
                artist: 'Red Hot Chili Peppers',
                year: 1991,
                youtubeId: 'lwlogyj7nFE',
                duration: '4:24',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: bobId
            },
            {
                title: 'Black Hole Sun',
                artist: 'Soundgarden',
                year: 1994,
                youtubeId: '3mbBbFH9fAg',
                duration: '5:18',
                listens: [],
                listensCount: 0,
                playlists: [],
                playlistCount: 0,
                addedBy: aliceId
            },
            {
                title: 'No Scrubs',
                artist: 'TLC',
                year: 1999,
                youtubeId: 'FrLequ6dUdM',
                duration: '3:34',
                listens: [],
                listensCount: 0,
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
                avatar: '🎸',
                songs: [
                    {
                        songId: songIds[0],
                        title: 'Come Fly With Me',
                        artist: 'Frank Sinatra',
                        year: 1958,
                        youtubeId: 'HmQq6yLe2ww',
                        duration: '3:18',
                        addedAt: new Date('2024-01-15'),
                        order: 1
                    },
                    {
                        songId: songIds[1],
                        title: 'I Want It That Way',
                        artist: 'Backstreet Boys',
                        year: 1999,
                        youtubeId: '4fndeDfaWCg',
                        duration: '3:39',
                        addedAt: new Date('2024-01-15'),
                        order: 2
                    },
                    {
                        songId: songIds[2],
                        title: 'Highway Star',
                        artist: 'Deep Purple',
                        year: 1972,
                        youtubeId: 'Wr9ie2J2690',
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
                listenersCount: 2,
                isPublic: true
            },
            {
                name: 'Spacey',
                userId: joelId,
                username: 'JoelDemo',
                avatar: '🎸',
                songs: [
                    {
                        songId: songIds[3],
                        title: 'Space Oddity',
                        artist: 'David Bowie',
                        year: 1969,
                        youtubeId: 'iYYRH4apXDo',
                        duration: '5:18',
                        addedAt: new Date('2024-01-16'),
                        order: 1
                    },
                    {
                        songId: songIds[4],
                        title: 'Rocket Man',
                        artist: 'Elton John',
                        year: 1972,
                        youtubeId: 'DtVBCG6ThDk',
                        duration: '4:41',
                        addedAt: new Date('2024-01-16'),
                        order: 2
                    }
                ],
                playlistListeners: [
                    {
                        userId: aliceId,
                        username: 'AliceMusic',
                        listenedAt: new Date('2024-01-18'),
                        playCount: 3
                    },
                    {
                        userId: bobId,
                        username: 'BobRocks',
                        listenedAt: new Date('2024-01-19'),
                        playCount: 1
                    }
                ],
                listenersCount: 2,
                isPublic: true
            },
            {
                name: '70s Gold',
                userId: aliceId,
                username: 'AliceMusic',
                avatar: '🎤',
                songs: [
                    {
                        songId: songIds[6],
                        title: 'Bohemian Rhapsody',
                        artist: 'Queen',
                        year: 1975,
                        youtubeId: 'fJ9rUzIMcZQ',
                        duration: '5:55',
                        addedAt: new Date('2024-01-17'),
                        order: 1
                    },
                    {
                        songId: songIds[7],
                        title: 'Stairway to Heaven',
                        artist: 'Led Zeppelin',
                        year: 1971,
                        youtubeId: 'QkF3oxziUI4',
                        duration: '8:02',
                        addedAt: new Date('2024-01-17'),
                        order: 2
                    },
                    {
                        songId: songIds[8],
                        title: 'Hotel California',
                        artist: 'Eagles',
                        year: 1977,
                        youtubeId: '09839DpTctU',
                        duration: '6:30',
                        addedAt: new Date('2024-01-17'),
                        order: 3
                    },
                    {
                        songId: songIds[4],
                        title: 'Rocket Man',
                        artist: 'Elton John',
                        year: 1972,
                        youtubeId: 'DtVBCG6ThDk',
                        duration: '4:41',
                        addedAt: new Date('2024-01-17'),
                        order: 4
                    }
                ],
                playlistListeners: [
                    {
                        userId: joelId,
                        username: 'JoelDemo',
                        listenedAt: new Date('2024-01-18'),
                        playCount: 3
                    },
                    {
                        userId: bobId,
                        username: 'BobRocks',
                        listenedAt: new Date('2024-01-19'),
                        playCount: 7
                    }
                ],
                listenersCount: 2,
                isPublic: true
            },
            {
                name: '80s Party Mix',
                userId: aliceId,
                username: 'AliceMusic',
                avatar: '🎤',
                songs: [
                    {
                        songId: songIds[12],
                        title: 'Livin on a Prayer',
                        artist: 'Bon Jovi',
                        year: 1986,
                        youtubeId: 'lDK9QqIzhwk',
                        duration: '4:09',
                        addedAt: new Date('2024-01-18'),
                        order: 1
                    },
                    {
                        songId: songIds[13],
                        title: 'Every Breath You Take',
                        artist: 'The Police',
                        year: 1983,
                        youtubeId: 'OMOGaugKpzs',
                        duration: '4:13',
                        addedAt: new Date('2024-01-18'),
                        order: 2
                    },
                    {
                        songId: songIds[14],
                        title: 'Billie Jean',
                        artist: 'Michael Jackson',
                        year: 1982,
                        youtubeId: 'Zi_XLOBDo_Y',
                        duration: '4:54',
                        addedAt: new Date('2024-01-18'),
                        order: 3
                    },
                    {
                        songId: songIds[15],
                        title: 'Take On Me',
                        artist: 'a-ha',
                        year: 1985,
                        youtubeId: 'djV11Xbc914',
                        duration: '3:46',
                        addedAt: new Date('2024-01-18'),
                        order: 4
                    }
                ],
                playlistListeners: [
                    {
                        userId: joelId,
                        username: 'JoelDemo',
                        listenedAt: new Date('2024-01-19'),
                        playCount: 2
                    }
                ],
                listenersCount: 1,
                isPublic: true
            },
            {
                name: '90s Grunge',
                userId: bobId,
                username: 'BobRocks',
                avatar: '🎧',
                songs: [
                    {
                        songId: songIds[16],
                        title: 'Smells Like Teen Spirit',
                        artist: 'Nirvana',
                        year: 1991,
                        youtubeId: 'hTWKbfoikeg',
                        duration: '5:01',
                        addedAt: new Date('2024-01-19'),
                        order: 1
                    },
                    {
                        songId: songIds[18],
                        title: 'Under the Bridge',
                        artist: 'Red Hot Chili Peppers',
                        year: 1991,
                        youtubeId: 'lwlogyj7nFE',
                        duration: '4:24',
                        addedAt: new Date('2024-01-19'),
                        order: 2
                    },
                    {
                        songId: songIds[19],
                        title: 'Black Hole Sun',
                        artist: 'Soundgarden',
                        year: 1994,
                        youtubeId: '3mbBbFH9fAg',
                        duration: '5:18',
                        addedAt: new Date('2024-01-19'),
                        order: 3
                    }
                ],
                playlistListeners: [
                    {
                        userId: joelId,
                        username: 'JoelDemo',
                        listenedAt: new Date('2024-01-20'),
                        playCount: 4
                    },
                    {
                        userId: aliceId,
                        username: 'AliceMusic',
                        listenedAt: new Date('2024-01-20'),
                        playCount: 6
                    }
                ],
                listenersCount: 2,
                isPublic: true
            }
        ]);

        const playlistIds = playlists.map(p => p._id);
        console.log(`✅ Created ${playlists.length} playlists`);

        // Update songs with playlist references
        console.log('\n🔗 Updating song-playlist references...');

        // Song 0: Come Fly With Me - in playlist 0
        await Song.findByIdAndUpdate(songIds[0], {
            playlists: [{ playlistId: playlistIds[0], playlistName: "Don't be Rude", addedAt: new Date('2024-01-15') }],
            playlistCount: 1
        });

        // Song 1: Fast Train - in playlist 0
        await Song.findByIdAndUpdate(songIds[1], {
            playlists: [{ playlistId: playlistIds[0], playlistName: "Don't be Rude", addedAt: new Date('2024-01-15') }],
            playlistCount: 1
        });

        // Song 2: Highway Star - in playlist 0
        await Song.findByIdAndUpdate(songIds[2], {
            playlists: [{ playlistId: playlistIds[0], playlistName: "Don't be Rude", addedAt: new Date('2024-01-15') }],
            playlistCount: 1
        });

        // Song 3: Space Oddity - in playlist 1
        await Song.findByIdAndUpdate(songIds[3], {
            playlists: [{ playlistId: playlistIds[1], playlistName: 'Spacey', addedAt: new Date('2024-01-16') }],
            playlistCount: 1
        });

        // Song 4: Rocket Man - in playlists 1 and 2
        await Song.findByIdAndUpdate(songIds[4], {
            playlists: [
                { playlistId: playlistIds[1], playlistName: 'Spacey', addedAt: new Date('2024-01-16') },
                { playlistId: playlistIds[2], playlistName: '70s Gold', addedAt: new Date('2024-01-17') }
            ],
            playlistCount: 2
        });

        // Song 6: Bohemian Rhapsody - in playlist 2
        await Song.findByIdAndUpdate(songIds[6], {
            playlists: [{ playlistId: playlistIds[2], playlistName: '70s Gold', addedAt: new Date('2024-01-17') }],
            playlistCount: 1
        });

        // Song 7: Stairway to Heaven - in playlist 2
        await Song.findByIdAndUpdate(songIds[7], {
            playlists: [{ playlistId: playlistIds[2], playlistName: '70s Gold', addedAt: new Date('2024-01-17') }],
            playlistCount: 1
        });

        // Song 8: Hotel California - in playlist 2
        await Song.findByIdAndUpdate(songIds[8], {
            playlists: [{ playlistId: playlistIds[2], playlistName: '70s Gold', addedAt: new Date('2024-01-17') }],
            playlistCount: 1
        });

        // Song 12: Livin on a Prayer - in playlist 3
        await Song.findByIdAndUpdate(songIds[12], {
            playlists: [{ playlistId: playlistIds[3], playlistName: '80s Party Mix', addedAt: new Date('2024-01-18') }],
            playlistCount: 1
        });

        // Song 13: Every Breath You Take - in playlist 3
        await Song.findByIdAndUpdate(songIds[13], {
            playlists: [{ playlistId: playlistIds[3], playlistName: '80s Party Mix', addedAt: new Date('2024-01-18') }],
            playlistCount: 1
        });

        // Song 14: Billie Jean - in playlist 3
        await Song.findByIdAndUpdate(songIds[14], {
            playlists: [{ playlistId: playlistIds[3], playlistName: '80s Party Mix', addedAt: new Date('2024-01-18') }],
            playlistCount: 1
        });

        // Song 15: Take On Me - in playlist 3
        await Song.findByIdAndUpdate(songIds[15], {
            playlists: [{ playlistId: playlistIds[3], playlistName: '80s Party Mix', addedAt: new Date('2024-01-18') }],
            playlistCount: 1
        });

        // Song 16: Smells Like Teen Spirit - in playlist 4
        await Song.findByIdAndUpdate(songIds[16], {
            playlists: [{ playlistId: playlistIds[4], playlistName: '90s Grunge', addedAt: new Date('2024-01-19') }],
            playlistCount: 1
        });

        // Song 18: Under the Bridge - in playlist 4
        await Song.findByIdAndUpdate(songIds[18], {
            playlists: [{ playlistId: playlistIds[4], playlistName: '90s Grunge', addedAt: new Date('2024-01-19') }],
            playlistCount: 1
        });

        // Song 19: Black Hole Sun - in playlist 4
        await Song.findByIdAndUpdate(songIds[19], {
            playlists: [{ playlistId: playlistIds[4], playlistName: '90s Grunge', addedAt: new Date('2024-01-19') }],
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