const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const User = require('../models/User');

// GET /api/playlists - Get all playlists (with optional filters)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            playlistName,
            userName,
            songTitle,
            songArtist,
            songYear,
            sortBy = 'listeners-hi-lo'
        } = req.query;

        let query = { isPublic: true };

        // Apply filters
        if (playlistName) {
            query.name = { $regex: playlistName, $options: 'i' };
        }

        if (userName) {
            query.username = { $regex: userName, $options: 'i' };
        }

        if (songTitle) {
            query['songs.title'] = { $regex: songTitle, $options: 'i' };
        }

        if (songArtist) {
            query['songs.artist'] = { $regex: songArtist, $options: 'i' };
        }

        if (songYear) {
            query['songs.year'] = parseInt(songYear);
        }

        // Determine sort order
        let sort = {};
        switch (sortBy) {
            case 'listeners-lo-hi':
                sort = { listenersCount: 1 };
                break;
            case 'name-a-z':
                sort = { name: 1 };
                break;
            case 'name-z-a':
                sort = { name: -1 };
                break;
            case 'listeners-hi-lo':
            default:
                sort = { listenersCount: -1 };
        }

        const playlists = await Playlist.find(query).sort(sort);

        res.json({ playlists });
    } catch (error) {
        console.error('Get playlists error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch playlists' } });
    }
});

// GET /api/playlists/:id - Get specific playlist
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({ error: { message: 'Playlist not found' } });
        }

        // Check if private and user is not owner
        if (!playlist.isPublic && (!req.userId || playlist.userId.toString() !== req.userId.toString())) {
            return res.status(403).json({ error: { message: 'Access denied' } });
        }

        res.json({ playlist });
    } catch (error) {
        console.error('Get playlist error:', error);
        res.status(500).json({ error: { message: 'Failed to fetch playlist' } });
    }
});

// POST /api/playlists - Create new playlist
router.post('/', auth, async (req, res) => {
    try {
        const { name, isPublic = true } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: { message: 'Playlist name is required' } });
        }

        const playlist = new Playlist({
            name: name.trim(),
            userId: req.userId,
            username: req.user.username,
            avatar: req.user.avatar,
            songs: [],
            playlistListeners: [],
            listenersCount: 0,
            isPublic
        });

        await playlist.save();

        // Update user's playlist count
        await User.findByIdAndUpdate(req.userId, { $inc: { playlistCount: 1 } });

        res.status(201).json({
            message: 'Playlist created successfully',
            playlist
        });
    } catch (error) {
        console.error('Create playlist error:', error);
        res.status(500).json({ error: { message: 'Failed to create playlist' } });
    }
});

// PUT /api/playlists/:id - Update playlist
router.put('/:id', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({ error: { message: 'Playlist not found' } });
        }

        // Check ownership
        if (playlist.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: { message: 'Not authorized to edit this playlist' } });
        }

        const { name, isPublic } = req.body;

        if (name) playlist.name = name.trim();
        if (isPublic !== undefined) playlist.isPublic = isPublic;

        await playlist.save();

        res.json({
            message: 'Playlist updated successfully',
            playlist
        });
    } catch (error) {
        console.error('Update playlist error:', error);
        res.status(500).json({ error: { message: 'Failed to update playlist' } });
    }
});

// DELETE /api/playlists/:id - Delete playlist
router.delete('/:id', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({ error: { message: 'Playlist not found' } });
        }

        // Check ownership
        if (playlist.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: { message: 'Not authorized to delete this playlist' } });
        }

        // Remove playlist from all songs
        const songIds = playlist.songs.map(s => s.songId);
        await Song.updateMany(
            { _id: { $in: songIds } },
            {
                $pull: { playlists: { playlistId: playlist._id } },
                $inc: { playlistCount: -1 }
            }
        );

        await Playlist.findByIdAndDelete(req.params.id);

        // Update user's playlist count
        await User.findByIdAndUpdate(req.userId, { $inc: { playlistCount: -1 } });

        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.error('Delete playlist error:', error);
        res.status(500).json({ error: { message: 'Failed to delete playlist' } });
    }
});

// POST /api/playlists/:id/songs - Add song to playlist
router.post('/:id/songs', auth, async (req, res) => {
    try {
        const { songId } = req.body;

        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: { message: 'Playlist not found' } });
        }

        // Check ownership
        if (playlist.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: { message: 'Not authorized to edit this playlist' } });
        }

        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ error: { message: 'Song not found' } });
        }

        // Note: Duplicates are allowed - same song can appear multiple times

        // Add song to playlist
        const order = playlist.songs.length + 1;
        playlist.songs.push({
            songId: song._id,
            title: song.title,
            artist: song.artist,
            year: song.year,
            youtubeId: song.youtubeId,
            duration: song.duration,
            order
        });

        await playlist.save();

        // Add playlist to song (only if not already there - first instance)
        const alreadyInSongPlaylists = song.playlists.some(
            p => p.playlistId.toString() === playlist._id.toString()
        );

        if (!alreadyInSongPlaylists) {
            song.playlists.push({
                playlistId: playlist._id,
                playlistName: playlist.name,
                addedAt: new Date()
            });
            song.playlistCount += 1;
            await song.save();
        }

        res.json({
            message: 'Song added to playlist',
            playlist
        });
    } catch (error) {
        console.error('Add song to playlist error:', error);
        res.status(500).json({ error: { message: 'Failed to add song to playlist' } });
    }
});

