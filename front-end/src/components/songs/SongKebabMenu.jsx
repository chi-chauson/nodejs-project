import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronRight } from 'lucide-react';
import './SongKebabMenu.css';

const SongKebabMenu = ({ song, onEdit, onAddToPlaylist, onRemove, userPlaylists }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowPlaylists(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddToPlaylist = (playlistId) => {
        onAddToPlaylist(playlistId);
        setIsOpen(false);
        setShowPlaylists(false);
    };

    const handleEdit = () => {
        onEdit();
        setIsOpen(false);
    };

    const handleRemove = () => {
        onRemove();
        setIsOpen(false);
    };

    return (
        <div className="kebab-menu" ref={menuRef}>
            <button
                className="kebab-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <MoreVertical size={20} />
            </button>

            {isOpen && (
                <div className="kebab-dropdown">
                    <div
                        className="kebab-item"
                        onMouseEnter={() => setShowPlaylists(true)}
                        onMouseLeave={() => setShowPlaylists(false)}
                    >
                        Add to Playlist
                        <ChevronRight size={16} />

                        {showPlaylists && (
                            <div className="playlist-submenu">
                                {!userPlaylists || userPlaylists.length === 0 ? (
                                    <div className="playlist-item" style={{ opacity: 0.6 }}>
                                        No playlists available
                                    </div>
                                ) : (
                                    userPlaylists.map((playlist) => (
                                        <div
                                            key={playlist.id}
                                            className="playlist-item"
                                            onClick={() => {
                                                handleAddToPlaylist(playlist.id);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    handleAddToPlaylist(playlist.id);
                                                }
                                            }}
                                        >
                                            {playlist.name || 'Unnamed Playlist'}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        className="kebab-item"
                        onClick={handleEdit}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleEdit();
                            }
                        }}
                    >
                        Edit Song
                    </div>

                    <div
                        className="kebab-item"
                        onClick={handleRemove}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleRemove();
                            }
                        }}
                    >
                        Remove from Catalog
                    </div>
                </div>
            )}
        </div>
    );
};

export default SongKebabMenu;