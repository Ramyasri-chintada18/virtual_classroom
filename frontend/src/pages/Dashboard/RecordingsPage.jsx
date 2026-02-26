import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import recordingService from '../../services/recording_service';
import { Video, Calendar, Clock, Play } from 'lucide-react';
import './DashboardPages.css';

const RecordingsPage = () => {
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const data = await recordingService.getUserRecordings();
                setRecordings(data);
            } catch (error) {
                console.error("Failed to fetch recordings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecordings();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Recordings</h1>
                <p>Access recordings of your past classroom sessions.</p>
            </header>

            {loading ? (
                <div className="loading-state">Loading your recordings...</div>
            ) : recordings.length === 0 ? (
                <div className="empty-state">
                    <Video size={48} />
                    <h3>No recordings yet</h3>
                    <p>Start a recording during your next class to see it here.</p>
                </div>
            ) : (
                <div className="recordings-list">
                    {recordings.map(rec => (
                        <Card key={rec.id} className="recording-card">
                            <div className="recording-icon">
                                <Video size={24} />
                            </div>
                            <div className="recording-info">
                                <h4>{rec.filename}</h4>
                                <div className="recording-meta">
                                    <span><Calendar size={14} /> {formatDate(rec.created_at)}</span>
                                    <span><Clock size={14} /> {formatSize(rec.size_bytes)}</span>
                                </div>
                            </div>
                            <a
                                href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${rec.file_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="play-btn-link"
                            >
                                <Play size={18} /> Play
                            </a>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecordingsPage;
