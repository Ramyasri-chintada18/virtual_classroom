import client from './client';

export const login = async (user_id, password) => {
    const response = await client.post('/auth/login', {
        user_id,
        password
    });
    return response.data;
};

export const register = async (userData) => {
    const response = await client.post('/auth/register', userData);
    return response.data;
};

export const getMe = async () => {
    const response = await client.get('/auth/me');
    return response.data;
};
