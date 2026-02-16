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
                time: room.start_time || 'TBD',
                status: 'upcoming',
                students: room.total_participants || 0
            }));
        } catch (error) {
            console.error('Failed to fetch rooms', error);
            return [];
        }
    },

    async createClass(classData) {
        try {
            // Requirements: use title, date, time, capacity
            const newRoom = await createRoom({
                title: classData.title,
                description: classData.description || '',
                date: classData.date,
                time: classData.time,
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
        // Still mocking progress for now
        return {
            completedLessons: 12,
            pendingAssignments: 3,
            attendanceRate: '92%'
        };
    }
};

export default ClassroomService;
