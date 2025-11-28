import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Footer from '../common/Footer';
import './Auth.css';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Test account credentials
        if (email === 'test@playlister.com' && password === 'test123') {
            // Set logged in user in sessionStorage
            const user = {
                name: 'JoelDemo',
                email: 'test@playlister.com',
                avatar: '🎵'
            };
            sessionStorage.setItem('userMode', 'loggedIn');
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            navigate('/playlists');
        } else {
            setError('Invalid email or password. Try: test@playlister.com / test123');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-content">
                <div className="auth-icon">
                    <Lock size={80} />
                </div>

                <h1 className="auth-title">Sign In</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onClear={() => setEmail('')}
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onClear={() => setPassword('')}
                    />

                    <Button type="submit" variant="dark" size="large">
                        SIGN IN
                    </Button>

                    <div className="auth-hint">
                        Test Account: test@playlister.com / test123
                    </div>
                </form>

                <button
                    className="auth-link"
                    onClick={() => navigate('/create-account')}
                >
                    Don't have an account? <span>Sign Up</span>
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default SignInForm;