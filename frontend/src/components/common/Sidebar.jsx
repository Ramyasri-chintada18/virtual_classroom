import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthStore';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const role = user?.role;

    return (
        <aside className="sidebar">
            <div className="sidebar-menu">
                <NavLink
                    to={`/dashboard/${role}`}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <span className="item-icon">📊</span>
                    <span className="item-text">Overview</span>
                </NavLink>

                <NavLink
                    to="/classes"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <span className="item-icon">📚</span>
                    <span className="item-text">My Classes</span>
                </NavLink>

                <NavLink
                    to="/recordings"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <span className="item-icon">🎥</span>
                    <span className="item-text">Recordings</span>
                </NavLink>

                <NavLink
                    to="/calendar"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <span className="item-icon">📅</span>
                    <span className="item-text">Calendar</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <span className="item-icon">⚙️</span>
                    <span className="item-text">Settings</span>
                </NavLink>
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-ad">
                    <p>Upgrade to Pro for more features!</p>
                </div>
                <button className="sidebar-logout-btn" onClick={logout}>
                    <span className="item-icon">🚪</span>
                    <span className="item-text">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
