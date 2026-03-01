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
                        return (
                            <Card key={recId} className="recording-card-detailed">
                                <div className="recording-preview">
                                    <Video size={32} />
                                    <span className="duration-tag">{rec.duration || '0:00'}</span>
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
                                            href={rec.video_url || rec.file_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="action-btn play"
                                        >
                                            <Play size={16} /> Play
                                        </a>
                                        <a
                                            href={rec.video_url || rec.file_url}
                                            download
                                            className="action-btn download"
                                        >
                                            <Download size={16} />
                                        </a>
                                        {user.role === 'teacher' && (
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(recId)}
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
