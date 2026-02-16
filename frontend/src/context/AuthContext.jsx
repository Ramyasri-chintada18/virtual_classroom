import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (username, password) => {
        try {
            const data = await loginApi(username, password);
            localStorage.setItem('token', data.access_token);
            const userData = await getMe();
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
