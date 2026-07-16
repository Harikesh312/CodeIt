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
    <div className="max-w-4xl mx-auto h-full space-y-8 animate-fade-in pb-12">
      
      {/* Top Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-2xl transition-all duration-250 hover:shadow-xl" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-md" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="mb-2" style={{ color: 'var(--color-text-primary)' }}>
              {user?.name || 'Interviewer'}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1.5"><Briefcase size={16} /> {role === 'hr' ? 'HR / Interviewer' : 'Candidate'}</span>
              <span className="opacity-50">&bull;</span>
              <span className="flex items-center gap-1.5"><Mail size={16} /> {user?.email || 'user@company.com'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 sm:w-auto w-full">
          <Button variant="ghost" icon={LogOut} onClick={handleLogout} className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 flex-1 sm:flex-none">
            Sign Out
          </Button>
          <Button variant="primary" icon={Edit2} onClick={() => setIsEditing(!isEditing)} className="flex-1 sm:flex-none">
            {isEditing ? 'Save' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personal Information */}
        <div className="p-8 rounded-2xl transition-all duration-250 hover:shadow-xl hover:-translate-y-0.5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="mb-6 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
            <UserCircle size={20} style={{ color: 'var(--color-primary)' }} /> Personal Information
          </h3>
          
          <div className="space-y-5">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Full Name</span>
              {isEditing ? (
                <input type="text" defaultValue={user?.name || ''} className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 transition-colors" />
              ) : (
                <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'Not provided'}</span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Email Address</span>
              {isEditing ? (
                <input type="email" defaultValue={user?.email || ''} className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 transition-colors" />
              ) : (
                <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{user?.email || 'Not provided'}</span>
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Organization</span>
              {isEditing ? (
                <input type="text" defaultValue="CodeIt Enterprise" className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 transition-colors" />
              ) : (
                <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>CodeIt Enterprise</span>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="p-8 rounded-2xl transition-all duration-250 hover:shadow-xl hover:-translate-y-0.5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="mb-6 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
            <Key size={20} style={{ color: 'var(--color-primary)' }} /> Account Information
          </h3>
          
          <div className="space-y-5">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Account Role</span>
              {isEditing ? (
                <select disabled className="w-full rounded-lg px-4 py-2.5 text-sm bg-slate-800/30 border border-slate-700/50 text-slate-400 cursor-not-allowed transition-colors">
                  <option>{role === 'hr' ? 'HR / Interviewer' : 'Candidate'}</option>
                </select>
              ) : (
                <span className="font-medium flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-success)' }}></div>
                  {role === 'hr' ? 'HR / Interviewer' : 'Candidate'}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Joined Date</span>
              <span className="font-medium flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <Calendar size={16} style={{ color: 'var(--color-text-muted)' }} /> October 2023
              </span>
            </div>
            
            <div className="flex flex-col pt-4">
              <span className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Password Security</span>
              <Button variant="secondary" size="sm" className="w-max" onClick={() => {}}>Update Password</Button>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}
