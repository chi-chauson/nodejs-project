import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { songAPI } from '../../services/api';
import './EditSongModal.css';

const EditSongModal = ({ song, isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [year, setYear] = useState('');
    const [youtubeId, setYoutubeId] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isNewSong = !song || !song._id;

    // Update form when song prop changes
    useEffect(() => {
        if (song) {
            setTitle(song.title || '');
            setArtist(song.artist || '');
            setYear(song.year?.toString() || '');
            setYoutubeId(song.youtubeId || '');
            setDuration(song.duration || '');
        } else {
            // Reset for new song
            setTitle('');
            setArtist('');
            setYear('');
            setYoutubeId('');
            setDuration('');
        }
        setError('');
    }, [song, isOpen]);

    const validateYouTubeId = (id) => {
        // YouTube IDs are typically 11 characters long
        // Can contain letters, numbers, hyphens, and underscores
        const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
        return youtubeIdRegex.test(id);
    };

    const validateDuration = (dur) => {
        // Format: MM:SS or M:SS
        const durationRegex = /^\d{1,2}:\d{2}$/;
        return durationRegex.test(dur);
    };

    const handleSave = async () => {
        setError('');

        // Validation
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (!artist.trim()) {
            setError('Artist is required');
            return;
        }

        const yearNum = parseInt(year);
        if (!year || isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            setError('Please enter a valid year');
            return;
        }

        if (!youtubeId.trim()) {
            setError('YouTube ID is required');
            return;
        }

        if (!validateYouTubeId(youtubeId)) {
            setError('YouTube ID must be 11 characters (letters, numbers, - and _ only)');
            return;
        }

        if (duration && !validateDuration(duration)) {
            setError('Duration must be in format MM:SS (e.g., 3:45)');
            return;
        }

        setLoading(true);

        try {
            const songData = {
                title: title.trim(),
                artist: artist.trim(),
                year: yearNum,
                youtubeId: youtubeId.trim(),
                duration: duration.trim() || '0:00'
            };

            if (isNewSong) {
                // Create new song
                await songAPI.create(songData);
            } else {
                // Update existing song
                await songAPI.update(song._id, songData);
            }

            // Notify parent to refresh
            onSave();
            onClose();
        } catch (err) {
            setError(err.message || `Failed to ${isNewSong ? 'create' : 'update'} song`);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = title && artist && year && youtubeId;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isNewSong ? 'Add New Song' : 'Edit Song'}
            headerColor="green"
            backgroundColor="green"
            maxWidth="600px"
        >
            <div className="edit-song-content">
                {error && (
                    <div className="edit-error" style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}

                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onClear={() => setTitle('')}
                    disabled={loading}
                />

                <Input
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    onClear={() => setArtist('')}
                    disabled={loading}
                />

                <Input
                    placeholder="Year (e.g., 1999)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    onClear={() => setYear('')}
                    disabled={loading}
                />

                <Input
                    placeholder="YouTube ID (11 characters, e.g., dQw4w9WgXcQ)"
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    onClear={() => setYoutubeId('')}
                    disabled={loading}
                />

                <Input
                    placeholder="Duration (MM:SS, e.g., 3:45)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    onClear={() => setDuration('')}
                    disabled={loading}
                />

                <div className="edit-song-actions">
                    <Button
                        variant="light"
                        onClick={handleSave}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? 'Saving...' : 'Complete'}
                    </Button>
                    <Button
                        variant="dark"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditSongModal;