const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Playlist name is required'],
        trim: true,
        maxlength: [100, 'Playlist name must be less than 100 characters']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    songs: [{
        songId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        youtubeId: {
            type: String,
            required: false
        },
        duration: {
            type: String,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        order: {
            type: Number,
            required: true
        }
    }],
    playlistListeners: [{  // Renamed from 'listeners' to avoid reserved keyword
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
        },
        playCount: {
            type: Number,
            default: 1
        }
    }],
    listenersCount: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

// Indexes
playlistSchema.index({ name: 'text' });
playlistSchema.index({ 'playlistListeners.userId': 1 });

module.exports = mongoose.model('Playlist', playlistSchema);