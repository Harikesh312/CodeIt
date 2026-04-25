import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JoinRoomPage from './pages/JoinRoomPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import { ROLES } from './utils/constants';

// ── Route guard: requires a logged-in user ───────────────────────────────────
function ProtectedRoute({ children, requiredRole }) {
  const { user, role } = useInterview();
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
      <Route path="/" element={<LoginPage />} />

      {/* HR only */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole={ROLES.HR}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InterviewProvider>
        <AppRoutes />
      </InterviewProvider>
    </BrowserRouter>
  );
}
