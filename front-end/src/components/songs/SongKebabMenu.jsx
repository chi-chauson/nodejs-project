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
                    <button
                        className="kebab-item"
                        onMouseEnter={() => setShowPlaylists(true)}
                        onMouseLeave={() => setShowPlaylists(false)}
                    >
                        Add to Playlist
                        <ChevronRight size={16} />

                        {showPlaylists && (
                            <div className="playlist-submenu">
                                {userPlaylists.map((playlist) => (
                                    <button
                                        key={playlist.id}
                                        className="playlist-item"
                                        onClick={() => handleAddToPlaylist(playlist.id)}
                                    >
                                        {playlist.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </button>

                    <button
                        className="kebab-item"
                        onClick={handleEdit}
                    >
                        Edit Song
                    </button>

                    <button
                        className="kebab-item"
                        onClick={handleRemove}
                    >
                        Remove from Catalog
                    </button>
                </div>
            )}
        </div>
    );
};

export default SongKebabMenu;