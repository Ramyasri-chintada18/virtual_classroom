import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initial load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotifications(parsed);
                setUnreadCount(parsed.filter(n => !n.read).length);
            } catch (e) {
                console.error('Failed to parse notifications', e);
            }
        }
    }, []);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const addNotification = useCallback((notification) => {
        setNotifications(prev => {
            // Check if notification already exists (by ID or Unique content)
            const exists = prev.find(n => n.id === notification.id);
            if (exists) return prev;

            const newNotification = {
                ...notification,
                timestamp: new Date().toISOString(),
                read: false
            };
            return [newNotification, ...prev].slice(0, 50); // Keep last 50
        });
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
