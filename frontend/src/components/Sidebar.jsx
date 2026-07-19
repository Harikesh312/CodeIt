import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Settings as SettingsIcon, LogOut, Home, Target, Sun, Moon } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { useTheme } from '../context/ThemeContext';
import { ROLES } from '../utils/constants';
import Logo from './Logo';
import LogoutModal from './LogoutModal';

export default function Sidebar() {
  const { user, role, reset } = useInterview();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    reset();
    navigate('/');
  };

  const navItems = role === ROLES.CANDIDATE ? [
    { name: 'Dashboard', path: '/join', icon: LayoutDashboard },
    { name: 'My Profile', path: '/join', icon: UserCircle },
  ] : [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Interview Sessions', path: '/sessions', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <>
      <aside 
        className="w-[280px] h-full flex flex-col py-7 border-r transition-all duration-300"
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderColor: 'var(--color-border)' 
        }}
      >
        {/* Logo */}
        <div className="px-7 mb-8 flex items-center gap-3.5">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #4F8BFF, #7C5CFF)',
              boxShadow: '0 4px 20px rgba(124, 92, 255, 0.3)'
            }}
          >
            <Logo size={26} />
          </div>
          <span className="text-[22px] font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Code<span style={{ color: 'var(--color-primary-light)' }}>It</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 px-4" style={{ color: 'var(--color-text-muted)' }}>
            Main Menu
          </p>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 relative group ${
                  isActive 
                    ? '' 
                    : 'hover:bg-white/[0.04]'
                }`}
                style={{
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  backgroundColor: isActive ? 'rgba(124, 92, 255, 0.1)' : undefined,
                }}
              >
                {isActive && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }}
                  />
                )}
                <item.icon 
                  size={18} 
                  className="transition-colors duration-200"
                  style={{ color: isActive ? 'var(--color-primary)' : undefined }}
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 flex flex-col gap-2">
          {/* Today's Progress Card */}
          <div 
            className="mx-1 p-4 rounded-xl relative overflow-hidden mb-2"
            style={{ 
              backgroundColor: 'rgba(124, 92, 255, 0.05)', 
              border: '1px solid rgba(124, 92, 255, 0.1)' 
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: 'rgba(124, 92, 255, 0.1)' }} />
            
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                <Target size={11} style={{ color: 'var(--color-primary)' }} /> Today's Goal
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(124, 92, 255, 0.1)' }}>66%</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Circular Progress */}
              <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="66, 100" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-bold tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>2/3</span>
              </div>
              
              {/* Stats */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Completed</span>
                  <span className="text-[11px] font-bold" style={{ color: 'var(--color-success)' }}>2</span>
                </div>
                <div className="h-px w-full" style={{ backgroundColor: 'var(--color-border)' }} />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Pending</span>
                  <span className="text-[11px] font-bold" style={{ color: 'var(--color-warning)' }}>1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
              location.pathname === '/settings' ? '' : 'hover:bg-white/[0.04]'
            }`}
            style={{
              color: location.pathname === '/settings' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              backgroundColor: location.pathname === '/settings' ? 'rgba(124, 92, 255, 0.1)' : undefined,
            }}
          >
            <SettingsIcon size={18} style={{ color: location.pathname === '/settings' ? 'var(--color-primary)' : undefined }} />
            <span>Settings</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 hover:bg-white/[0.04]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* User profile / Logout */}
        <div className="px-5 pt-5 mt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shadow"
                style={{ background: 'linear-gradient(135deg, #4F8BFF, #7C5CFF)' }}
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="truncate">
                <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'User'}</p>
                <p className="text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>{role === ROLES.HR ? 'Interviewer' : 'Candidate'}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="p-2 rounded-lg transition-all duration-200 hover:bg-red-500/10"
              style={{ color: 'var(--color-text-muted)' }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />
    </>
  );
}
