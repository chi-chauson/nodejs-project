import React from 'react';
import { Plus } from 'lucide-react';
import SongCard from './SongCard';
import Button from '../common/Button';
import './SongList.css';

const SongList = ({
    songs,
    sortBy,
    onSortChange,
    onEdit,
    onAddToPlaylist,
    onRemove,
    onNewSong,
    userPlaylists,
    currentUser
}) => {
    return (
        <main className="song-main">
            <div className="song-header">
                <div className="sort-controls">
                    <span className="sort-label">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="sort-select"
                    >
                        <option value="listens-hi-lo">Listens (Hi-Lo)</option>
                        <option value="listens-lo-hi">Listens (Lo-Hi)</option>
                        <option value="title-a-z">Title (A-Z)</option>
                        <option value="title-z-a">Title (Z-A)</option>
                    </select>
                </div>
                <span className="song-count">{songs.length} Songs</span>
            </div>

            <div className="song-list">
                {songs.map((song) => (
                    <SongCard
                        key={song._id}
                        song={song}
                        onEdit={() => onEdit(song)}
                        onAddToPlaylist={(playlistId) => onAddToPlaylist(song._id, playlistId)}
                        onRemove={() => onRemove(song)}
                        userPlaylists={userPlaylists}
                        currentUser={currentUser}
                    />
                ))}
            </div>

            <Button
                variant="primary"
                size="large"
                onClick={onNewSong}
                icon={<Plus size={20} />}
                className="btn-new-song"
            >
                New Song
            </Button>
        </main>
    );
};

export default SongList;