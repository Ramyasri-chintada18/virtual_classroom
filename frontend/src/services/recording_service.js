import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
// Backend root for serving static files (recordings)
const BACKEND_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '');

const toAbsoluteUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url; // already absolute
    return `${BACKEND_BASE}${url}`;
};

const recordingService = {
    uploadRecording: async (roomId, blob) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        const filename = `recording_${Date.now()}.webm`;
        formData.append('file', blob, filename);

        const response = await axios.post(`${API_URL}/recordings/${roomId}/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getRoomRecordings: async (roomId) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/recordings/${roomId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getUserRecordings: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/recordings/my`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        // Return only the recordings array and normalize IDs
        const recordings = response.data.recordings || [];
        return recordings.map(rec => ({
            ...rec,
            id: rec.recording_id || rec.id,
            title: rec.class_name || rec.filename,
            date: rec.uploaded_at || rec.created_at,
            video_url: toAbsoluteUrl(rec.file_url || rec.video_url)
        }));
    },

    getTeacherRecordings: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/teacher/recordings`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const recordings = response.data || [];
        return recordings.map(rec => ({
            ...rec,
            id: rec.id,
            title: rec.class_title || rec.filename,
            date: rec.date || rec.uploaded_at || rec.created_at,
            video_url: toAbsoluteUrl(rec.video_url || rec.file_url)
        }));
    },

    deleteRecording: async (recordingId) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/recordings/${recordingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }
};

export default recordingService;
