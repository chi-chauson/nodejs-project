import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import Button from '../common/Button';
import Footer from '../common/Footer';
import { authAPI } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleContinueAsGuest = () => {
        // Clear any existing auth
        authAPI.logout();
        navigate('/playlists');
    };

    const handleLogin = () => {
        navigate('/signin');
    };

    const handleCreateAccount = () => {
        navigate('/create-account');
    };

    return (
        <div className="home-page">
            <div className="home-content">
                <div className="home-icon">
                    <Music size={120} />
                </div>

                <h1 className="home-title">The Playlister</h1>

                <div className="home-actions">
                    <Button
                        variant="dark"
                        size="large"
                        onClick={handleContinueAsGuest}
                    >
                        Continue as Guest
                    </Button>

                    <Button
                        variant="dark"
                        size="large"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>

                    <Button
                        variant="dark"
                        size="large"
                        onClick={handleCreateAccount}
                    >
                        Create Account
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HomePage;