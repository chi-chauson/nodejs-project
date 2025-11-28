import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDropdown.css';

const UserDropdown = ({ user, onClose }) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        // Clear session storage
        sessionStorage.removeItem('userMode');
        sessionStorage.removeItem('currentUser');
        navigate('/');
        onClose();
    };

    if (!user) {
        return (
            <div className="user-dropdown" ref={dropdownRef}>
                <button
                    className="dropdown-item"
                    onClick={() => handleNavigation('/signin')}
                >
                    Login
                </button>
                <button
                    className="dropdown-item"
                    onClick={() => handleNavigation('/create-account')}
                >
                    Create Account
                </button>
            </div>
        );
    }

    return (
        <div className="user-dropdown" ref={dropdownRef}>
            <button
                className="dropdown-item"
                onClick={() => handleNavigation('/edit-account')}
            >
                Edit Account
            </button>
            <button
                className="dropdown-item"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default UserDropdown;