import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ClassroomService from '../../services/classroom.service';
import Modal from '../../components/common/Modal';
import CreateClassForm from '../../components/classroom/CreateClassForm';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { searchQuery } = useOutletContext();
    const [stats, setStats] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null); // 'create' | 'details' | null
    const [selectedClass, setSelectedClass] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Filter classes based on search query
    const filteredClasses = classes.filter(cls => {
        const title = cls.title || '';
        const subject = cls.subject || 'General';
        const query = searchQuery?.toLowerCase() || '';
        return title.toLowerCase().includes(query) ||
            subject.toLowerCase().includes(query);
    });


    const handleCreateClass = async (formData) => {
        try {
            const newClass = await ClassroomService.createClass(formData);
            setClasses(prev => [newClass, ...prev]);
            setActiveModal(null);
        } catch (err) {
            console.error('Failed to create class', err);
            alert('Error creating class. Please try again.');
        }
    };

    const handleJoinClass = (roomId) => {
        navigate(`/classroom/${roomId}`);
    };

    const handlePrepareRoom = (cls) => {
        setSelectedClass(cls);
        setActiveModal('details');
        setCopySuccess(false);
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/classroom/${selectedClass?.id}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, classesData] = await Promise.all([
                    ClassroomService.getTeacherStats(),
                    ClassroomService.getTodayClasses()
                ]);
                setStats(statsData);
                setClasses(classesData);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="teacher-dashboard">
            <header className="dashboard-content-header">
                <div>
                    <h1>Today's Overview</h1>
                    <p className="subtitle">Manage your classes for {new Date().toLocaleDateString()}</p>
                </div>
                <Button variant="primary" onClick={() => setActiveModal('create')}>
                    Create New Class
                </Button>
            </header>

            <Modal
                isOpen={!!activeModal}
                onClose={() => setActiveModal(null)}
                title={activeModal === 'create' ? "Create New Classroom" : "Classroom Prepared"}
            >
                {activeModal === 'create' && (
                    <CreateClassForm
                        onSubmit={handleCreateClass}
                        onCancel={() => setActiveModal(null)}
                    />
                )}
                {activeModal === 'details' && (
                    <div className="class-details-popup">
                        <p className="details-message">This classroom is now ready. Share the following Room ID with your students to let them join.</p>
                        <div className="room-id-container">
                            <div className="room-id-header">
                                <span className="room-id-label">Room ID:</span>
                                <button className="copy-link-btn" onClick={handleCopyLink}>
                                    {copySuccess ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                            <code className="room-id-value">{selectedClass?.id}</code>
                        </div>
                        <div className="modal-actions">
                            <Button variant="secondary" onClick={() => setActiveModal(null)}>Close</Button>
                            <Button variant="primary" onClick={() => handleJoinClass(selectedClass.id)}>Join Now</Button>
                        </div>
                    </div>
                )}
            </Modal>

            <div className="stats-grid">
                <Card title="Today's Classes">
                    <div className="stat-value">{classes.length}</div>
                </Card>
                <Card title="Engagement Rate">
                    <div className="stat-value">{stats?.averageEngagement || '0%'}</div>
                </Card>
                <Card title="Active Classes">
                    <div className="stat-value">{stats?.activeClasses || 0}</div>
                </Card>
            </div>

            <section className="upcoming-classes">
                <h3>Today's Classes</h3>
                <div className="classes-list">
                    {filteredClasses.length === 0 ? (
                        <div className="no-classes-message">
                            <p>{searchQuery ? `No classes found matching "${searchQuery}"` : "No classes scheduled for today."}</p>
                        </div>
                    ) : (
                        filteredClasses.map(cls => (
                            <Card key={cls.id} className="class-item-card">
                                <div className="class-info">
                                    <div className="class-header-row">
                                        <h4>{cls.title}</h4>
                                        <span className={`status-badge ${cls.status}`}>{cls.status}</span>
                                    </div>
                                    <p className="class-subject">Subject: {cls.subject}</p>
                                    <div className="schedule-info">
                                        <p>Time: {cls.start_time} - {cls.end_time}</p>
                                    </div>
                                    <span className="student-count">{cls.students_enrolled} students enrolled</span>
                                </div>
                                <div className="card-actions">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            const link = `${window.location.origin}/classroom/${cls.id}`;
                                            navigator.clipboard.writeText(link).then(() => alert('Link copied!'));
                                        }}
                                    >
                                        Copy Link
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={cls.status === 'live' ? 'primary' : 'outline'}
                                        onClick={() => cls.status === 'live' ? handleJoinClass(cls.id) : handlePrepareRoom(cls)}
                                    >
                                        {cls.status === 'live' ? 'Join Now' : 'Prepare Room'}
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default TeacherDashboard;
