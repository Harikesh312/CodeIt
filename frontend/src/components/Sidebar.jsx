import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Settings as SettingsIcon, LogOut, Code2, Plus } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import Button from './ui/Button';

export default function Sidebar() {
  const { user, reset } = useInterview();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    reset();
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Interview Sessions', path: '/sessions', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-[280px] h-full flex flex-col pt-6 pb-6 border-r transition-all" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      {/* Logo */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-secondary))' }}>
          <Code2 size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>CodeIt</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-4 overflow-y-auto">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2 px-3" style={{ color: 'var(--color-text-muted)' }}>Main Menu</p>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-250 ${
                isActive 
                  ? 'bg-indigo-500/10 shadow-sm' 
                  : 'hover:bg-white/5'
              }`}
              style={{
                color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
              }}
            >
              <item.icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Area */}
      <div className="px-6 pt-6 mt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <Button 
          variant="primary" 
          className="w-full justify-center mb-6" 
          icon={Plus} 
          onClick={() => navigate('/sessions')}
        >
          Create Session
        </Button>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'User'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--color-text-muted)' }} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
