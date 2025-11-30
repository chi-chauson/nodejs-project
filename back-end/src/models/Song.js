const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Song title is required'],
        trim: true
    },
    artist: {
        type: String,
        required: [true, 'Artist is required'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1900, 'Year must be 1900 or later'],
        max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    youtubeId: {
        type: String,
        required: [true, 'YouTube ID is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    listens: [{
        userId: {
            type: mongoose.Schema.Types.Mixed,  // Allow both ObjectId and 'guest' string
            required: true
        },
        username: {
            type: String,
            required: true
        },
        listenedAt: {
            type: Date,
            default: Date.now
        }
    }],
    listensCount: {
        type: Number,
        default: 0
    },
    playlists: [{
        playlistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist',
            required: true
        },
        playlistName: {
            type: String,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    playlistCount: {
        type: Number,
        default: 0
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes
songSchema.index({ title: 'text', artist: 'text' });
songSchema.index({ artist: 1, year: 1 });
songSchema.index({ 'listens.userId': 1 });
songSchema.index({ 'playlists.playlistId': 1 });

module.exports = mongoose.model('Song', songSchema);