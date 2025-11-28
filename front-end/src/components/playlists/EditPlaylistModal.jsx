import React, { useState } from 'react';
import { Plus, Copy, X, Undo, Redo } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import './EditPlaylistModal.css';

const EditPlaylistModal = ({ playlist, isOpen, onClose, onSave }) => {
    const [playlistName, setPlaylistName] = useState(playlist?.name || '');
    const [songs, setSongs] = useState(playlist?.songs || []);

    const handleRemoveSong = (songId) => {
        setSongs(songs.filter(song => song.id !== songId));
    };

    const handleCopySong = (song) => {
        console.log('Copy song:', song);
        // TODO: Implement copy song logic
    };

    const handleAddSong = () => {
        console.log('Add song');
        // TODO: Implement add song logic
    };

    const handleSave = () => {
        onSave({
            ...playlist,
            name: playlistName,
            songs
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Playlist"
            headerColor="green"
            backgroundColor="green"
            maxWidth="800px"
        >
            <div className="edit-playlist-content">
                <div className="playlist-name-section">
                    <Input
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        onClear={() => setPlaylistName('')}
                        placeholder="Playlist Name"
                    />
                    <Button
                        variant="primary"
                        icon={<Plus size={18} />}
                        onClick={handleAddSong}
                    >
                        Add Song
                    </Button>
                </div>

                <div className="song-list-edit">
                    {songs.map((song, index) => (
                        <div key={song.id} className="song-item-edit">
                            <span className="song-info">
                                {index + 1}. {song.title} by {song.artist} ({song.year})
                            </span>
                            <div className="song-actions">
                                <button
                                    className="icon-btn"
                                    onClick={() => handleCopySong(song)}
                                    title="Copy"
                                >
                                    <Copy size={20} />
                                </button>
                                <button
                                    className="icon-btn"
                                    onClick={() => handleRemoveSong(song.id)}
                                    title="Remove"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="edit-actions">
                    <div className="undo-redo">
                        <Button variant="secondary" icon={<Undo size={18} />}>
                            Undo
                        </Button>
                        <Button variant="secondary" icon={<Redo size={18} />}>
                            Redo
                        </Button>
                    </div>
                    <Button variant="primary" onClick={handleSave}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditPlaylistModal;