import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthStore';
import { NotificationProvider } from './store/NotificationStore';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import ClassroomLayout from './layouts/ClassroomLayout';
import AuthPage from './pages/AuthPage';
import ClassroomPage from './pages/ClassroomPage';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import ClassesPage from './pages/Dashboard/ClassesPage';
import RecordingsPage from './pages/Dashboard/RecordingsPage';
import CalendarPage from './pages/Dashboard/CalendarPage';
import SettingsPage from './pages/Dashboard/SettingsPage';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Navigate to="/dashboard/student" replace />} />

                  {/* Teacher Dashboard */}
                  <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                    <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
                  </Route>

                  {/* Student Dashboard */}
                  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="/dashboard/student" element={<StudentDashboard />} />
                  </Route>

                  {/* Shared Dashboard Sub-pages */}
                  <Route path="/classes" element={<ClassesPage />} />
                  <Route path="/recordings" element={<RecordingsPage />} />
                  <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                    <Route path="/calendar" element={<CalendarPage />} />
                  </Route>
                  <Route path="/settings" element={<SettingsPage view="profile" />} />
                  <Route path="/management" element={<SettingsPage view="management" />} />
                </Route>
              </Route>

              {/* Classroom Routes (Protected) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/classroom/:roomId" element={<ClassroomLayout />}>
                  <Route index element={<ClassroomPage />} />
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
