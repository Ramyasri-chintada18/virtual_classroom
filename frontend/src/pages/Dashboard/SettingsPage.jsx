import React from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../store/AuthStore';
import './DashboardPages.css';

const SettingsPage = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Settings</h1>
                <p>Manage your account and preferences.</p>
            </header>
            <div className="settings-container">
                <Card title="Profile Information">
                    <div className="settings-form">
                        <Input label="Email" value={user?.email || ''} disabled />
                        <Input label="Display Name" placeholder="Your Name" />
                        <Button variant="primary">Save Changes</Button>
                    </div>
                </Card>
                <Card title="Preferences" className="mt-md">
                    <div className="settings-options">
                        <div className="option-item">
                            <span>Email Notifications</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                        <div className="option-item">
                            <span>Dark Mode</span>
                            <input type="checkbox" defaultChecked disabled />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
