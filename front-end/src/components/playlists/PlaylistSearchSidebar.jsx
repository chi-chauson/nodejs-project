import React from 'react';
import { Search } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import './PlaylistSearchSidebar.css';

const PlaylistSearchSidebar = ({ filters, onFilterChange, onSearch, onClear }) => {
    const handleFilterChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <aside className="playlist-sidebar">
            <h2 className="sidebar-title">Playlists</h2>

            <div className="filter-group">
                <Input
                    placeholder="by Playlist Name"
                    value={filters.playlistName}
                    onChange={(e) => handleFilterChange('playlistName', e.target.value)}
                    onClear={() => handleFilterChange('playlistName', '')}
                />

                <Input
                    placeholder="by User Name"
                    value={filters.userName}
                    onChange={(e) => handleFilterChange('userName', e.target.value)}
                    onClear={() => handleFilterChange('userName', '')}
                />

                <Input
                    placeholder="by Song Title"
                    value={filters.songTitle}
                    onChange={(e) => handleFilterChange('songTitle', e.target.value)}
                    onClear={() => handleFilterChange('songTitle', '')}
                />

                <Input
                    placeholder="by Song Artist"
                    value={filters.songArtist}
                    onChange={(e) => handleFilterChange('songArtist', e.target.value)}
                    onClear={() => handleFilterChange('songArtist', '')}
                />

                <Input
                    placeholder="by Song Year"
                    value={filters.songYear}
                    onChange={(e) => handleFilterChange('songYear', e.target.value)}
                    onClear={() => handleFilterChange('songYear', '')}
                />
            </div>

            <div className="sidebar-actions">
                <Button
                    variant="primary"
                    onClick={onSearch}
                    icon={<Search size={18} />}
                >
                    Search
                </Button>
                <Button
                    variant="secondary"
                    onClick={onClear}
                >
                    Clear
                </Button>
            </div>
        </aside>
    );
};

export default PlaylistSearchSidebar;