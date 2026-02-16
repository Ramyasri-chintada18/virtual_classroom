import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './ClassroomLayout.css';

const ClassroomLayout = ({ children }) => {
    // Local state for UI toggles (Sidebar)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="classroom-layout">
            {/* HEADER AREA */}
            <header className="layout-header">
                <div className="brand">Virtual Classroom</div>
                <div className="room-info">Physics 101</div>
            </header>

            {/* STAGE AREA (Main Workspace) */}
            <main className="layout-stage">
                {children || <Outlet />}
            </main>

            {/* SIDEBAR AREA */}
            <aside className={`layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    {/* Placeholder for Chat/Participants Tab */}
                    <h3>Chat Panel</h3>
                </div>
            </aside>

            {/* FOOTER AREA (Controls) */}
            <footer className="layout-footer">
                <button className="btn btn-secondary">Mic</button>
                <button className="btn btn-secondary">Cam</button>
                <button className="btn btn-danger">Leave</button>
                <button
                    className="btn btn-ghost"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? 'Close Side' : 'Open Side'}
                </button>
            </footer>
        </div>
    );
};

export default ClassroomLayout;
