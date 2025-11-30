import React from 'react';
import SongKebabMenu from './SongKebabMenu';
import './SongCard.css';

const SongCard = ({ song, onEdit, onAddToPlaylist, onRemove, userPlaylists, currentUser }) => {
    // Check if current user owns this song
    const isOwner = currentUser && song.addedBy === currentUser._id;

    return (
        <div className={`song-card ${isOwner ? 'song-card-owned' : ''}`}>
            <div className="song-info">
                <h3 className="song-title">
                    {song.title} by {song.artist} ({song.year})
                </h3>
                <div className="song-stats">
                    <span>Listens: {song.listensCount?.toLocaleString() || 0}</span>
                    <span>Playlists: {song.playlistCount || 0}</span>
                </div>
            </div>

            <SongKebabMenu
                song={song}
                onEdit={onEdit}
                onAddToPlaylist={onAddToPlaylist}
                onRemove={() => onRemove(song)}
                userPlaylists={userPlaylists}
                isOwner={isOwner}
            />
        </div>
    );
};

export default SongCard;