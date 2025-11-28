import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Footer from '../common/Footer';
import './Auth.css';

const EditAccountForm = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [avatar, setAvatar] = useState('🎵');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement edit account logic
        console.log('Edit account:', { userName, email, password, passwordConfirm, avatar });
    };

    const handleCancel = () => {
        navigate(-1);
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

                <h1 className="auth-title">Edit Account</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="avatar-selector">
                        <div className="avatar-display">{avatar}</div>
                        <Button
                            type="button"
                            variant="dark"
                            size="small"
                            onClick={handleSelectAvatar}
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
                    />

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

                    <Input
                        type="password"
                        placeholder="Password Confirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        onClear={() => setPasswordConfirm('')}
                    />

                    <div className="form-actions">
                        <Button type="submit" variant="dark" size="large">
                            Complete
                        </Button>
                        <Button
                            type="button"
                            variant="dark"
                            size="large"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default EditAccountForm;