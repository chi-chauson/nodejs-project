import React, { useState, useEffect, useRef } from 'react';
import { Plus, Copy, X, Undo2, Redo2, GripVertical } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { playlistAPI, songAPI } from '../../services/api';
import './EditPlaylistModal.css';

const EditPlaylistModal = ({ playlist, isOpen, onClose, onSave }) => {
    const [playlistName, setPlaylistName] = useState(playlist?.name || '');
    const [songs, setSongs] = useState(playlist?.songs || []);
    const [availableSongs, setAvailableSongs] = useState([]);
    const [showAddSongModal, setShowAddSongModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Undo/Redo state
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Drag and drop state
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Auto-save flag
    const hasUnsavedChanges = useRef(false);
    const initialSongs = useRef([]);

    // Load available songs for adding
    useEffect(() => {
        if (isOpen) {
            const fetchSongs = async () => {
                try {
                    const data = await songAPI.getAll();
                    setAvailableSongs(data.songs || []);
                } catch (err) {
                    console.error('Failed to fetch songs:', err);
                }
            };
            fetchSongs();
        }
    }, [isOpen]);

    // Update local state when playlist prop changes and initialize history
    useEffect(() => {
        if (playlist) {
            setPlaylistName(playlist.name || '');
            const initial = playlist.songs || [];
            setSongs(initial);
            // Store initial songs for comparison on close
            initialSongs.current = initial;
            // Initialize history with the current song order
            setHistory([initial]);
            setHistoryIndex(0);
            hasUnsavedChanges.current = false;
        }
    }, [playlist]);

    // Helper function to add to history
    const addToHistory = (newSongs) => {
        // Remove any history after current index (for redo)
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newSongs);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        hasUnsavedChanges.current = true;
    };

    // Undo function
    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setSongs(history[newIndex]);
            hasUnsavedChanges.current = true;
        }
    };

    // Redo function
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setSongs(history[newIndex]);
            hasUnsavedChanges.current = true;
        }
    };

    const handleRemoveSong = (index) => {
        const newSongs = songs.filter((_, i) => i !== index);
        setSongs(newSongs);
        addToHistory(newSongs);
    };

    const handleDuplicateSong = (index) => {
        const songToDuplicate = songs[index];
        const newSongs = [...songs];
        // Insert the duplicate right after the original
        newSongs.splice(index + 1, 0, { ...songToDuplicate });
        setSongs(newSongs);
        addToHistory(newSongs);
    };

    const handleAddSong = (songToAdd) => {
        // Create a new song entry (duplicates are allowed)
        const newSong = {
            songId: songToAdd._id,
            title: songToAdd.title,
            artist: songToAdd.artist,
            year: songToAdd.year,
            youtubeUrl: songToAdd.youtubeUrl
        };
        const newSongs = [...songs, newSong];
        setSongs(newSongs);
        addToHistory(newSongs);
        setShowAddSongModal(false);
    };

    // Auto-save when closing
    const handleClose = async () => {
        if (!playlistName.trim()) {
            setError('Playlist name cannot be empty');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Save playlist name if changed
            if (playlistName !== playlist.name) {
                await playlistAPI.update(playlist._id, { name: playlistName });
            }

            // Save song changes if any modifications were made
            if (hasUnsavedChanges.current) {
                const currentSongIds = songs.map(song => song.songId);
                const initialSongIds = initialSongs.current.map(song => song.songId);

                // Count occurrences of each song in both arrays
                const countOccurrences = (arr) => {
                    const counts = {};
                    arr.forEach(id => {
                        counts[id] = (counts[id] || 0) + 1;
                    });
                    return counts;
                };

                const currentCounts = countOccurrences(currentSongIds);
                const initialCounts = countOccurrences(initialSongIds);

                // Determine which songs to add (including duplicates)
                const songsToAdd = [];
                for (const [songId, count] of Object.entries(currentCounts)) {
                    const initialCount = initialCounts[songId] || 0;
                    const addCount = count - initialCount;
                    for (let i = 0; i < addCount; i++) {
                        songsToAdd.push(songId);
                    }
                }

                // Determine which songs to remove (including duplicates)
                const songsToRemove = [];
                for (const [songId, count] of Object.entries(initialCounts)) {
                    const currentCount = currentCounts[songId] || 0;
                    const removeCount = count - currentCount;
                    for (let i = 0; i < removeCount; i++) {
                        songsToRemove.push(songId);
                    }
                }

                // Add new songs
                for (const songId of songsToAdd) {
                    await playlistAPI.addSong(playlist._id, songId);
                }

                // Remove deleted songs
                for (const songId of songsToRemove) {
                    await playlistAPI.removeSong(playlist._id, songId);
                }

                // Reorder all songs to match current order
                await playlistAPI.reorderSongs(playlist._id, currentSongIds);
            }

            // Notify parent to refresh
            onSave();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newSongs = [...songs];
        const draggedSong = newSongs[draggedIndex];

        // Remove from old position
        newSongs.splice(draggedIndex, 1);
        // Insert at new position
        newSongs.splice(dropIndex, 0, draggedSong);

        setSongs(newSongs);
        addToHistory(newSongs);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Edit Playlist"
                headerColor="green"
                backgroundColor="green"
                maxWidth="800px"
            >
                <div className="edit-playlist-content">
                    {error && (
                        <div className="edit-error" style={{ color: 'red', marginBottom: '10px' }}>
                            {error}
                        </div>
                    )}

                    <div className="playlist-name-section">
                        <Input
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            onClear={() => setPlaylistName('')}
                            placeholder="Playlist Name"
                            disabled={loading}
                        />
                        <Button
                            variant="primary"
                            icon={<Plus size={18} />}
                            onClick={() => setShowAddSongModal(true)}
                            disabled={loading}
                        >
                            Add Song
                        </Button>
                    </div>

                    <div className="song-list-edit">
                        {songs.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '20px', opacity: 0.6 }}>
                                No songs in this playlist yet. Click "Add Song" to get started!
                            </p>
                        ) : (
                            songs.map((song, index) => (
                                <div
                                    key={`${song.songId}-${index}`}
                                    className={`song-item-edit ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className="drag-handle" title="Drag to reorder">
                                        <GripVertical size={20} />
                                    </div>
                                    <span className="song-info">
                                        {index + 1}. {song.title} by {song.artist} ({song.year})
                                    </span>
                                    <div className="song-actions">
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleDuplicateSong(index)}
                                            title="Duplicate"
                                            disabled={loading}
                                        >
                                            <Copy size={20} />
                                        </button>
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleRemoveSong(index)}
                                            title="Remove"
                                            disabled={loading}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="edit-actions">
                        <div className="undo-redo">
                            <Button
                                variant="secondary"
                                icon={<Undo2 size={18} />}
                                onClick={handleUndo}
                                disabled={loading || historyIndex <= 0}
                                title="Undo"
                            >
                                Undo
                            </Button>
                            <Button
                                variant="secondary"
                                icon={<Redo2 size={18} />}
                                onClick={handleRedo}
                                disabled={loading || historyIndex >= history.length - 1}
                                title="Redo"
                            >
                                Redo
                            </Button>
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleClose}
                            disabled={loading}
                            className="close-button-green"
                        >
                            {loading ? 'Saving...' : 'Close'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Add Song Modal */}
            {showAddSongModal && (
                <Modal
                    isOpen={showAddSongModal}
                    onClose={() => setShowAddSongModal(false)}
                    title="Add Song to Playlist"
                    headerColor="blue"
                    backgroundColor="blue"
                    maxWidth="600px"
                >
                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '4px'
                    }}>
                        {availableSongs.map(song => (
                            <div
                                key={song._id}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ccc',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <span>
                                    {song.title} by {song.artist} ({song.year})
                                </span>
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={() => handleAddSong(song)}
                                    disabled={loading}
                                >
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default EditPlaylistModal;