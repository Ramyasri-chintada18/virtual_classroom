import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
        return response.data;
    }
};

export default recordingService;
