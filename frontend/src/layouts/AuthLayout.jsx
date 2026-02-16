import React from 'react';
import './AuthLayout.css';


const AuthLayout = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-background-mesh"></div>
            <div className="auth-container">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
