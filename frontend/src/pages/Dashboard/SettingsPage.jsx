import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../store/AuthStore';
import ClassroomService from '../../services/classroom.service';
import recordingService from '../../services/recording_service';
import { BookOpen, Video, Trash2, ExternalLink, Share2, Play, X } from 'lucide-react';
import './DashboardPages.css';

/* ──────────────────────────────────────────────
   Video Player Modal – dedicated component
────────────────────────────────────────────── */
const VideoModal = ({ recording, onClose }) => {
    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="vm-overlay" onClick={onClose}>
            {/* Floating X button in top-right of overlay */}
            <button className="vm-overlay-close" onClick={onClose} title="Close (Esc)">
                <X size={28} />
            </button>

            <div className="vm-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="vm-header">
                    <div className="vm-title-wrap">
                        <Video size={18} />
                        <h3 className="vm-title">{recording.title || 'Recording'}</h3>
                    </div>
                    <button className="vm-close-btn" onClick={onClose} title="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Video Player */}
                <div className="vm-player">
                    {recording.video_url ? (
                        <video
                            controls
                            autoPlay
                            className="vm-video"
                            src={recording.video_url}
                            onError={(e) => {
                                e.target.parentNode.innerHTML = '<p class="vm-error">⚠️ Unable to load video. The file may not be available.</p>';
                            }}
                        />
                    ) : (
                        <p className="vm-error">⚠️ No video URL for this recording.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="vm-footer">
                    <span className="vm-date">
                        {recording.date ? new Date(recording.date).toLocaleDateString() : ''}
                    </span>
                    <button className="vm-close-footer-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


const SettingsPage = ({ view }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(view === 'management' ? 'classes' : 'profile');
    const [classes, setClasses] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [playingVideo, setPlayingVideo] = useState(null);

    useEffect(() => {
        if (activeTab === 'classes') {
            fetchClasses();
        } else if (activeTab === 'recordings') {
            fetchRecordings();
        }
    }, [activeTab]);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await ClassroomService.getUpcomingClasses();
            setClasses(data);
        } catch (error) {
            console.error("Failed to fetch classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecordings = async () => {
        try {
            setLoading(true);
            const data = await (user.role === 'teacher'
                ? recordingService.getTeacherRecordings()
                : recordingService.getUserRecordings());
            setRecordings(data);
        } catch (error) {
            console.error("Failed to fetch recordings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = async (id) => {
        if (window.confirm('Are you sure you want to delete this class? This will also remove it for all students.')) {
            try {
                await ClassroomService.deleteClass(id);
                setClasses(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                alert('Failed to delete class. Please try again.');
            }
        }
    };

    const handleDeleteRecording = async (id) => {
        if (window.confirm('Are you sure you want to delete this recording permanently?')) {
            try {
                await recordingService.deleteRecording(id);
                setRecordings(prev => prev.filter(r => r.id !== id));
            } catch (error) {
                alert('Failed to delete recording. Please try again.');
            }
        }
    };

    const handleShare = (videoUrl) => {
        navigator.clipboard.writeText(videoUrl);
        alert('Recording link copied to clipboard!');
    };

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>{view === 'profile' ? 'Personal Profile' : 'Data Management'}</h1>
                <p>{view === 'profile' ? 'View and verify your account details.' : 'Manage your classes and recorded sessions.'}</p>
            </header>

            <div className="settings-layout">
                {view === 'management' && (
                    <div className="settings-sidebar">
                        <button
                            className={`settings-tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('classes')}
                        >
                            <BookOpen size={18} /> Classes
                        </button>
                        <button
                            className={`settings-tab-btn ${activeTab === 'recordings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('recordings')}
                        >
                            <Video size={18} /> Recordings
                        </button>
                    </div>
                )}

                <div className="settings-content">
                    {view === 'profile' && (
                        <Card title="Account Details">
                            <div className="settings-form">
                                <div className="settings-grid">
                                    <Input label="Full Name" value={user?.full_name || ''} disabled />
                                    <Input label="User ID" value={user?.user_id || ''} disabled />
                                    <Input label="Email Address" value={user?.email || ''} disabled />
                                    <Input label="Account Role" value={user?.role || ''} disabled />
                                </div>
                                <div className="settings-info-note">
                                    <p>These details are automatically verified from your institutional account. Contact IT support for changes.</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {view === 'management' && activeTab === 'classes' && (
                        <Card title="Your Classes">
                            <div className="management-list">
                                {loading ? <p>Loading classes...</p> :
                                    classes.length === 0 ? <p>No classes scheduled.</p> : (
                                        classes.map(cls => (
                                            <div key={cls.id} className="management-item">
                                                <div className="item-info">
                                                    <h4>{cls.title}</h4>
                                                    <p>{cls.date} at {cls.time}</p>
                                                </div>
                                                <div className="item-actions">
                                                    <Button size="sm" variant="ghost">View</Button>
                                                    {user.role === 'teacher' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="delete-btn"
                                                            onClick={() => handleDeleteClass(cls.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                            </div>
                        </Card>
                    )}

                    {view === 'management' && activeTab === 'recordings' && (
                        <Card title="Recorded Sessions">
                            <div className="management-list">
                                {loading ? <p>Loading recordings...</p> :
                                    recordings.length === 0 ? <p>No recordings found.</p> : (
                                        recordings.map(rec => (
                                            <div key={rec.id} className="management-item">
                                                <div className="item-info clickable" onClick={() => setPlayingVideo(rec)}>
                                                    <h4>{rec.title}</h4>
                                                    <p>{new Date(rec.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="item-actions">
                                                    <button className="nav-action-btn" title="Play Recording" onClick={() => setPlayingVideo(rec)}>
                                                        <Play size={16} />
                                                    </button>
                                                    <button className="nav-action-btn" title="Share Recording" onClick={() => handleShare(rec.video_url)}>
                                                        <Share2 size={16} />
                                                    </button>
                                                    <a href={rec.video_url} target="_blank" rel="noreferrer" className="view-link" title="Open in new tab">
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    {user.role === 'teacher' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="delete-btn"
                                                            onClick={() => handleDeleteRecording(rec.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Video Player Modal */}
            {playingVideo && (
                <VideoModal
                    recording={playingVideo}
                    onClose={() => setPlayingVideo(null)}
                />
            )}
        </div>
    );
};

export default SettingsPage;
