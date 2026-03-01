import { getRooms, createRoom } from '../api/classroom';
import client from '../api/client';

const ClassroomService = {
    async getUpcomingClasses() {
        try {
            const response = await client.get('/dashboard/my-classes');
            const classes = response.data.classes || [];
            return classes.map(room => ({
                id: room.class_id,
                title: room.class_name,
                instructor: room.created_by,
                date: room.scheduled_date || 'TBD',
                time: room.start_time || 'TBD',
                status: 'upcoming',
                students: room.total_participants || 0
            }));
        } catch (error) {
            console.error('Failed to fetch rooms', error);
            return [];
        }
    },

    async getTodayClasses() {
        try {
            const response = await client.get('/teacher/today-classes');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch today classes', error);
            return [];
        }
    },

    async getCalendarClasses() {
        try {
            const response = await client.get('/teacher/calendar-classes');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch calendar classes', error);
            return [];
        }
    },

    async createClass(classData) {
        try {
            const newRoom = await createRoom({
                title: classData.title,
                subject: classData.subject,
                description: classData.description || '',
                date: classData.date,
                time: classData.time,
                end_time: classData.end_time,
                capacity: parseInt(classData.capacity) || 50
            });
            return {
                ...newRoom,
                id: newRoom.id,
                title: newRoom.title,
                status: 'upcoming'
            };
        } catch (error) {
            console.error('Failed to create room', error);
            throw error;
        }
    },

    async deleteClass(classId) {
        try {
            await client.delete(`/classrooms/${classId}`);
            return true;
        } catch (error) {
            console.error('Failed to delete class', error);
            throw error;
        }
    },

    async getTeacherStats() {
        try {
            const response = await client.get('/dashboard/overview');
            const overview = response.data;
            return {
                activeClasses: overview.active_classes,
                totalStudents: overview.total_students,
                averageEngagement: `${overview.engagement_rate}%`
            };
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
            return {
                activeClasses: 0,
                totalStudents: 0,
                averageEngagement: '0%'
            };
        }
    },

    async getStudentProgress() {
        return {
            completedLessons: 0,
            pendingAssignments: 0,
            attendanceRate: '0%'
        };
    }
};

export default ClassroomService;