// DELETE /api/playlists/:id/songs/:songId - Remove song from playlist
router.delete('/:id/songs/:songId', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: { message: 'Playlist not found' } });
        }

        // Check ownership
        if (playlist.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: { message: 'Not authorized to edit this playlist' } });
        }

        // Remove only the FIRST instance of the song from playlist (to support duplicates)
        const songIndex = playlist.songs.findIndex(s => s.songId.toString() === req.params.songId);

        if (songIndex === -1) {
            return res.status(404).json({ error: { message: 'Song not found in playlist' } });
        }

        playlist.songs.splice(songIndex, 1);

        // Reorder remaining songs
        playlist.songs.forEach((song, index) => {
            song.order = index + 1;
        });

        await playlist.save();

        // Only update song's playlist count if this was the last instance in the playlist
        const stillInPlaylist = playlist.songs.some(s => s.songId.toString() === req.params.songId);
        if (!stillInPlaylist) {
            await Song.findByIdAndUpdate(req.params.songId, {
                $pull: { playlists: { playlistId: playlist._id } },
                $inc: { playlistCount: -1 }
            });
        }

        res.json({
            message: 'Song removed from playlist',
            playlist
        });
    } catch (error) {
        console.error('Remove song from playlist error:', error);
        res.status(500).json({ error: { message: 'Failed to remove song from playlist' } });
    }
});

// PUT /api/playlists/:id/songs/reorder - Reorder songs in playlist
router.put('/:id/songs/reorder', auth, async (req, res) => {
    try {
        const { songIds } = req.body;

        if (!Array.isArray(songIds)) {
            return res.status(400).json({ error: { message: 'songIds must be an array' } });
        }

        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: { message: 'Playlist not found' } });
        }

        // Check ownership
        if (playlist.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: { message: 'Not authorized to edit this playlist' } });
        }

        // Verify song count matches
        if (songIds.length !== playlist.songs.length) {
            return res.status(400).json({ error: { message: 'Song count mismatch' } });
        }

        // Create a pool of available songs (to handle duplicates)
        // We'll match each songId with an available song from the pool
        const availableSongs = [...playlist.songs];

        // Reorder songs based on provided songIds array
        const reorderedSongs = [];
        for (let i = 0; i < songIds.length; i++) {
            const songId = songIds[i];

            // Find the first available song with matching songId
            const songIndex = availableSongs.findIndex(s => s.songId.toString() === songId);

            if (songIndex === -1) {
                return res.status(400).json({ error: { message: `Song ${songId} not found in playlist or already used` } });
            }

            // Remove song from available pool and add to reordered array
            const song = availableSongs.splice(songIndex, 1)[0];

            // Update order
            song.order = i + 1;
            reorderedSongs.push(song);
        }

        playlist.songs = reorderedSongs;
        await playlist.save();

        res.json({
            message: 'Songs reordered successfully',
            playlist
        });
    } catch (error) {
        console.error('Reorder songs error:', error);
        res.status(500).json({ error: { message: 'Failed to reorder songs' } });
    }
});

// POST /api/playlists/:id/play - Record a playlist play
router.post('/:id/play', optionalAuth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: { message: 'Playlist not found' } });
        }

        // Use special guest ID for non-authenticated users
        const userId = req.userId || 'guest';
        const username = req.user?.username || 'Guest';

        // Find if user already listened
        const listenerIndex = playlist.playlistListeners.findIndex(
            l => l.userId.toString() === userId.toString()
        );

        if (listenerIndex >= 0) {
            // Increment play count
            playlist.playlistListeners[listenerIndex].playCount += 1;
            playlist.playlistListeners[listenerIndex].listenedAt = new Date();
        } else {
            // Add new listener
            playlist.playlistListeners.push({
                userId: userId,
                username: username,
                listenedAt: new Date(),
                playCount: 1
            });
            playlist.listenersCount += 1;
        }

        await playlist.save();

        res.json({
            message: 'Play recorded',
            playlist
        });
    } catch (error) {
        console.error('Record play error:', error);
        res.status(500).json({ error: { message: 'Failed to record play' } });
    }
});

module.exports = router;