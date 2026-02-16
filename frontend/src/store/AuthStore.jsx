import { useState, createContext, useContext, useEffect } from 'react';
import { login as loginApi, register as signupApi, getMe } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to restore session', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (role, credentials) => {
        console.log('Login attempt:', { role, credentials });
        try {
            // Requirement: Login uses user_id and password
            const data = await loginApi(credentials.user_id, credentials.password);
            console.log('Login successful, received token');

            localStorage.setItem('token', data.access_token);
            const userData = await getMe();
            console.log('User profile loaded:', userData);

            if (userData.role !== role) {
                console.warn('Role mismatch:', { expected: role, actual: userData.role });
                localStorage.removeItem('token');
                setUser(null);
                throw new Error(`Unauthorized: This account is registered as a ${userData.role}`);
            }

            setUser(userData);
            return { success: true };
        } catch (error) {
            let message = error.response?.data?.detail || error.message || 'Login failed';

            // Handle FastAPI validation errors (arrays of objects)
            if (Array.isArray(message)) {
                message = message.map(err => `${err.loc[err.loc.length - 1]}: ${err.msg}`).join('\n');
            }

            return { success: false, message };
        }
    };

    const signup = async (role, data) => {
        console.log('Signup attempt:', { role, data });
        try {
            // Map frontend fields to backend fields
            const registerData = {
                email: data.email,
                user_id: data.user_id,
                full_name: data.name,
                role: role,
                password: data.password
            };
            console.log('Sending register data:', registerData);

            await signupApi(registerData);
            console.log('Signup successful');
            return { success: true, message: 'Registration Successful! You can now login.' };
        } catch (error) {
            console.error('Signup error:', error);
            let message = error.response?.data?.detail || error.message || 'Registration failed';

            if (Array.isArray(message)) {
                message = message.map(err => `${err.loc[err.loc.length - 1]}: ${err.msg}`).join('\n');
            }

            return { success: false, message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
