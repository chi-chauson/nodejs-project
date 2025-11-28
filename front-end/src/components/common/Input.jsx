import React from 'react';
import { X } from 'lucide-react';
import './Input.css';

const Input = ({
    type = 'text',
    placeholder = '',
    value = '',
    onChange,
    onClear,
    showClear = true,
    disabled = false,
    className = ''
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="input-field"
            />
            {showClear && value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="input-clear-btn"
                    aria-label="Clear input"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};

export default Input;