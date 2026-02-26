import React from 'react';
import { useAuth } from '../../store/AuthStore';
import { Search, Bell, Settings, LogOut, Menu } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="menu-toggle-btn" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>
                <div className="navbar-logo">
                    <span className="logo-text">Virtual Classroom</span>
                </div>
            </div>

            <div className="navbar-center">
                <div className="navbar-search">
                    <Search className="search-icon" size={18} />
                    <input type="text" placeholder="Search classes, recordings..." />
                </div>
            </div>

            <div className="navbar-right">
                <div className="navbar-actions">
                    <button className="nav-action-btn">
                        <Bell size={20} />
                    </button>
                    <button className="nav-action-btn">
                        <Settings size={20} />
                    </button>
                </div>
                {user && (
                    <div className="user-profile">
                        <div className="user-avatar">{user.email[0].toUpperCase()}</div>
                        <div className="user-info">
                            <span className="user-name">{user.email.split('@')[0]}</span>
                            <span className="user-role-badge">{user.role}</span>
                        </div>
                        <button className="logout-icon-btn" onClick={logout} title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
