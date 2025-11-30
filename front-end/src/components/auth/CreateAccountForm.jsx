import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Footer from '../common/Footer';
import { authAPI } from '../../services/api';
import './Auth.css';

const CreateAccountForm = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [avatar, setAvatar] = useState('🎵');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Validate username length
        if (userName.length < 3 || userName.length > 30) {
            setError('Username must be 3-30 characters');
            return;
        }

        setLoading(true);

        try {
            await authAPI.register({
                username: userName,
                email,
                password,
                avatar
            });

            // Registration successful - navigate to playlists
            navigate('/playlists');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAvatar = () => {
        // TODO: Implement avatar selection
        const avatars = ['🎵', '🎸', '🎹', '🎤', '🎧', '🎼', '🎺', '🎷'];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        setAvatar(randomAvatar);
    };

    return (
        <div className="auth-page">
            <div className="auth-content">
                <div className="auth-icon">
                    <Lock size={80} />
                </div>

                <h1 className="auth-title">Create Account</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <div className="avatar-selector">
                        <div className="avatar-display">{avatar}</div>
                        <Button
                            type="button"
                            variant="dark"
                            size="small"
                            onClick={handleSelectAvatar}
                            disabled={loading}
                        >
                            Select
                        </Button>
                    </div>

                    <Input
                        type="text"
                        placeholder="User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onClear={() => setUserName('')}
                        disabled={loading}
                        required
                    />

                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onClear={() => setEmail('')}
                        disabled={loading}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onClear={() => setPassword('')}
                        disabled={loading}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password Confirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        onClear={() => setPasswordConfirm('')}
                        disabled={loading}
                        required
                    />

                    <Button type="submit" variant="dark" size="large" disabled={loading}>
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </Button>
                </form>

                <button
                    className="auth-link"
                    onClick={() => navigate('/signin')}
                    disabled={loading}
                >
                    Already have an account? <span>Sign In</span>
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default CreateAccountForm;