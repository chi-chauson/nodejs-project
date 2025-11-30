import React, { useState, useEffect } from 'react';
import { Plus, Copy, X, ChevronUp, ChevronDown } from 'lucide-react';
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

    // Update local state when playlist prop changes
    useEffect(() => {
        if (playlist) {
            setPlaylistName(playlist.name || '');
            setSongs(playlist.songs || []);
        }
    }, [playlist]);

    const handleRemoveSong = async (song) => {
        setLoading(true);
        setError('');
        try {
            await playlistAPI.removeSong(playlist._id, song.songId);
            // Update local state
            setSongs(songs.filter(s => s.songId !== song.songId));
            // Notify parent to refresh
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to remove song');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSong = async (songToAdd) => {
        setLoading(true);
        setError('');
        try {
            await playlistAPI.addSong(playlist._id, songToAdd._id);
            // Fetch updated playlist to refresh local songs state
            const updatedPlaylist = await playlistAPI.getById(playlist._id);
            setSongs(updatedPlaylist.playlist.songs || []);
            // Notify parent to refresh
            onSave();
            setShowAddSongModal(false);
        } catch (err) {
            setError(err.message || 'Failed to add song');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        if (playlistName === playlist.name) {
            // No change, just close
            onClose();
            return;
        }

        if (!playlistName.trim()) {
            setError('Playlist name cannot be empty');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await playlistAPI.update(playlist._id, { name: playlistName });
            // Notify parent to refresh
            onSave();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update playlist');
        } finally {
            setLoading(false);
        }
    };

    const handleMoveSong = async (index, direction) => {
        // direction: 'up' or 'down'
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        // Validate bounds
        if (newIndex < 0 || newIndex >= songs.length) {
            return;
        }

        // Create new array with swapped songs
        const newSongs = [...songs];
        const temp = newSongs[index];
        newSongs[index] = newSongs[newIndex];
        newSongs[newIndex] = temp;

        // Update local state immediately for responsive UI
        setSongs(newSongs);

        // Send reorder request to backend
        setLoading(true);
        setError('');
        try {
            const songIds = newSongs.map(song => song.songId);
            await playlistAPI.reorderSongs(playlist._id, songIds);
            // Notify parent to refresh
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to reorder songs');
            // Revert on error
            setSongs(songs);
        } finally {
            setLoading(false);
        }
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
                                <div key={song.songId || index} className="song-item-edit">
                                    <span className="song-info">
                                        {index + 1}. {song.title} by {song.artist} ({song.year})
                                    </span>
                                    <div className="song-actions">
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleMoveSong(index, 'up')}
                                            title="Move Up"
                                            disabled={loading || index === 0}
                                        >
                                            <ChevronUp size={20} />
                                        </button>
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleMoveSong(index, 'down')}
                                            title="Move Down"
                                            disabled={loading || index === songs.length - 1}
                                        >
                                            <ChevronDown size={20} />
                                        </button>
                                        <button
                                            className="icon-btn"
                                            onClick={() => handleRemoveSong(song)}
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
                        <Button
                            variant="primary"
                            onClick={handleUpdateName}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save & Close'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
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
                                    disabled={loading || songs.some(s => s.songId === song._id)}
                                >
                                    {songs.some(s => s.songId === song._id) ? 'Added' : 'Add'}
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