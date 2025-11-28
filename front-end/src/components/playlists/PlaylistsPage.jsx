import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import PlaylistSearchSidebar from './PlaylistSearchSidebar';
import PlaylistList from './PlaylistList';
import PlayPlaylistModal from './PlayPlaylistModal';
import EditPlaylistModal from './EditPlaylistModal';
import ConfirmationModal from '../common/ConfirmationModal';
import './PlaylistsPage.css';

const PlaylistsPage = () => {
    const [playlists, setPlaylists] = useState([
        {
            id: 1,
            name: "Don't be Rude",
            user: 'JoelDemo',
            listeners: 137,
            avatar: '🎵',
            songs: [
                { id: 1, title: 'Come Fly With Me', artist: 'Frank Sinatra', year: 1958, duration: '3:18' },
                { id: 2, title: 'Fast Train', artist: 'Solomon Burke', year: 1985, duration: '5:43' },
                { id: 3, title: 'Highway Star', artist: 'Deep Purple', year: 1982, duration: '6:05' }
            ]
        },
        {
            id: 2,
            name: 'Spacey',
            user: 'JoelDemo',
            listeners: 37,
            avatar: '🎸',
            songs: [
                { id: 4, title: 'Space Oddity', artist: 'David Bowie', year: 1969, duration: '5:18' },
                { id: 5, title: 'Rocket Man', artist: 'Elton John', year: 1972, duration: '4:41' }
            ]
        }
    ]);

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

    // Get current user from sessionStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userMode = sessionStorage.getItem('userMode');
        const currentUserData = sessionStorage.getItem('currentUser');

        if (userMode === 'loggedIn' && currentUserData) {
            setUser(JSON.parse(currentUserData));
        } else {
            setUser(null); // Guest mode
        }
    }, []);

    const handleSearch = () => {
        console.log('Search with filters:', filters);
        // TODO: Implement search logic
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

    const handleNewPlaylist = () => {
        console.log('Create new playlist');
        // TODO: Implement new playlist logic
    };

    const handleDeletePlaylist = (id) => {
        console.log('Delete playlist:', id);
        // TODO: Implement delete logic
        setDeletingPlaylist(null);
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
                    onCopy={(id) => console.log('Copy playlist:', id)}
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
                    onSave={(updated) => {
                        console.log('Save playlist:', updated);
                        setEditingPlaylist(null);
                    }}
                />
            )}

            {deletingPlaylist && (
                <ConfirmationModal
                    isOpen={!!deletingPlaylist}
                    onClose={() => setDeletingPlaylist(null)}
                    onConfirm={() => handleDeletePlaylist(deletingPlaylist.id)}
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