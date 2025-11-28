import React from 'react';
import { Plus } from 'lucide-react';
import PlaylistCard from './PlaylistCard';
import Button from '../common/Button';
import './PlaylistList.css';

const PlaylistList = ({
    playlists,
    sortBy,
    onSortChange,
    onPlay,
    onEdit,
    onDelete,
    onCopy,
    onNewPlaylist,
    currentUser
}) => {
    return (
        <main className="playlist-main">
            <div className="playlist-header">
                <div className="sort-controls">
                    <span className="sort-label">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="sort-select"
                    >
                        <option value="listeners-hi-lo">Listeners (Hi-Lo)</option>
                        <option value="listeners-lo-hi">Listeners (Lo-Hi)</option>
                        <option value="name-a-z">Name (A-Z)</option>
                        <option value="name-z-a">Name (Z-A)</option>
                    </select>
                </div>
                <span className="playlist-count">{playlists.length} Playlists</span>
            </div>

            <div className="playlist-list">
                {playlists.map((playlist) => (
                    <PlaylistCard
                        key={playlist.id}
                        playlist={playlist}
                        onPlay={() => onPlay(playlist)}
                        onEdit={() => onEdit(playlist)}
                        onDelete={() => onDelete(playlist.id)}
                        onCopy={() => onCopy(playlist.id)}
                        canEdit={currentUser && playlist.user === currentUser.name}
                    />
                ))}
            </div>

            <Button
                variant="primary"
                size="large"
                onClick={onNewPlaylist}
                icon={<Plus size={20} />}
                className="btn-new-playlist"
            >
                New Playlist
            </Button>
        </main>
    );
};

export default PlaylistList;