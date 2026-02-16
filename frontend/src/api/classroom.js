import client from './client';

export const createRoom = async (roomData) => {
    const response = await client.post('/classrooms/', roomData);
    return response.data;
};

export const joinRoom = async (roomId) => {
    const response = await client.post(`/classrooms/${roomId}/join`);
    return response.data;
};

export const getRooms = async () => {
    const response = await client.get('/classrooms/');
    return response.data;
};

export const getRoom = async (roomId) => {
    const response = await client.get(`/classrooms/${roomId}`);
    return response.data;
};
