import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`dashboard-layout ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <Navbar
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {isSidebarOpen && <Sidebar />}
            <main className="dashboard-main">
                <Outlet context={{ searchQuery }} />
            </main>
        </div>
    );
};

export default DashboardLayout;
