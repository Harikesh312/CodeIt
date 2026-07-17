import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Settings as SettingsIcon, LogOut, Code2, Plus, Home, Target } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Button from './ui/Button';

export default function Sidebar() {
  const { user, role, reset } = useInterview();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    reset();
  };

  const navItems = role === ROLES.CANDIDATE ? [
    { name: 'Dashboard', path: '/join', icon: LayoutDashboard },
    { name: 'My Profile', path: '/join', icon: UserCircle },
    { name: 'Coding Tests', path: '/join', icon: Code2 },
  ] : [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Interview Sessions', path: '/sessions', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <aside className="w-[320px] h-full flex flex-col pt-8 pb-6 border-r transition-all" style={{ background: 'linear-gradient(to bottom, var(--color-surface), rgba(19, 30, 49, 0.4))', borderColor: 'var(--color-border)' }}>
      {/* Logo */}
      <div className="px-8 mb-10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(91,108,255,0.3)]" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-secondary))' }}>
          <Code2 size={24} />
        </div>
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>CodeIt</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 space-y-3 overflow-y-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-4 px-4" style={{ color: 'var(--color-text-muted)' }}>Main Menu</p>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-300 relative overflow-hidden group ${
                isActive 
                  ? 'bg-indigo-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                  : 'hover:bg-slate-800/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
              }`}
              style={{
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-indigo-500 shadow-[0_0_12px_var(--color-primary)]"></div>
              )}
              <item.icon size={20} className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats Widget & Settings */}
      <div className="px-5 mb-4 flex flex-col gap-4">
        {/* Today's Progress Card */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-3">
             <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
               <Target size={12} className="text-indigo-400" /> Today's Goal
             </h4>
             <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">66%</span>
          </div>

          <div className="flex items-center gap-4">
             {/* Circular Progress */}
             <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                   <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                   <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="66, 100" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-bold text-white tracking-tighter">2/3</span>
             </div>
             
             {/* Stats */}
             <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-medium text-slate-300">Completed</span>
                   <span className="text-[11px] font-bold text-emerald-400">2</span>
                </div>
                <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}></div>
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-medium text-slate-400">Pending</span>
                   <span className="text-[11px] font-bold text-amber-400">1</span>
                </div>
             </div>
          </div>
        </div>

        {/* Settings Link (Below Widget) */}
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-300 group ${
            location.pathname === '/settings' 
              ? 'bg-indigo-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-white' 
              : 'hover:bg-slate-800/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] text-slate-400'
          }`}
          style={{
            color: location.pathname === '/settings' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          }}
        >
          <SettingsIcon size={20} className={`transition-colors duration-300 ${location.pathname === '/settings' ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
          <span>Settings</span>
        </button>
      </div>

      {/* Action Area */}
      <div className="px-5 pt-6 mt-2 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold truncate tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'User'}</p>
              <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{role === ROLES.HR ? 'HR / Interviewer' : 'Candidate'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-xl transition-all hover:bg-rose-500/10 hover:text-rose-400" style={{ color: 'var(--color-text-muted)' }} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
