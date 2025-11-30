import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import PlaylistSearchSidebar from './PlaylistSearchSidebar';
import PlaylistList from './PlaylistList';
import PlayPlaylistModal from './PlayPlaylistModal';
import EditPlaylistModal from './EditPlaylistModal';
import ConfirmationModal from '../common/ConfirmationModal';
import { authAPI, playlistAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import './PlaylistsPage.css';

const PlaylistsPage = () => {
    const toast = useToast();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        playlistName: '',
        userName: '',
        songTitle: '',
        songArtist: '',
        songYear: ''
    });

    const [sortBy, setSortBy] = useState('listeners-hi-lo');
    const [playingPlaylist, setPlayingPlaylist] = useState(null);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [deletingPlaylist, setDeletingPlaylist] = useState(null);

    // Get current user from localStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);
    }, []);

    // Fetch playlists from API
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await playlistAPI.getAll({ ...filters, sortBy });
                setPlaylists(data.playlists || []);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch playlists:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [filters, sortBy]);

    const handleSearch = () => {
        // Filters already trigger useEffect
    };

    const handleClear = () => {
        setFilters({
            playlistName: '',
            userName: '',
            songTitle: '',
            songArtist: '',
            songYear: ''
        });
    };

    const handleNewPlaylist = async () => {
        if (!user) {
            toast.error('Please login to create playlists');
            return;
        }

        const name = prompt('Enter playlist name:');
        if (!name) return;

        try {
            await playlistAPI.create({ name, isPublic: true });
            // Refresh playlists
            const data = await playlistAPI.getAll({ ...filters, sortBy });
            setPlaylists(data.playlists || []);
            toast.success(`Playlist "${name}" created successfully`);
        } catch (err) {
            toast.error(err.message || 'Failed to create playlist');
        }
    };

    const handleCopyPlaylist = async (playlistId) => {
        if (!user) {
            toast.error('Please login to copy playlists');
            return;
        }

        try {
            // Fetch the playlist to copy
            const { playlist } = await playlistAPI.getById(playlistId);

            // Create new playlist with copy name
            const copyName = `Copy of ${playlist.name}`;
            const newPlaylist = await playlistAPI.create({
                name: copyName,
                isPublic: playlist.isPublic
            });

            // Add all songs from original playlist to the new one
            for (const song of playlist.songs) {
                await playlistAPI.addSong(newPlaylist.playlist._id, song.songId);
            }

            // Refresh playlists
            const data = await playlistAPI.getAll({ ...filters, sortBy });
            setPlaylists(data.playlists || []);

            toast.success(`Playlist copied successfully as "${copyName}"`);
        } catch (err) {
            toast.error(err.message || 'Failed to copy playlist');
        }
    };

    const handleDeletePlaylist = async (playlist) => {
        try {
            await playlistAPI.delete(playlist._id);
            // Refresh playlists
            const data = await playlistAPI.getAll({ ...filters, sortBy });
            setPlaylists(data.playlists || []);
            setDeletingPlaylist(null);
            toast.success(`Playlist "${playlist.name}" deleted successfully`);
        } catch (err) {
            toast.error(err.message || 'Failed to delete playlist');
            setDeletingPlaylist(null);
        }
    };

    return (
        <div className="playlists-page">
            <Navbar user={user} currentPage="playlists" />

            <div className="playlists-content">
                <PlaylistSearchSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onSearch={handleSearch}
                    onClear={handleClear}
                />

                <PlaylistList
                    playlists={playlists}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    onPlay={setPlayingPlaylist}
                    onEdit={setEditingPlaylist}
                    onDelete={(playlist) => setDeletingPlaylist(playlist)}
                    onCopy={handleCopyPlaylist}
                    onNewPlaylist={handleNewPlaylist}
                    currentUser={user}
                />
            </div>

            {playingPlaylist && (
                <PlayPlaylistModal
                    playlist={playingPlaylist}
                    isOpen={!!playingPlaylist}
                    onClose={() => setPlayingPlaylist(null)}
                />
            )}

            {editingPlaylist && (
                <EditPlaylistModal
                    playlist={editingPlaylist}
                    isOpen={!!editingPlaylist}
                    onClose={() => setEditingPlaylist(null)}
                    onSave={async () => {
                        // Refresh playlists after save
                        try {
                            const data = await playlistAPI.getAll({ ...filters, sortBy });
                            setPlaylists(data.playlists || []);
                        } catch (err) {
                            console.error('Failed to refresh playlists:', err);
                        }
                    }}
                />
            )}

            {deletingPlaylist && (
                <ConfirmationModal
                    isOpen={!!deletingPlaylist}
                    onClose={() => setDeletingPlaylist(null)}
                    onConfirm={() => handleDeletePlaylist(deletingPlaylist)}
                    title="Delete playlist?"
                    message={`Are you sure you want to delete the ${deletingPlaylist.name} playlist?`}
                    warningText="Doing so means it will be permanently removed."
                    confirmButtonText="Delete Playlist"
                    cancelButtonText="Cancel"
                />
            )}
        </div>
    );
};

export default PlaylistsPage;