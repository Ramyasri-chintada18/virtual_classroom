import React from 'react';
import Card from '../../components/common/Card';
import './DashboardPages.css';

const CalendarPage = () => {
    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Calendar</h1>
                <p>Your upcoming schedule at a glance.</p>
            </header>
            <Card className="calendar-placeholder">
                <div className="placeholder-content">
                    <span className="icon">📅</span>
                    <h3>Interactive Calendar Coming Soon</h3>
                    <p>We are integrating with Google Calendar and Outlook.</p>
                </div>
            </Card>
        </div>
    );
};

export default CalendarPage;
