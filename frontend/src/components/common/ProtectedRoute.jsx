import React from 'react';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../store/AuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    // Forward any context passed from a parent outlet (e.g. searchQuery from DashboardLayout)
    const parentContext = useOutletContext();

    if (loading) {
        return <div className="loading-spinner">Authenticating...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={`/dashboard/${user.role}`} replace />;
    }

    // Pass the parent context through so child pages can still access searchQuery etc.
    return <Outlet context={parentContext} />;
};

export default ProtectedRoute;
