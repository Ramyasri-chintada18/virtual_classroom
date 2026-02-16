import React from 'react';
import Card from '../../components/common/Card';
import './DashboardPages.css';

const RecordingsPage = () => {
    const MOCK_RECORDINGS = [
        { id: 1, title: 'Math 101 - Calculus Intro', date: '2026-02-10', duration: '45m' },
        { id: 2, title: 'Physics 202 - Thermodynamics', date: '2026-02-12', duration: '1h 10m' },
    ];

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Recordings</h1>
                <p>Access recordings of your past classroom sessions.</p>
            </header>
            <div className="recordings-list">
                {MOCK_RECORDINGS.map(rec => (
                    <Card key={rec.id} className="recording-card">
                        <div className="recording-info">
                            <h4>{rec.title}</h4>
                            <p>{rec.date} • {rec.duration}</p>
                        </div>
                        <button className="play-btn">▶ Play</button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RecordingsPage;
