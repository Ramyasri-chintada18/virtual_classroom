import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import recordingService from '../../services/recording_service';
import { useAuth } from '../../store/AuthStore';
import { Video, Calendar, Clock, Play, Download, Trash2, Info } from 'lucide-react';
import './DashboardPages.css';

const RecordingsPage = () => {
    const { user } = useAuth();
    const { searchQuery } = useOutletContext();
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecordings = async () => {
        try {
            setLoading(true);
            const data = user.role === 'teacher'
                ? await recordingService.getTeacherRecordings()
                : await recordingService.getUserRecordings();
            setRecordings(data);
        } catch (error) {
            console.error("Failed to fetch recordings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchRecordings();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recording?')) {
            try {
                await recordingService.deleteRecording(id);
                setRecordings(prev => prev.filter(rec => (rec.id || rec.recording_id) !== id));
            } catch (error) {
                alert('Failed to delete recording');
            }
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download the file.");
        }
    };

    const formatDuration = (val) => {
        // If it's a string like "0m 10s", try to extract numbers
        if (typeof val === 'string' && val.includes('m')) {
            const parts = val.match(/\d+/g);
            if (parts && parts.length >= 2) {
                return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
            }
        }

        const seconds = parseInt(val);
        if (isNaN(seconds) || seconds < 0) return '00:00';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Filter recordings based on search query
    const filteredRecordings = recordings.filter(rec => {
        const title = rec.class_title || rec.filename || '';
        const subject = rec.subject || 'General';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <div>
                    <h1>Class Recordings</h1>
                    <p>Access your past classroom sessions and materials.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchRecordings}>Refresh</Button>
            </header>

            {loading ? (
                <div className="loading-state">Loading your recordings...</div>
            ) : filteredRecordings.length === 0 ? (
                <div className="empty-state">
                    <Video size={48} />
                    <h3>{searchQuery ? `No recordings found matching "${searchQuery}"` : "No recordings found"}</h3>
                    <p>{searchQuery ? "Try searching for a different class title or subject." : "Recordings will appear here after your classes end."}</p>
                </div>
            ) : (
                <div className="recordings-grid">
                    {filteredRecordings.map(rec => {
                        const recId = rec.id || rec.recording_id;
                        const videoUrl = rec.video_url || rec.file_url;
                        return (
                            <Card key={recId} className="recording-card-detailed">
                                <div className="recording-preview">
                                    <Video size={32} />
                                    <span className="duration-tag">{formatDuration(rec.duration_seconds || rec.duration)}</span>
                                </div>
                                <div className="recording-content">
                                    <div className="recording-header">
                                        <h4>{rec.class_title || rec.filename}</h4>
                                        <span className="subject-tag">{rec.subject || 'General'}</span>
                                    </div>
                                    <div className="recording-meta-info">
                                        <p><Calendar size={14} /> {formatDate(rec.date || rec.created_at || rec.uploaded_at)}</p>
                                        {rec.description && (
                                            <p className="rec-description"><Info size={14} /> {rec.description}</p>
                                        )}
                                    </div>
                                    <div className="recording-actions">
                                        <a
                                            href={videoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="action-btn play"
                                            title="Play Recording"
                                        >
                                            <Play size={16} /> Play
                                        </a>
                                        <button
                                            onClick={() => handleDownload(videoUrl, `recording_${recId}.webm`)}
                                            className="action-btn download"
                                            title="Download Recording"
                                        >
                                            <Download size={16} />
                                        </button>
                                        {user.role === 'teacher' && (
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(recId)}
                                                title="Delete Recording"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecordingsPage;
