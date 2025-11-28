import React, { useState } from 'react';
import { Play, SkipBack, SkipForward } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import './PlayPlaylistModal.css';

const PlayPlaylistModal = ({ playlist, isOpen, onClose }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    if (!playlist || !playlist.songs) return null;

    const currentSong = playlist.songs[currentSongIndex];

    const handlePrevious = () => {
        setCurrentSongIndex((prev) => (prev > 0 ? prev - 1 : playlist.songs.length - 1));
    };

    const handleNext = () => {
        setCurrentSongIndex((prev) => (prev < playlist.songs.length - 1 ? prev + 1 : 0));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Play Playlist"
            headerColor="green"
            backgroundColor="green"
            maxWidth="900px"
        >
            <div className="play-playlist-content">
                <div className="playlist-info-section">
                    <div className="playlist-header-info">
                        <div className="playlist-icon">{playlist.avatar}</div>
                        <div>
                            <h3>{playlist.name}</h3>
                            <p>{playlist.user}</p>
                        </div>
                    </div>

                    <div className="song-list">
                        {playlist.songs.map((song, index) => (
                            <div
                                key={song.id}
                                className={`song-item ${index === currentSongIndex ? 'active' : ''}`}
                                onClick={() => setCurrentSongIndex(index)}
                            >
                                {index + 1}. {song.title} by {song.artist} ({song.year})
                            </div>
                        ))}
                    </div>
                </div>

                <div className="player-section">
                    <div className="video-player">
                        <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="player-controls">
                        <Button variant="light" onClick={handlePrevious}>
                            <SkipBack size={24} />
                        </Button>
                        <Button variant="light">
                            <Play size={24} />
                        </Button>
                        <Button variant="light" onClick={handleNext}>
                            <SkipForward size={24} />
                        </Button>
                    </div>

                    <Button
                        variant="primary"
                        onClick={onClose}
                        className="close-button"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PlayPlaylistModal;