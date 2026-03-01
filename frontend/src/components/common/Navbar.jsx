import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthStore';
import { useNotification } from '../../store/NotificationStore';
import notificationService from '../../services/notification.service';
import { Search, Bell, Settings, LogOut, Menu, Check, Trash2, Clock } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar = ({ toggleSidebar, isSidebarOpen, searchQuery, setSearchQuery }) => {
    const { user, logout } = useAuth();
    const {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification
    } = useNotification();

    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    // Start polling for notifications when user is logged in
    useEffect(() => {
        if (user) {
            notificationService.startPolling(addNotification);
        }
        return () => notificationService.stopPolling();
    }, [user, addNotification]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (id) => {
        markAsRead(id);
    };

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
                    <input
                        type="text"
                        placeholder="Search classes, recordings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="navbar-right">
                <div className="navbar-actions">
                    <div className="notification-wrapper" ref={dropdownRef}>
                        <button
                            className={`nav-action-btn ${showNotifications ? 'active' : ''}`}
                            onClick={() => setShowNotifications(!showNotifications)}
                            title="Notifications"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="dropdown-header">
                                    <h4>Notifications</h4>
                                    {unreadCount > 0 && (
                                        <button className="mark-all-btn" onClick={markAllAsRead}>
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="dropdown-body">
                                    {notifications.length === 0 ? (
                                        <div className="empty-notifications">
                                            <Bell size={32} />
                                            <p>No new notifications</p>
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                                                onClick={() => handleNotificationClick(notif.id)}
                                            >
                                                <div className="notif-icon">
                                                    <Clock size={16} />
                                                </div>
                                                <div className="notif-content">
                                                    <div className="notif-title">{notif.title}</div>
                                                    <div className="notif-message">{notif.message}</div>
                                                    <div className="notif-time">
                                                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <div className="notif-actions">
                                                    {!notif.read && (
                                                        <button
                                                            className="action-btn read"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notif.id);
                                                            }}
                                                            title="Mark as read"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notif.id);
                                                        }}
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <Link to="/settings" className="nav-action-btn" title="Settings">
                        <Settings size={20} />
                    </Link>
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
