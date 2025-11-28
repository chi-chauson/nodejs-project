import React from 'react';
import SongKebabMenu from './SongKebabMenu';
import './SongCard.css';

const SongCard = ({ song, onEdit, onAddToPlaylist, onRemove, userPlaylists }) => {
    return (
        <div className="song-card">
            <div className="song-info">
                <h3 className="song-title">
                    {song.title} by {song.artist} ({song.year})
                </h3>
                <div className="song-stats">
                    <span>Listens: {song.listens.toLocaleString()}</span>
                    <span>Playlists: {song.playlists}</span>
                </div>
            </div>

            <SongKebabMenu
                song={song}
                onEdit={onEdit}
                onAddToPlaylist={onAddToPlaylist}
                onRemove={() => onRemove(song)}
                userPlaylists={userPlaylists}
            />
        </div>
    );
};

export default SongCard;