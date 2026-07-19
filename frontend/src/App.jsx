import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import { ToastProvider } from './components/ToastProvider';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import JoinRoomPage from './pages/JoinRoomPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import SessionsPage from './pages/SessionsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HRLayout from './components/HRLayout';
import { ROLES } from './utils/constants';
import LoadingSpinner from './components/ui/LoadingSpinner';

// ── Route guard: requires a logged-in user ───────────────────────────────────
function ProtectedRoute({ children, requiredRole }) {
  const { user, role, isRestoringSession } = useInterview();

  // Show loading spinner while session is being restored from localStorage
  if (isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050816' }}>
        <LoadingSpinner size="lg" text="Restoring session…" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === ROLES.HR ? '/dashboard' : '/join'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Candidate only */}
      <Route
        path="/join"
        element={
          <ProtectedRoute requiredRole={ROLES.CANDIDATE}>
            <JoinRoomPage />
          </ProtectedRoute>
        }
      />

      {/* Both roles */}
      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <InterviewRoomPage />
          </ProtectedRoute>
        }
      />

      {/* HR only (Layout routes) */}
      <Route
        element={
          <ProtectedRoute requiredRole={ROLES.HR}>
            <HRLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <InterviewProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </InterviewProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
