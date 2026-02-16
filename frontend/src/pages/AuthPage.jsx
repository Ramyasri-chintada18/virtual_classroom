import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/common/Card';
import RoleSwitcher from '../components/auth/RoleSwitcher';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../store/AuthStore';
import './AuthPage.css';

const AuthPage = () => {
    const [role, setRole] = useState('student');
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (data) => {
        console.log('Form submission:', { mode, role, data });
        if (mode === 'login') {
            const result = await login(role, data);
            if (result.success) {
                console.log('Login success - navigating to dashboard');
                navigate(`/dashboard/${role}`);
            } else {
                console.error('Login failed:', result.message);
                alert(result.message);
            }
        } else {
            const result = await signup(role, data);
            if (result.success) {
                console.log('Signup success - switching to login');
                alert(result.message);
                setMode('login'); // Switch to login mode to allow manual verification
            } else {
                console.error('Signup failed:', result.message);
                alert(result.message);
            }
        }
    };

    return (
        <AuthLayout>
            <Card className="auth-card">
                <header className="auth-header">
                    <div className="auth-logo">
                        <span className="logo-icon">V</span>
                        <h2>Virtual Classroom</h2>
                    </div>
                    <p className="auth-subtitle">
                        {mode === 'login'
                            ? 'Welcome back! Please enter your details.'
                            : 'Join our community! Create your account.'
                        }
                    </p>
                </header>

                <RoleSwitcher selectedRole={role} onRoleChange={setRole} />

                <AuthForm role={role} mode={mode} onSubmit={handleAuth} />

                <footer className="auth-footer">
                    <p>
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button
                            className="text-link"
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        >
                            {mode === 'login' ? ' Register here' : ' Login here'}
                        </button>
                    </p>
                </footer>
            </Card>
        </AuthLayout>
    );
};

export default AuthPage;
