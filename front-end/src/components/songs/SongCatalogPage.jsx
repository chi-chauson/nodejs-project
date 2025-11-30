import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import SongSearchSidebar from './SongSearchSidebar';
import SongList from './SongList';
import EditSongModal from './EditSongModal';
import ConfirmationModal from '../common/ConfirmationModal';
import { authAPI, songAPI, playlistAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import './SongCatalogPage.css';

const SongCatalogPage = () => {
    const toast = useToast();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        title: '',
        artist: '',
        year: ''
    });

    const [sortBy, setSortBy] = useState('listens-hi-lo');
    const [editingSong, setEditingSong] = useState(null);
    const [removingSong, setRemovingSong] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState([]);

    // Get current user from localStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);
    }, []);

    // Fetch user's playlists
    useEffect(() => {
        const fetchUserPlaylists = async () => {
            if (!user) {
                setUserPlaylists([]);
                return;
            }

            try {
                const data = await playlistAPI.getAll();
                // Filter to only user's own playlists
                const myPlaylists = (data.playlists || [])
                    .filter(p => p.username === user.username)
                    .map(p => ({ id: p._id, name: p.name }));
                setUserPlaylists(myPlaylists);
            } catch (err) {
                console.error('Failed to fetch user playlists:', err);
                setUserPlaylists([]);
            }
        };

        fetchUserPlaylists();
    }, [user]);

    // Fetch songs from API
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await songAPI.getAll({ ...filters, sortBy });
                setSongs(data.songs || []);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch songs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [filters, sortBy]);

    const handleSearch = () => {
        // Filters already trigger useEffect
    };

    const handleClear = () => {
        setFilters({
            title: '',
            artist: '',
            year: ''
        });
    };

    const handleNewSong = async () => {
        if (!user) {
            toast.error('Please login to add songs');
            return;
        }
        // Open modal with null song to create a new one
        setEditingSong({});
    };

    const handleAddToPlaylist = async (songId, playlistId) => {
        if (!user) {
            toast.error('Please login to add songs to playlists');
            return;
        }

        try {
            await playlistAPI.addSong(playlistId, songId);
            const playlist = userPlaylists.find(p => p.id === playlistId);
            toast.success(`Song added to "${playlist?.name || 'playlist'}" successfully!`);
        } catch (err) {
            // Check if it's a duplicate song error
            if (err.message?.includes('already in playlist')) {
                toast.error('This song is already in that playlist');
            } else {
                toast.error(err.message || 'Failed to add song to playlist');
            }
        }
    };

    const handleRemoveFromCatalog = async (song) => {
        try {
            await songAPI.delete(song._id);
            // Refresh songs
            const data = await songAPI.getAll({ ...filters, sortBy });
            setSongs(data.songs || []);
            setRemovingSong(null);
            toast.success('Song removed from catalog successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to remove song');
            setRemovingSong(null);
        }
    };

    return (
        <div className="song-catalog-page">
            <Navbar user={user} currentPage="songs" />

            <div className="song-catalog-content">
                <SongSearchSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onSearch={handleSearch}
                    onClear={handleClear}
                />

                <SongList
                    songs={songs}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    onEdit={setEditingSong}
                    onAddToPlaylist={handleAddToPlaylist}
                    onRemove={(song) => setRemovingSong(song)}
                    onNewSong={handleNewSong}
                    userPlaylists={userPlaylists}
                />
            </div>

            {editingSong && (
                <EditSongModal
                    song={editingSong}
                    isOpen={!!editingSong}
                    onClose={() => setEditingSong(null)}
                    onSave={async () => {
                        // Refresh songs list after save
                        try {
                            const data = await songAPI.getAll({ ...filters, sortBy });
                            setSongs(data.songs || []);
                        } catch (err) {
                            console.error('Failed to refresh songs:', err);
                        }
                        setEditingSong(null);
                    }}
                />
            )}

            {removingSong && (
                <ConfirmationModal
                    isOpen={!!removingSong}
                    onClose={() => setRemovingSong(null)}
                    onConfirm={() => handleRemoveFromCatalog(removingSong)}
                    title="Remove Song?"
                    message="Are you sure you want to remove the song from the catalog?"
                    warningText="Doing so will remove it from all of your playlists."
                    confirmButtonText="Remove Song"
                    cancelButtonText="Cancel"
                />
            )}
        </div>
    );
};

export default SongCatalogPage;