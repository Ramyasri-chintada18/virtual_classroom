import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = ({ label, error, className = '', type = 'text', ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`input-wrapper ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="relative">
                <input 
                    className={`input-field ${error ? 'input-error' : ''} ${isPassword ? 'pr-10' : ''}`} 
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    {...props} 
                />
                {isPassword && (
                    <button 
                        type="button" 
                        onClick={togglePassword} 
                        className="password-toggle-btn"
                        tabIndex="-1"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};

export default Input;
