import React, { useState } from 'react';
import Button from '../common/Button';
import './PlaylistCard.css';

const PlaylistCard = ({ playlist, onPlay, onEdit, onDelete, onCopy, canEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="playlist-card">
            <div className="playlist-card-header">
                <div className="playlist-info">
                    <div className="playlist-avatar">
                        {playlist.avatar}
                    </div>
                    <div className="playlist-details">
                        <h3 className="playlist-name">{playlist.name}</h3>
                        <p className="playlist-user">{playlist.username}</p>
                        <p className="playlist-listeners">{playlist.listenersCount} Listeners</p>
                    </div>
                </div>

                <div className="playlist-actions">
                    {canEdit && (
                        <>
                            <Button variant="delete" size="small" onClick={() => onDelete(playlist)}>
                                Delete
                            </Button>
                            <Button variant="edit" size="small" onClick={onEdit}>
                                Edit
                            </Button>
                        </>
                    )}
                    <Button variant="copy" size="small" onClick={onCopy}>
                        Copy
                    </Button>
                    <Button variant="play" size="small" onClick={onPlay}>
                        Play
                    </Button>
                    <button
                        className="btn-expand"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? '∧' : '∨'}
                    </button>
                </div>
            </div>

            {isExpanded && playlist.songs && playlist.songs.length > 0 && (
                <div className="playlist-songs-expanded">
                    {playlist.songs.map((song, index) => (
                        <div key={song.songId || song._id} className="playlist-song-item">
                            <span className="song-number">{index + 1}.</span>
                            <span className="song-details">
                                {song.title} by {song.artist} ({song.year})
                            </span>
                            {song.duration && (
                                <span className="song-duration">{song.duration}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistCard;