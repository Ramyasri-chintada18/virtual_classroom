import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import ClassroomService from '../../services/classroom.service';
import './DashboardPages.css';

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        ClassroomService.getUpcomingClasses().then(setClasses);
    }, []);

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>My Classes</h1>
                <p>Manage your enrolled and upcoming sessions.</p>
            </header>
            <div className="classes-grid">
                {classes.map(cls => (
                    <Card key={cls.id} title={cls.title}>
                        <div className="class-detail">
                            <p><strong>Instructor:</strong> {cls.instructor}</p>
                            <p><strong>Time:</strong> {cls.time}</p>
                            <span className={`status-pill ${cls.status}`}>{cls.status}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ClassesPage;
