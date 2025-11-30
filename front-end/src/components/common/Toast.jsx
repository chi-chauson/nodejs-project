import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ id, type = 'success', message, onClose, duration = 4000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <XCircle size={20} />;
            case 'info':
                return <AlertCircle size={20} />;
            default:
                return <CheckCircle size={20} />;
        }
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">
                {getIcon()}
            </div>
            <div className="toast-message">
                {message}
            </div>
            <button
                className="toast-close"
                onClick={() => onClose(id)}
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
