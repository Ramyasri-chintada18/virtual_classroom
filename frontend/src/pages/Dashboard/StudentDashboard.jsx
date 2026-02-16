import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ClassroomService from '../../services/classroom.service';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [progress, setProgress] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progressData, classesData] = await Promise.all([
                    ClassroomService.getStudentProgress(),
                    ClassroomService.getUpcomingClasses()
                ]);
                setProgress(progressData);
                setClasses(classesData);
            } catch (err) {
                console.error('Failed to fetch student data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="student-dashboard">
            <header className="dashboard-content-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p className="subtitle">Ready to learn something new today?</p>
                </div>
                <div className="join-class-quick">
                    <Input placeholder="Enter Room Code" className="join-input-wrapper" />
                    <Button variant="primary">Join</Button>
                </div>
            </header>

            <div className="stats-grid">
                <Card title="Completed Lessons">
                    <div className="stat-value">{progress?.completedLessons || 0}</div>
                </Card>
                <Card title="Attendance Rate">
                    <div className="stat-value">{progress?.attendanceRate || '0%'}</div>
                </Card>
                <Card title="Pending Tasks">
                    <div className="stat-value danger">{progress?.pendingAssignments || 0}</div>
                </Card>
            </div>

            <section className="enrolled-classes">
                <h3>My Enrolled Classes</h3>
                <div className="classes-grid">
                    {classes.map(cls => (
                        <Card key={cls.id} title={cls.title} className="course-card">
                            <p>Instructor: {cls.instructor}</p>
                            <div className="course-footer">
                                <Button variant="ghost" size="sm">Materials</Button>
                                <Button size="sm" variant={cls.status === 'live' ? 'primary' : 'secondary'}>
                                    {cls.status === 'live' ? 'Enter Live Room' : 'View Schedule'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
