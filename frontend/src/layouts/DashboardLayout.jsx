import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <Sidebar />
            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
