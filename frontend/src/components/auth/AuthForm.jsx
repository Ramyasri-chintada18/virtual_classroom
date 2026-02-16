import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import './AuthForm.css';

const AuthForm = ({ role, mode, onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        user_id: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'signup') {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            // Logic requirement: password and user_id must match for registration
            // Although backend handles this, we can enforce it frontend too
            if (formData.user_id !== formData.password) {
                alert(`Registration Requirement: Password must be identical to your ${role === 'teacher' ? 'Teacher ID' : 'Roll Number'}!`);
                return;
            }
        }

        onSubmit(formData);
    };

    const userIdLabel = role === 'teacher' ? 'Teacher ID' : 'Roll Number';
    const userIdPlaceholder = role === 'teacher' ? 'e.g. TCH-2026-001' : 'e.g. 2021BCS001';

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {/* COMMON FIELDS for SIGNUP */}
            {mode === 'signup' && (
                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                />
            )}

            {/* USER ID FIELD (Used in both Login and Signup) */}
            <Input
                label={userIdLabel}
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                placeholder={userIdPlaceholder}
                required
            />

            {/* EMAIL FIELD (Only for Signup now) */}
            {mode === 'signup' && (
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@university.edu"
                    required
                />
            )}

            {/* SHARED PASSWORD FIELD */}
            <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
            />

            {/* SIGNUP CONFIRM PASSWORD */}
            {mode === 'signup' && (
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
            )}

            <Button type="submit" variant="primary" className="width-full">
                {mode === 'login'
                    ? (role === 'teacher' ? 'Login as Teacher' : 'Join as Student')
                    : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                }
            </Button>
        </form>
    );
};

export default AuthForm;
