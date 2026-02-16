import React from 'react';
import './RoleSwitcher.css';

const RoleSwitcher = ({ selectedRole, onRoleChange }) => {
    return (
        <div className="role-switcher">
            <button
                className={`role-button ${selectedRole === 'student' ? 'active' : ''}`}
                onClick={() => onRoleChange('student')}
            >
                <span className="role-label">I'm a Student</span>
            </button>
            <button
                className={`role-button ${selectedRole === 'teacher' ? 'active' : ''}`}
                onClick={() => onRoleChange('teacher')}
            >
                <span className="role-label">I'm a Teacher</span>
            </button>
        </div>
    );
};

export default RoleSwitcher;
