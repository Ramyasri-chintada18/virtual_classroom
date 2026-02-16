import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: ''
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl mb-4 font-bold">Register</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>
                <Button type="submit" className="w-full">Register</Button>
                <p className="mt-4 text-sm text-center">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
