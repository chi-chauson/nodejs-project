import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Footer from '../common/Footer';
import { authAPI } from '../../services/api';
import './Auth.css';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authAPI.login({ email, password });

            // Login successful - navigate to playlists
            navigate('/playlists');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
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
                        disabled={loading}
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onClear={() => setPassword('')}
                        disabled={loading}
                    />

                    <Button type="submit" variant="dark" size="large" disabled={loading}>
                        {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </Button>

                    <div className="auth-hint">
                        Test Account: test@playlister.com / test123
                    </div>
                </form>

                <button
                    className="auth-link"
                    onClick={() => navigate('/create-account')}
                    disabled={loading}
                >
                    Don't have an account? <span>Sign Up</span>
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default SignInForm;