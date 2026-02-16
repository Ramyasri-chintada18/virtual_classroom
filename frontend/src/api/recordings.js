import client from './client';

export const getRecordings = async (roomId) => {
    const response = await client.get(`/recordings/${roomId}`);
    return response.data;
};

export const uploadRecording = async (roomId, formData) => {
    const response = await client.post(`/recordings/${roomId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
