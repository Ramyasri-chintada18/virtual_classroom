import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ClassroomService from '../../services/classroom.service';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, BookOpen } from 'lucide-react';
import './DashboardPages.css';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setLoading(true);
                const data = await ClassroomService.getCalendarClasses();
                setClasses(data);
            } catch (error) {
                console.error("Failed to fetch calendar classes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendarData();
    }, []);

    // Calendar logic
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderHeader = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
            <div className="calendar-header">
                <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <div className="calendar-nav">
                    <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                        <ChevronLeft size={20} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                        <ChevronRight size={20} />
                    </Button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        // Previous month padding
        const prevMonthLastDay = daysInMonth(year, month - 1);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(<div key={`prev-${i}`} className="calendar-day not-current-month">{prevMonthLastDay - i}</div>);
        }

        // Current month days
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
            const isSelected = selectedDate.toDateString() === new Date(year, month, d).toDateString();
            const hasClasses = classes.some(c => c.scheduled_date === dateStr);

            days.push(
                <div
                    key={d}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(new Date(year, month, d))}
                >
                    <span>{d}</span>
                    {hasClasses && <div className="class-dot"></div>}
                </div>
            );
        }

        return days;
    };

    const getSelectedDayClasses = () => {
        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        return classes.filter(c => c.scheduled_date === dateStr);
    };

    const selectedClasses = getSelectedDayClasses();

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Academic Calendar</h1>
                <p>Track your teaching schedule and upcoming sessions.</p>
            </header>

            <div className="calendar-layout">
                <Card className="calendar-card">
                    {renderHeader()}
                    <div className="calendar-grid">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="calendar-day-head">{day}</div>
                        ))}
                        {renderDays()}
                    </div>
                </Card>

                <div className="selected-day-details">
                    <Card title={selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}>
                        <div className="day-classes-list">
                            {selectedClasses.length === 0 ? (
                                <div className="empty-mini-state">
                                    <p>No classes scheduled for this date.</p>
                                </div>
                            ) : (
                                selectedClasses.map(cls => (
                                    <div key={cls.id} className="mini-class-card">
                                        <h5>{cls.title}</h5>
                                        <div className="mini-meta">
                                            <span><BookOpen size={12} /> {cls.subject}</span>
                                            <span><Clock size={12} /> {cls.time}</span>
                                        </div>
                                        <span className={`class-status-tag ${cls.status.toLowerCase()}`}>{cls.status}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
