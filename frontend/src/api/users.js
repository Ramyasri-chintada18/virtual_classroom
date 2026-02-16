import client from './client';

export const getUsers = async () => {
    const response = await client.get('/users/');
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await client.put(`/users/${userId}`, userData);
    return response.data;
};
