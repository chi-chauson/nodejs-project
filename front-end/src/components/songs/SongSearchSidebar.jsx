import React from 'react';
import { Search } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import YouTubePlayer from './YouTubePlayer';
import './SongSearchSidebar.css';

const SongSearchSidebar = ({ filters, onFilterChange, onSearch, onClear }) => {
    const handleFilterChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <aside className="song-sidebar">
            <h2 className="sidebar-title">Songs Catalog</h2>

            <div className="filter-group">
                <Input
                    placeholder="by Title"
                    value={filters.title}
                    onChange={(e) => handleFilterChange('title', e.target.value)}
                    onClear={() => handleFilterChange('title', '')}
                />

                <Input
                    placeholder="by Artist"
                    value={filters.artist}
                    onChange={(e) => handleFilterChange('artist', e.target.value)}
                    onClear={() => handleFilterChange('artist', '')}
                />

                <Input
                    placeholder="by Year"
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    onClear={() => handleFilterChange('year', '')}
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
            </div>

            <div className="sidebar-player">
                <YouTubePlayer videoId="dQw4w9WgXcQ" />
            </div>
        </aside>
    );
};

export default SongSearchSidebar;