import React from 'react';
import { useAuth } from '../../store/AuthStore';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <span className="logo-icon">V</span>
                    <span className="logo-text">Virtual Classroom</span>
                </div>
                <div className="navbar-search">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search classes, recordings..." />
                </div>
            </div>

            <div className="navbar-right">
                <div className="navbar-actions">
                    <button className="nav-action-btn">🔔</button>
                    <button className="nav-action-btn">⚙️</button>
                </div>
                {user && (
                    <div className="user-profile">
                        <div className="user-avatar">{user.email[0].toUpperCase()}</div>
                        <div className="user-info">
                            <span className="user-name">{user.email.split('@')[0]}</span>
                            <span className="user-role-badge">{user.role}</span>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={logout}
                            className="logout-button"
                        >
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
