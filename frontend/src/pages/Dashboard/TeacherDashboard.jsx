import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ClassroomService from '../../services/classroom.service';
import Modal from '../../components/common/Modal';
import CreateClassForm from '../../components/classroom/CreateClassForm';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const [stats, setStats] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleCreateClass = async (formData) => {
        try {
            const newClass = await ClassroomService.createClass(formData);
            setClasses(prev => [newClass, ...prev]);
            setShowModal(false);
        } catch (err) {
            console.error('Failed to create class', err);
            alert('Error creating class. Please try again.');
        }
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
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Create New Class
                </Button>
            </header>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Classroom"
            >
                <CreateClassForm
                    onSubmit={handleCreateClass}
                    onCancel={() => setShowModal(false)}
                />
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
                                <p>{cls.status === 'live' ? 'CLASS IS LIVE' : `Starts at ${cls.time}`}</p>
                                <span className="student-count">{cls.students} students enrolled</span>
                            </div>
                            <Button size="sm" variant={cls.status === 'live' ? 'primary' : 'secondary'}>
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
