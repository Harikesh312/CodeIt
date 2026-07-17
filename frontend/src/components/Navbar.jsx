import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Code2, LayoutDashboard, LogOut, Menu, X, Wifi, WifiOff, Copy, RefreshCw,
  User, Shield, Bell, Palette, Settings, ChevronDown, Home
} from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Badge from './ui/Badge';
import Timer from './Timer';

export default function Navbar({ showTimer = false }) {
  const { user, role, roomTitle, roomCode, createdBy, isSocketConnected, toggleSidebar, sidebarOpen, reset, endInterview } =
    useInterview();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isInRoom = location.pathname.startsWith('/room');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    reset();
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Profile', action: () => { setDropdownOpen(false); navigate('/profile'); } },
  ];

  return (
    <header
      className="h-[80px] backdrop-blur-md flex items-center px-6 md:px-10 gap-8 z-40 sticky top-0"
      style={{ backgroundColor: 'rgba(10, 15, 28, 0.85)', borderBottom: '1px solid var(--color-border)' }}
    >
      {/* Sidebar toggle (HR only) */}
      {role === ROLES.HR && !isInRoom && (
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          style={{ color: '#94A3B8' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.backgroundColor = '#182235'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* Logo */}
      <Link
        to={role === ROLES.HR ? '/dashboard' : '/'}
        className="flex items-center gap-2.5 font-extrabold text-2xl tracking-tight transition-opacity hover:opacity-80"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <span className="p-1.5 rounded-xl" style={{ backgroundColor: 'var(--color-primary)' }}>
          <Code2 size={24} />
        </span>
        <span>
          Code<span style={{ color: 'var(--color-primary-light)' }}>It</span>
        </span>
      </Link>

      {/* Room title (in room) */}
      {isInRoom && (
        <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
          {roomTitle && (
            <>
              <span style={{ color: '#334155' }}>/</span>
              <span className="font-medium truncate max-w-48" style={{ color: '#F8FAFC' }}>{roomTitle}</span>
            </>
          )}
          {role === ROLES.CANDIDATE && createdBy && (
            <span className="ml-2 hidden lg:inline" style={{ color: '#64748B' }}>
              (Interviewer: <span className="font-medium" style={{ color: '#E2E8F0' }}>{createdBy}</span>)
            </span>
          )}
          {roomCode && (
            <>
              <span className="ml-2" style={{ color: '#334155' }}>ID:</span>
              <code
                className="text-xs font-mono px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#94A3B8' }}
              >
                {roomCode}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(roomCode)}
                className="p-1 rounded transition-colors"
                style={{ color: '#64748B' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#818CF8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
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
            <span className="flex items-center gap-1" style={{ color: '#10B981' }}>
              <Wifi size={13} /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1 animate-pulse" style={{ color: '#F59E0B' }}>
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
          className="ml-4 px-3.5 py-1.5 text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 hidden sm:block cursor-pointer"
          style={{ backgroundColor: '#EF4444' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F87171'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EF4444'; }}
        >
          {role === ROLES.HR ? 'End Interview' : 'Leave Interview'}
        </button>
      )}

      {/* User info + Profile Dropdown */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: dropdownOpen ? 'var(--color-card)' : 'transparent',
              border: dropdownOpen ? '1px solid var(--color-border)' : '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!dropdownOpen) { e.currentTarget.style.backgroundColor = 'var(--color-card)'; }
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) { e.currentTarget.style.backgroundColor = 'transparent'; }
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shadow-sm"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="hidden sm:flex flex-col items-center justify-center mr-2">
              <Badge variant={role === ROLES.HR ? 'hr' : 'candidate'} className="px-2 py-1 text-[10px]">
                {role === ROLES.HR ? 'Interviewer' : 'Candidate'}
              </Badge>
            </div>
            <ChevronDown
              size={16}
              className={`hidden sm:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              style={{ color: '#64748B' }}
            />
          </button>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden animate-scale-in z-50"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                transformOrigin: 'top right',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Profile Header */}
              <div className="p-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg"
                    style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 20px rgba(91,108,255,0.3)' }}
                  >
                    {user.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#F8FAFC' }}>{user.name}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: '#818CF8' }}>
                      {role === ROLES.HR ? 'Interviewer' : 'Candidate'}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#64748B' }}>
                      {user.name?.toLowerCase().replace(/\s+/g, '.') || 'user'}@codeit.io
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 px-2">
                {menuItems.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer"
                      style={{ color: '#94A3B8' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#182235';
                        e.currentTarget.style.color = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#94A3B8';
                      }}
                    >
                      <ItemIcon size={16} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Divider + Logout */}
              <div className="px-2 pb-2" style={{ borderTop: '1px solid #283548' }}>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 mt-2 cursor-pointer"
                  style={{ color: '#F87171' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
                    e.currentTarget.style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#F87171';
                  }}
                >
                  <LogOut size={16} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right Side Icons: Home & Logout */}
      {user && (
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="p-2 rounded-xl transition-all duration-200 flex items-center justify-center"
            style={{ color: '#94A3B8', border: '1px solid transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.backgroundColor = '#182235'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            title="Landing Page"
          >
            <Home size={18} />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl transition-all duration-200 flex items-center justify-center"
            style={{ color: '#94A3B8', border: '1px solid transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F87171'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </header>
  );
}
