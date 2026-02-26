import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthStore';
import { LayoutDashboard, BookOpen, Video, Calendar, Settings, LogOut } from 'lucide-react';
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
                    <LayoutDashboard size={20} />
                    <span className="item-text">Overview</span>
                </NavLink>

                <NavLink
                    to="/classes"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <BookOpen size={20} />
                    <span className="item-text">My Classes</span>
                </NavLink>

                <NavLink
                    to="/recordings"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <Video size={20} />
                    <span className="item-text">Recordings</span>
                </NavLink>

                <NavLink
                    to="/calendar"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <Calendar size={20} />
                    <span className="item-text">Calendar</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                    <Settings size={20} />
                    <span className="item-text">Settings</span>
                </NavLink>
            </div>

            <div className="sidebar-footer">
                <button className="sidebar-logout-btn" onClick={logout}>
                    <LogOut size={20} />
                    <span className="item-text">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
