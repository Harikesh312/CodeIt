import React, { useState } from 'react';
import { User, LogOut, Edit2, Mail, Briefcase, Calendar, Key, UserCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const { user, reset, role } = useInterview();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    reset();
  };

  return (
    <div className="relative max-w-5xl mx-auto h-full flex flex-col space-y-8 animate-fade-in pb-12 w-full z-0">
      
      {/* Background Watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1] opacity-[0.03] blur-[2px]">
        <UserCircle size={800} className="text-indigo-400" />
      </div>

      {/* Top Card */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-10 rounded-3xl transition-all duration-250 hover-elevate soft-glow glass-panel">
        {/* Watermark */}
        <UserCircle className="absolute -left-10 -bottom-10 w-64 h-64 opacity-[0.03] text-indigo-400 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-8">
          <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl font-extrabold shadow-md" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              {user?.name || 'Interviewer'}
            </h1>
            <div className="flex items-center gap-5 text-[15px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-2"><Briefcase size={18} /> {role === 'hr' ? 'HR / Interviewer' : 'Candidate'}</span>
              <span className="opacity-40 text-lg">&bull;</span>
              <span className="flex items-center gap-2"><Mail size={18} /> {user?.email || 'user@company.com'}</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4 sm:w-auto w-full">
          <Button variant="ghost" icon={LogOut} onClick={handleLogout} className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 flex-1 sm:flex-none">
            Sign Out
          </Button>
          <Button variant="primary" icon={Edit2} onClick={() => setIsEditing(!isEditing)} className="flex-1 sm:flex-none">
            {isEditing ? 'Save' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        
        {/* Personal Information */}
        <div className="relative overflow-hidden p-10 rounded-3xl transition-all duration-250 hover-elevate soft-glow glass-panel card-accent-info">
          <User className="absolute right-4 bottom-4 w-48 h-48 opacity-[0.02] text-indigo-400 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="mb-8 flex items-center gap-3 font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              <UserCircle size={24} style={{ color: 'var(--color-primary)' }} /> Personal Information
            </h3>
            
            <div className="space-y-8 mt-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-text-muted)' }}>Full Name</span>
                {isEditing ? (
                  <input type="text" defaultValue={user?.name || ''} className="w-full rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              ) : (
                <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'Not provided'}</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-text-muted)' }}>Email Address</span>
              {isEditing ? (
                <input type="email" defaultValue={user?.email || ''} className="w-full rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              ) : (
                <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user?.email || 'Not provided'}</span>
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-text-muted)' }}>Organization</span>
              {isEditing ? (
                <input type="text" defaultValue="CodeIt Enterprise" className="w-full rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              ) : (
                <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>CodeIt Enterprise</span>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="relative overflow-hidden p-10 rounded-3xl transition-all duration-250 hover-elevate soft-glow glass-panel card-accent-success">
          <Key className="absolute right-4 bottom-4 w-48 h-48 opacity-[0.02] text-indigo-400 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="mb-8 flex items-center gap-3 font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              <Key size={24} style={{ color: 'var(--color-primary)' }} /> Account Information
            </h3>
            
            <div className="space-y-8 mt-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-text-muted)' }}>Account Role</span>
                {isEditing ? (
                  <select disabled className="w-full rounded-2xl px-5 py-4 text-sm font-medium transition-all shadow-sm opacity-50 cursor-not-allowed appearance-none" style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <option>{role === 'hr' ? 'HR / Interviewer' : 'Candidate'}</option>
                </select>
              ) : (
                <span className="text-[15px] font-semibold flex items-center gap-2.5" style={{ color: 'var(--color-text-primary)' }}>
                  <div className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--color-success)]" style={{ backgroundColor: 'var(--color-success)' }}></div>
                  {role === 'hr' ? 'HR / Interviewer' : 'Candidate'}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-text-muted)' }}>Joined Date</span>
              <span className="text-[15px] font-semibold flex items-center gap-2.5" style={{ color: 'var(--color-text-primary)' }}>
                <Calendar size={18} style={{ color: 'var(--color-primary)' }} /> October 2023
              </span>
            </div>
            
            <div className="flex flex-col pt-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--color-text-muted)' }}>Password Security</span>
              <Button variant="secondary" className="w-max px-6 py-3 text-sm hover-elevate shadow-sm" onClick={() => {}}>Update Password</Button>
            </div>
          </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}
