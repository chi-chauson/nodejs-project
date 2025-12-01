const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const Song = require('../models/Song');

// GET /api/songs - Get all songs (with optional filters)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            title,
            artist,
            year,
            sortBy = 'listens-hi-lo'
        } = req.query;

        let query = {};

        // Apply filters
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (artist) {
            query.artist = { $regex: artist, $options: 'i' };
        }

        if (year) {
            query.year = parseInt(year);
        }

        // Determine sort order
        let sort = {};
        switch (sortBy) {
            case 'listens-lo-hi':
                sort = { listensCount: 1 };
                break;
            case 'title-a-z':
                sort = { title: 1 };
                break;
            case 'title-z-a':
                sort = { title: -1 };
                break;
            case 'listens-hi-lo':
            default:
                sort = { listensCount: -1 };
        }

        const songs = await Song.find(query).sort(sort);

        res.json({ songs });
    } catch (error) {
        console.error('Get songs error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch songs' } });
    }
});

// GET /api/songs/:id - Get specific song
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ error: { message: 'Song not found' } });
        }

        res.json({ song });
    } catch (error) {
        console.error('Get song error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch song' } });
    }
});

// POST /api/songs - Create new song
router.post('/', auth, async (req, res) => {
    try {
        const { title, artist, year, youtubeId, duration } = req.body;

        // Validation
        if (!title || !artist || !year || !youtubeId || !duration) {
            return res.status(400).json({
                error: { message: 'All fields are required: title, artist, year, youtubeId, duration' }
            });
        }

        // Check if YouTube ID already exists (this is the only uniqueness constraint)
        const existingYoutubeId = await Song.findOne({ youtubeId: youtubeId.trim() });
        if (existingYoutubeId) {
            return res.status(400).json({
                error: { message: 'A song with this YouTube ID already exists in catalog' }
            });
        }

        const song = new Song({
            title: title.trim(),
            artist: artist.trim(),
            year: parseInt(year),
            youtubeId: youtubeId.trim(),
            duration: duration.trim(),
            listens: [],
            listensCount: 0,
            playlists: [],
            playlistCount: 0,
            addedBy: req.userId
        });

        await song.save();

        res.status(201).json({
            message: 'Song added to catalog',
            song
        });
    } catch (error) {
        console.error('Create song error:', error);
        res.status(500).json({ error: { message: 'Failed to add song' } });
    }
});

// PUT /api/songs/:id - Update song
router.put('/:id', auth, async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ error: { message: 'Song not found' } });
        }

        // Only creator can edit (or implement admin role later)
        if (song.addedBy.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: { message: 'Not authorized to edit this song' } });
        }

        const { title, artist, year, youtubeId, duration } = req.body;

        if (title) song.title = title.trim();
        if (artist) song.artist = artist.trim();
        if (year) song.year = parseInt(year);
        if (youtubeId) song.youtubeId = youtubeId.trim();
        if (duration) song.duration = duration.trim();

        await song.save();

        res.json({
            message: 'Song updated successfully',
            song
        });
    } catch (error) {
        console.error('Update song error:', error);
        res.status(500).json({ error: { message: 'Failed to update song' } });
    }
});

// DELETE /api/songs/:id - Remove song from catalog
router.delete('/:id', auth, async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ error: { message: 'Song not found' } });
        }

        // Only creator can delete (or implement admin role later)
        if (song.addedBy.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: { message: 'Not authorized to delete this song' } });
        }

        // Remove from all playlists
        const Playlist = require('../models/Playlist');
        await Playlist.updateMany(
            { 'songs.songId': song._id },
            { $pull: { songs: { songId: song._id } } }
        );

        await Song.findByIdAndDelete(req.params.id);

        res.json({ message: 'Song removed from catalog' });
    } catch (error) {
        console.error('Delete song error:', error);
        res.status(500).json({ error: { message: 'Failed to remove song' } });
    }
});

// POST /api/songs/:id/listen - Record a song listen
router.post('/:id/listen', optionalAuth, async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ error: { message: 'Song not found' } });
        }

        // Use special guest ID for non-authenticated users
        const userId = req.userId || 'guest';
        const username = req.user?.username || 'Guest';

        // Check if user already listened
        const alreadyListened = song.listens.some(
            l => l.userId.toString() === userId.toString()
        );

        if (!alreadyListened) {
            song.listens.push({
                userId: userId,
                username: username,
                listenedAt: new Date()
            });
            song.listensCount += 1;
            await song.save();
        }

        res.json({
            message: 'Listen recorded',
            song
        });
    } catch (error) {
        console.error('Record listen error:', error);
        res.status(500).json({ error: { message: 'Failed to record listen' } });
    }
});

module.exports = router;