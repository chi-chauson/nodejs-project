import React, { useState, useEffect, useRef } from 'react';
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

    // Validation errors for individual fields
    const [userNameError, setUserNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    const [checkingEmail, setCheckingEmail] = useState(false);

    const navigate = useNavigate();
    const emailCheckTimeout = useRef(null);

    // Validate username
    useEffect(() => {
        if (!userName) {
            setUserNameError('');
            return;
        }
        if (userName.length < 3) {
            setUserNameError('Username must be at least 3 characters');
        } else if (userName.length > 30) {
            setUserNameError('Username must be 30 characters or less');
        } else {
            setUserNameError('');
        }
    }, [userName]);

    // Validate email (debounced)
    useEffect(() => {
        // Clear previous timeout
        if (emailCheckTimeout.current) {
            clearTimeout(emailCheckTimeout.current);
        }

        if (!email) {
            setEmailError('');
            setCheckingEmail(false);
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            setCheckingEmail(false);
            return;
        }

        // Debounce the API call
        setCheckingEmail(true);
        emailCheckTimeout.current = setTimeout(async () => {
            try {
                const result = await authAPI.checkEmail(email);
                if (!result.available) {
                    setEmailError('Email already in use');
                } else {
                    setEmailError('');
                }
            } catch (err) {
                // If check fails, don't show error (allow form submission to handle it)
                setEmailError('');
            } finally {
                setCheckingEmail(false);
            }
        }, 500);

        return () => {
            if (emailCheckTimeout.current) {
                clearTimeout(emailCheckTimeout.current);
            }
        };
    }, [email]);

    // Validate password
    useEffect(() => {
        if (!password) {
            setPasswordError('');
            return;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
        } else {
            setPasswordError('');
        }
    }, [password]);

    // Validate password confirmation
    useEffect(() => {
        if (!passwordConfirm) {
            setPasswordConfirmError('');
            return;
        }
        if (password !== passwordConfirm) {
            setPasswordConfirmError('Passwords do not match');
        } else {
            setPasswordConfirmError('');
        }
    }, [password, passwordConfirm]);

    // Check if form is valid
    const isFormValid =
        userName.length >= 3 &&
        userName.length <= 30 &&
        email.length > 0 &&
        !emailError &&
        !checkingEmail &&
        password.length >= 6 &&
        passwordConfirm.length > 0 &&
        password === passwordConfirm &&
        !userNameError &&
        !passwordError &&
        !passwordConfirmError;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Double-check form is valid (should be disabled if not)
        if (!isFormValid) {
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

                    <div className="form-field">
                        <Input
                            type="text"
                            placeholder="User Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onClear={() => setUserName('')}
                            disabled={loading}
                            required
                        />
                        {userNameError && <div className="field-error">{userNameError}</div>}
                    </div>

                    <div className="form-field">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onClear={() => setEmail('')}
                            disabled={loading}
                            required
                        />
                        {checkingEmail && <div className="field-info">Checking availability...</div>}
                        {emailError && !checkingEmail && <div className="field-error">{emailError}</div>}
                    </div>

                    <div className="form-field">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onClear={() => setPassword('')}
                            disabled={loading}
                            required
                        />
                        {passwordError && <div className="field-error">{passwordError}</div>}
                    </div>

                    <div className="form-field">
                        <Input
                            type="password"
                            placeholder="Password Confirm"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            onClear={() => setPasswordConfirm('')}
                            disabled={loading}
                            required
                        />
                        {passwordConfirmError && <div className="field-error">{passwordConfirmError}</div>}
                    </div>

                    <Button type="submit" variant="dark" size="large" disabled={loading || !isFormValid}>
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