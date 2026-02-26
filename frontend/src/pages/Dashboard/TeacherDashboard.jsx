import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ClassroomService from '../../services/classroom.service';
import Modal from '../../components/common/Modal';
import CreateClassForm from '../../components/classroom/CreateClassForm';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null); // 'create' | 'details' | null
    const [selectedClass, setSelectedClass] = useState(null);

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
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, classesData] = await Promise.all([
                    ClassroomService.getTeacherStats(),
                    ClassroomService.getUpcomingClasses()
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
                    <h1>Teacher Dashboard</h1>
                    <p className="subtitle">Welcome back, Professor!</p>
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
                            <span className="room-id-label">Room ID:</span>
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
                <Card title="Active Classes">
                    <div className="stat-value">{stats?.activeClasses || 0}</div>
                </Card>
                <Card title="Total Students">
                    <div className="stat-value">{stats?.totalStudents || 0}</div>
                </Card>
                <Card title="Engagement Rate">
                    <div className="stat-value">{stats?.averageEngagement || '0%'}</div>
                </Card>
            </div>

            <section className="upcoming-classes">
                <h3>My Upcoming Classes</h3>
                <div className="classes-list">
                    {classes.map(cls => (
                        <Card key={cls.id} className="class-item-card">
                            <div className="class-info">
                                <h4>{cls.title}</h4>
                                {cls.status === 'live' ? (
                                    <p className="live-status">CLASS IS LIVE</p>
                                ) : (
                                    <div className="schedule-info">
                                        <p>Date: {cls.date}</p>
                                        <p>Time: {cls.time}</p>
                                    </div>
                                )}
                                <span className="student-count">{cls.students} students enrolled</span>
                            </div>
                            <Button
                                size="sm"
                                variant={cls.status === 'live' ? 'primary' : 'outline'}
                                onClick={() => cls.status === 'live' ? handleJoinClass(cls.id) : handlePrepareRoom(cls)}
                                className={cls.status === 'live' ? 'btn-join' : 'btn-prepare'}
                            >
                                {cls.status === 'live' ? 'Join Now' : 'Prepare Room'}
                            </Button>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TeacherDashboard;
