import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import './EditSongModal.css';

const EditSongModal = ({ song, isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState(song?.title || '');
    const [artist, setArtist] = useState(song?.artist || '');
    const [year, setYear] = useState(song?.year || '');
    const [youtubeId, setYoutubeId] = useState(song?.youtubeId || '');

    const handleSave = () => {
        onSave({
            ...song,
            title,
            artist,
            year,
            youtubeId
        });
    };

    const isFormValid = title && artist && year && youtubeId;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Song"
            headerColor="green"
            backgroundColor="green"
            maxWidth="600px"
        >
            <div className="edit-song-content">
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onClear={() => setTitle('')}
                />

                <Input
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    onClear={() => setArtist('')}
                />

                <Input
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    onClear={() => setYear('')}
                />

                <Input
                    placeholder="YouTube Id"
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    onClear={() => setYoutubeId('')}
                />

                <div className="edit-song-actions">
                    <Button
                        variant="light"
                        onClick={handleSave}
                        disabled={!isFormValid}
                    >
                        Complete
                    </Button>
                    <Button
                        variant="dark"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditSongModal;