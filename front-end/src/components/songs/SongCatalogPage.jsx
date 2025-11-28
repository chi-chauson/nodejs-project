import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import SongSearchSidebar from './SongSearchSidebar';
import SongList from './SongList';
import EditSongModal from './EditSongModal';
import ConfirmationModal from '../common/ConfirmationModal';
import './SongCatalogPage.css';

const SongCatalogPage = () => {
    const [songs, setSongs] = useState([
        {
            id: 1,
            title: 'Fast Train',
            artist: 'Solomon Burke',
            year: 1985,
            youtubeId: 'dQw4w9WgXcQ',
            listens: 1234567,
            playlists: 123
        },
        {
            id: 2,
            title: 'I Wish I Knew',
            artist: 'Solomon Burke',
            year: 1968,
            youtubeId: 'dQw4w9WgXcQ',
            listens: 4567,
            playlists: 3
        }
    ]);

    const [filters, setFilters] = useState({
        title: '',
        artist: '',
        year: ''
    });

    const [sortBy, setSortBy] = useState('listens-hi-lo');
    const [editingSong, setEditingSong] = useState(null);
    const [removingSong, setRemovingSong] = useState(null);
    const [userPlaylists] = useState([
        { id: 1, name: 'All My Favorites' },
        { id: 2, name: 'Sad Songs I Like' },
        { id: 3, name: 'Seventies Roadtrip' }
    ]);

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
            title: '',
            artist: '',
            year: ''
        });
    };

    const handleNewSong = () => {
        console.log('Create new song');
        // TODO: Implement new song logic
    };

    const handleAddToPlaylist = (songId, playlistId) => {
        console.log('Add song', songId, 'to playlist', playlistId);
        // TODO: Implement add to playlist logic
    };

    const handleRemoveFromCatalog = (song) => {
        console.log('Remove song from catalog:', song.id);
        // TODO: Implement remove logic
        setRemovingSong(null);
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
                    onSave={(updated) => {
                        console.log('Save song:', updated);
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