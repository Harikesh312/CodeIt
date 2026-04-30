import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, LayoutDashboard, LogOut, Menu, X, Wifi, WifiOff, Copy, RefreshCw } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Badge from './ui/Badge';
import Timer from './Timer';

export default function Navbar({ showTimer = false }) {
  const { user, role, roomTitle, roomCode, createdBy, isSocketConnected, toggleSidebar, sidebarOpen, reset, endInterview } =
    useInterview();
  const navigate = useNavigate();
  const location = useLocation();

  const isInRoom = location.pathname.startsWith('/room');

  const handleLogout = () => {
    reset();
    navigate('/');
  };

  return (
    <header className="h-14 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center px-4 gap-4 z-40 sticky top-0">
      {/* Sidebar toggle (HR only) */}
      {role === ROLES.HR && !isInRoom && (
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* Logo */}
      <Link
        to={role === ROLES.HR ? '/dashboard' : '/'}
        className="flex items-center gap-2 text-white font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
      >
        <span className="bg-blue-600 p-1 rounded-md">
          <Code2 size={18} />
        </span>
        <span>
          Code<span className="text-blue-400">It</span>
        </span>
      </Link>

      {/* Room title (in room) */}
      {isInRoom && (
        <div className="hidden sm:flex items-center gap-2 text-gray-400 text-sm">
          {roomTitle && (
            <>
              <span className="text-gray-600">/</span>
              <span className="text-gray-200 font-medium truncate max-w-48">{roomTitle}</span>
            </>
          )}
          {role === ROLES.CANDIDATE && createdBy && (
            <span className="text-gray-500 ml-2 hidden lg:inline">
              (Interviewer: <span className="text-gray-300 font-medium">{createdBy}</span>)
            </span>
          )}
          {roomCode && (
            <>
              <span className="text-gray-600 ml-2">ID:</span>
              <code className="text-xs font-mono bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded-md text-gray-300">
                {roomCode}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(roomCode)}
                className="p-1 rounded text-gray-500 hover:text-blue-400 transition-colors"
                title="Copy Room ID"
              >
                <Copy size={12} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Timer (in room) */}
      {(showTimer || isInRoom) && (
        <div className="hidden sm:block">
          <Timer compact />
        </div>
      )}

      {/* Socket status */}
      {isInRoom && (
        <div className="items-center gap-1.5 text-xs hidden sm:flex">
          {isSocketConnected ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi size={13} /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 animate-pulse">
              <RefreshCw size={13} className="animate-spin" /> Reconnecting…
            </span>
          )}
        </div>
      )}

      {/* Leave/End Interview Button */}
      {isInRoom && (
        <button
          onClick={() => {
            if (role === ROLES.HR) {
              if (window.confirm('Are you sure you want to end this interview? The room will be closed for all participants.')) {
                endInterview();
                navigate('/dashboard');
              }
            } else {
              if (window.confirm('Are you sure you want to leave this interview?')) {
                reset();
                navigate('/');
              }
            }
          }}
          className="ml-4 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors hidden sm:block"
        >
          {role === ROLES.HR ? 'End Interview' : 'Leave Interview'}
        </button>
      )}

      {/* User info */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-gray-200 text-xs font-medium leading-none">{user.name}</span>
              <Badge variant={role === ROLES.HR ? 'hr' : 'candidate'} className="mt-0.5">
                {role === ROLES.HR ? 'HR' : 'Candidate'}
              </Badge>
            </div>
          </div>

          {role === ROLES.HR && (
            <Link
              to="/dashboard"
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
              title="Dashboard"
            >
              <LayoutDashboard size={16} />
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
