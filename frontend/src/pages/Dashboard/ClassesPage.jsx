import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import ClassroomService from '../../services/classroom.service';
import './DashboardPages.css';

// Compute dynamic class status based on current time
const getClassStatus = (cls) => {
    if (!cls.date || cls.date === 'TBD' || !cls.time || cls.time === 'TBD') {
        return cls.status || 'upcoming';
    }
    const now = new Date();
    const classStart = new Date(`${cls.date}T${cls.time}`);
    if (isNaN(classStart.getTime())) return cls.status || 'upcoming';

    const diffMs = now - classStart;
    const durationMs = 60 * 60 * 1000; // Assume 1-hour class

    if (diffMs > durationMs) return 'completed';
    if (diffMs >= 0) return 'live';
    return 'upcoming';
};

const ClassesPage = () => {
    const { searchQuery } = useOutletContext();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        ClassroomService.getUpcomingClasses().then(setClasses);
    }, []);

    // Filter classes based on search query
    const filteredClasses = classes.filter(cls => {
        const title = cls.title || '';
        const subject = cls.subject || '';
        const instructor = cls.instructor || '';
        const query = searchQuery?.toLowerCase() || '';
        return title.toLowerCase().includes(query) ||
            subject.toLowerCase().includes(query) ||
            instructor.toLowerCase().includes(query);
    });

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>My Classes</h1>
                <p>Manage your enrolled and upcoming sessions.</p>
            </header>
            <div className="classes-grid">
                {filteredClasses.length === 0 ? (
                    <div className="no-results">
                        <p>{searchQuery ? `No classes found matching "${searchQuery}"` : "No classes scheduled."}</p>
                    </div>
                ) : (
                    filteredClasses.map(cls => {
                        const status = getClassStatus(cls);
                        const isCompleted = status === 'completed';
                        return (
                            <div key={cls.id} className={`class-card-wrapper ${isCompleted ? 'class-completed' : ''}`}>
                                <Card title={cls.title}>
                                    {isCompleted && (
                                        <div className="completed-badge">
                                            <CheckCircle size={14} />
                                            Completed
                                        </div>
                                    )}
                                    <div className="class-detail">
                                        <p><strong>Instructor:</strong> {cls.instructor}</p>
                                        {cls.date && cls.date !== 'TBD' && (
                                            <p><strong>Date:</strong> {cls.date}</p>
                                        )}
                                        <p><strong>Time:</strong> {cls.time}</p>
                                        <span className={`status-pill ${status}`}>{status}</span>
                                    </div>
                                </Card>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ClassesPage;
