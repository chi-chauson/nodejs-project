import React, { useState } from 'react';
import { Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserDropdown from '../auth/UserDropdown';
import './Navbar.css';

const Navbar = ({ user, currentPage, onNavigate }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <button className="btn-home" onClick={handleHomeClick}>
                        <Home size={20} />
                    </button>
                    {currentPage !== 'home' && (
                        <>
                            <button
                                className={`btn-nav ${currentPage === 'playlists' ? 'active' : ''}`}
                                onClick={() => navigate('/playlists')}
                            >
                                Playlists
                            </button>
                            <button
                                className={`btn-nav ${currentPage === 'songs' ? 'active' : ''}`}
                                onClick={() => navigate('/songs')}
                            >
                                Song Catalog
                            </button>
                        </>
                    )}
                </div>

                <h1 className="navbar-title">The Playlister</h1>

                <div className="navbar-right">
                    <button
                        className="btn-user"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {user && user.avatar ? (
                            <span className="user-avatar">{user.avatar}</span>
                        ) : (
                            <User size={20} />
                        )}
                    </button>

                    {showDropdown && (
                        <UserDropdown
                            user={user}
                            onClose={() => setShowDropdown(false)}
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;