import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import SongCard from './SongCard';
import Button from '../common/Button';
import './SongList.css';

const SongList = ({
    songs,
    sortBy,
    onSortChange,
    onEdit,
    onCopy,
    onAddToPlaylist,
    onRemove,
    onNewSong,
    userPlaylists,
    currentUser
}) => {
    // We don't need a ref on the main container anymore
    // We need a ref for the "Sentinel" (the end of the list)
    const endOfListRef = useRef(null);
    const [isButtonDocked, setIsButtonDocked] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the end of the list is visible, dock the button
                setIsButtonDocked(entry.isIntersecting);
            },
            {
                root: null, // observe relative to viewport
                rootMargin: "0px",
                threshold: 0.1 // Trigger as soon as even 1px of the sentinel is visible
            }
        );

        if (endOfListRef.current) {
            observer.observe(endOfListRef.current);
        }

        return () => {
            if (endOfListRef.current) {
                observer.unobserve(endOfListRef.current);
            }
        };
    }, [songs]); // Re-attach if the list length changes dramatically

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
                        songData={song}
                        onEdit={() => onEdit(song)}
                        onCopy={() => onCopy(song)}
                        onAddToPlaylist={(playlistId) => onAddToPlaylist(song._id, playlistId)}
                        onRemove={() => onRemove(song)}
                        userPlaylists={userPlaylists}
                        currentUser={currentUser}
                    />
                ))}
            </div>

            {/* THE SENTINEL 
               This empty div marks the physical end of the song list.
               When this scrolls into view, the Observer triggers.
            */}
            <div ref={endOfListRef} style={{ height: '1px', width: '100%' }} />

            <div className={`button-container ${isButtonDocked ? 'docked-wrapper' : ''}`}>
                <Button
                    variant="primary"
                    size="large"
                    onClick={onNewSong}
                    icon={<Plus size={20} />}
                    className={`btn-new-song ${isButtonDocked ? 'btn-new-song-docked' : 'btn-new-song-floating'}`}
                >
                    New Song
                </Button>
            </div>
        </main>
    );
};

export default SongList;