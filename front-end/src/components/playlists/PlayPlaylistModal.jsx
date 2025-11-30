import React, { useState, useEffect, useRef } from 'react';
import { Play, SkipBack, SkipForward } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { playlistAPI, songAPI } from '../../services/api';
import './PlayPlaylistModal.css';

const PlayPlaylistModal = ({ playlist, isOpen, onClose }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [playRecorded, setPlayRecorded] = useState(false);
    const [listenedSongs, setListenedSongs] = useState(new Set());
    const [autoplay, setAutoplay] = useState(true);
    const [loop, setLoop] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const playerRef = useRef(null);
    const playerInstanceRef = useRef(null);
    const autoplayRef = useRef(autoplay);
    const loopRef = useRef(loop);
    const currentSongIndexRef = useRef(currentSongIndex);

    // Keep refs in sync with state
    useEffect(() => {
        autoplayRef.current = autoplay;
        loopRef.current = loop;
        currentSongIndexRef.current = currentSongIndex;
    }, [autoplay, loop, currentSongIndex]);

    // Record playlist play when modal opens
    useEffect(() => {
        if (isOpen && playlist && !playRecorded) {
            const recordPlay = async () => {
                try {
                    await playlistAPI.recordPlay(playlist._id);
                    setPlayRecorded(true);
                } catch (err) {
                    console.error('Failed to record play:', err);
                    // Don't show error to user - this is a background operation
                }
            };
            recordPlay();
        }

        // Reset when modal closes
        if (!isOpen) {
            setPlayRecorded(false);
            setCurrentSongIndex(0);
            setListenedSongs(new Set());
            setPlayerReady(false);
        }
    }, [isOpen, playlist, playRecorded]);

    // Record song listen when current song changes
    useEffect(() => {
        if (isOpen && playlist?.songs && playlist.songs[currentSongIndex]) {
            const currentSong = playlist.songs[currentSongIndex];
            const songId = currentSong.songId;

            // Only record if we haven't already recorded this song in this session
            if (songId && !listenedSongs.has(songId)) {
                const recordListen = async () => {
                    try {
                        await songAPI.recordListen(songId);
                        setListenedSongs(prev => new Set([...prev, songId]));
                    } catch (err) {
                        console.error('Failed to record listen:', err);
                        // Silent failure - background operation
                    }
                };
                recordListen();
            }
        }
    }, [currentSongIndex, isOpen, playlist, listenedSongs]);

    // Load YouTube IFrame API and create player
    useEffect(() => {
        if (!isOpen || !playlist?.songs) return;

        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                createPlayer();
            };
        } else {
            createPlayer();
        }

        function createPlayer() {
            if (playerRef.current && !playerInstanceRef.current) {
                playerInstanceRef.current = new window.YT.Player(playerRef.current, {
                    videoId: playlist.songs[currentSongIndex]?.youtubeId || 'dQw4w9WgXcQ',
                    playerVars: {
                        autoplay: 1,
                        enablejsapi: 1,
                    },
                    events: {
                        onReady: () => {
                            setPlayerReady(true);
                        },
                        onError: (event) => {
                            console.error('YouTube player error:', event.data);
                            setPlayerReady(false);
                        },
                        onStateChange: (event) => {
                            // YT.PlayerState.ENDED = 0
                            if (event.data === 0 && autoplayRef.current) {
                                // Check if we're at the last song and loop is off
                                const isLastSong = currentSongIndexRef.current === playlist.songs.length - 1;
                                if (isLastSong && !loopRef.current) {
                                    // Don't advance - stop at the end
                                    return;
                                }
                                handleNext();
                            }
                        }
                    }
                });
            }
        }

        // Cleanup
        return () => {
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
                playerInstanceRef.current = null;
            }
        };
    }, [isOpen]);

    // Update video when song changes
    useEffect(() => {
        if (playerReady &&
            playerInstanceRef.current &&
            typeof playerInstanceRef.current.loadVideoById === 'function' &&
            playlist?.songs[currentSongIndex]?.youtubeId) {
            try {
                playerInstanceRef.current.loadVideoById(playlist.songs[currentSongIndex].youtubeId);
            } catch (error) {
                console.error('Failed to load video:', error);
                // Reset playerReady if the player is not actually ready
                setPlayerReady(false);
            }
        }
    }, [currentSongIndex, playlist, playerReady]);

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
                        <div className="playlist-avatar">
                            {playlist.avatar}
                        </div>
                        <div>
                            <h3>{playlist.name}</h3>
                            <p>{playlist.username}</p>
                        </div>
                    </div>

                    <div className="song-list">
                        {playlist.songs.map((song, index) => (
                            <div
                                key={song.songId || index}
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
                        <div ref={playerRef} style={{ width: '100%', height: '315px' }} />
                    </div>

                    <div className="player-controls">
                        <Button variant="light" onClick={handlePrevious}>
                            <SkipBack size={24} />
                        </Button>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={autoplay}
                                    onChange={(e) => setAutoplay(e.target.checked)}
                                />
                                <span>Autoplay</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={loop}
                                    onChange={(e) => setLoop(e.target.checked)}
                                />
                                <span>Loop</span>
                            </label>
                        </div>
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