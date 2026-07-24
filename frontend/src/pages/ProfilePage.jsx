import React, { useState, useEffect } from 'react';
import {
  User, LogOut, Edit2, Mail, Briefcase, Calendar, Key, UserCircle, Shield,
  Clock, Bell, Monitor, CheckCircle, Activity, FileText, Smartphone,
  Award, Zap, TrendingUp, Star, Lock, Globe, Eye, ChevronRight,
  Code2, GitBranch, ExternalLink
} from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import { useToast } from '../components/ToastProvider';
import Logo from '../components/Logo';
import LogoutModal from '../components/LogoutModal';

/* ─────────────────────────────────────────────────────────────────────
   Animated Circular Progress Ring
────────────────────────────────────────────────────────────────────── */
function CircularProgress({ percentage, size = 120, strokeWidth = 8 }) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#progressGradient)"
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F8BFF" />
            <stop offset="100%" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{animatedPct}%</span>
        <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Complete</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, reset, role } = useInterview();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Password Update State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    reset();
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      addToast('error', 'Password must be at least 6 characters');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      addToast('success', 'Password updated successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast('error', err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const creationDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently';

  const profileChecklist = [
    { label: 'Email Verified', done: true, icon: Mail },
    { label: 'Resume Uploaded', done: true, icon: FileText },
    { label: 'Skills Added', done: true, icon: Code2 },
    { label: 'Projects Added', done: true, icon: GitBranch },
    { label: 'Portfolio Linked', done: false, icon: Globe },
    { label: 'Phone Verified', done: false, icon: Smartphone },
  ];

  const completedCount = profileChecklist.filter(i => i.done).length;
  const profilePercentage = Math.round((completedCount / profileChecklist.length) * 100);

  const recentActivity = [
    { action: 'Completed interview with Alex Chen', time: '2 hours ago', icon: CheckCircle, color: '#10B981' },
    { action: 'Updated profile information', time: '5 hours ago', icon: Edit2, color: '#7C5CFF' },
    { action: 'Created new interview session', time: '1 day ago', icon: Zap, color: '#4F8BFF' },
    { action: 'Password changed successfully', time: '3 days ago', icon: Lock, color: '#F59E0B' },
  ];

  const quickActions = [
    { label: 'Create Session', icon: Zap, color: '#7C5CFF' },
    { label: 'View Reports', icon: TrendingUp, color: '#4F8BFF' },
    { label: 'Manage Team', icon: User, color: '#10B981' },
    { label: 'Settings', icon: Monitor, color: '#F59E0B' },
  ];

  const cardStyle = {
    backgroundColor: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease',
  };

  return (
    <div className="relative max-w-7xl mx-auto h-full flex flex-col space-y-6 animate-fade-in pb-12 w-full z-0 px-4 md:px-0">

      {/* ══════════════════════════════════════════════════════════════════
          PROFILE HEADER BANNER
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="relative rounded-3xl overflow-hidden flex flex-col"
        style={cardStyle}
      >
        {/* Banner block at the top */}
        <div className="h-28 w-full relative overflow-hidden" style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(17, 24, 39, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(124, 92, 255, 0.15) 0%, rgba(255,255,255,0.95) 100%)',
        }}>
          {/* Decorative gradient blob */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124, 92, 255, 0.3), transparent 70%)' }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79, 139, 255, 0.2), transparent 70%)' }} />
        </div>

        {/* Content area below the banner */}
        <div className="relative z-10 p-8 md:p-10 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-50">
            <div
              className="w-[88px] h-[88px] flex-shrink-0 rounded-[1.5rem] flex items-center justify-center text-[36px] font-extrabold text-white shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #4F8BFF, #7C5CFF)',
                boxShadow: '0 8px 32px rgba(124, 92, 255, 0.35)'
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-center sm:text-left mt-1">
              <h1 className="text-[28px] font-extrabold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>
                {user?.name || 'Interviewer'}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-[13px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                <span className="flex items-center gap-1.5"><Briefcase size={14} style={{ color: 'var(--color-primary)' }} /> {role === 'hr' ? 'HR / Interviewer' : 'Candidate'}</span>
                <span className="hidden sm:inline opacity-30">•</span>
                <span className="flex items-center gap-1.5"><Mail size={14} style={{ color: 'var(--color-success)' }} /> {user?.email || 'user@company.com'}</span>
                <span className="hidden sm:inline opacity-30">•</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} style={{ color: 'var(--color-accent)' }} /> Member since {creationDate}</span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #10B981' }} />
                  Active
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'rgba(124, 92, 255, 0.08)', color: 'var(--color-primary)', border: '1px solid rgba(124, 92, 255, 0.12)' }}>
                  CodeIt Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-3 sm:w-auto w-full">
            <Button
              variant="ghost"
              icon={LogOut}
              onClick={() => setShowLogoutModal(true)}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 flex-1 sm:flex-none"
            >
              Sign Out
            </Button>
            <Button
              variant="primary"
              icon={Edit2}
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-none shadow-md"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN GRID: 3 Columns
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─────── LEFT COLUMN (span 2) ─────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Personal Information */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-6 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <User size={18} style={{ color: 'var(--color-primary)' }} /> Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: user?.name || 'Not provided', editable: true, type: 'text' },
                { label: 'Email Address', value: user?.email || 'Not provided', editable: true, type: 'email' },
                { label: 'Organization', value: 'CodeIt Enterprise', editable: true, type: 'text' },
                { label: 'Resume Status', value: 'Uploaded', icon: <FileText size={14} className="text-emerald-400" />, extra: '(Viewable by HR)' },
              ].map((field, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--color-text-muted)' }}>{field.label}</span>
                  {isEditing && field.editable ? (
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        focusRingColor: 'var(--color-primary)',
                      }}
                    />
                  ) : (
                    <span className="text-[14px] font-medium flex items-center gap-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      {field.icon} {field.value} {field.extra && <span style={{ color: 'var(--color-text-muted)' }}>{field.extra}</span>}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <Zap size={18} style={{ color: 'var(--color-primary)' }} /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 group"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <Activity size={18} style={{ color: 'var(--color-primary)' }} /> Recent Activity
            </h3>
            <div className="space-y-1">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.action}</p>
                    <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{item.time}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-6 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <Shield size={18} style={{ color: 'var(--color-primary)' }} /> Security & Privacy
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Security Status', value: 'Secure', icon: Shield, status: 'good' },
                { label: 'Password Strength', value: 'Strong', icon: Lock, status: 'good' },
                { label: 'Email Verification', value: 'Verified', icon: Mail, status: 'good' },
                { label: 'Two-Factor Auth', value: 'Not Enabled', icon: Smartphone, status: 'warning' },
                { label: 'Last Login', value: 'Today, Just now', icon: Clock, status: 'info' },
                { label: 'Active Devices', value: '1 device', icon: Monitor, status: 'info' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} style={{ color: 'var(--color-text-muted)' }} />
                    <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
                    {item.status === 'good' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />}
                    {item.status === 'warning' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B', boxShadow: '0 0 6px #F59E0B' }} />}
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <Button variant="secondary" className="w-full text-sm" onClick={() => setShowPasswordModal(true)}>
                  <Lock size={14} className="mr-2" /> Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-6 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <Monitor size={18} style={{ color: 'var(--color-primary)' }} /> App Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2.5" style={{ color: 'var(--color-text-muted)' }}>Theme</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                    className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(124, 92, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      color: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    }}
                  >
                    Dark Mode
                  </button>
                  <button
                    onClick={() => { if (theme !== 'light') toggleTheme(); }}
                    className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: theme === 'light' ? 'rgba(124, 92, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${theme === 'light' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      color: theme === 'light' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    }}
                  >
                    Light Mode
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2.5" style={{ color: 'var(--color-text-muted)' }}>Notifications</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 rounded-full flex items-center p-1 cursor-pointer" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <div className="w-4 h-4 bg-white rounded-full translate-x-4 transition-transform shadow-sm" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Email Alerts Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────── RIGHT COLUMN ─────── */}
        <div className="flex flex-col gap-6">

          {/* Profile Strength — Circular Progress */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <Activity size={18} style={{ color: 'var(--color-primary)' }} /> Profile Strength
            </h3>

            <div className="flex flex-col items-center mb-5">
              <CircularProgress percentage={profilePercentage} />
              <span
                className="mt-3 text-[12px] font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: profilePercentage >= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: profilePercentage >= 80 ? '#10B981' : '#F59E0B',
                }}
              >
                {profilePercentage >= 80 ? 'Excellent' : 'Good'}
              </span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {profileChecklist.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[13px]">
                  {item.done ? (
                    <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-[15px] h-[15px] border-2 rounded-full flex-shrink-0" style={{ borderColor: 'var(--color-text-muted)' }} />
                  )}
                  <item.icon size={13} style={{ color: item.done ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }} />
                  <span style={{ color: item.done ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statistics */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} /> Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Interviews', value: '24', color: '#7C5CFF' },
                { label: 'Candidates', value: '18', color: '#4F8BFF' },
                { label: 'Avg Score', value: '82%', color: '#10B981' },
                { label: 'This Week', value: '5', color: '#F59E0B' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl text-center"
                  style={{ backgroundColor: `${stat.color}08`, border: `1px solid ${stat.color}15` }}
                >
                  <p className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <Award size={18} style={{ color: 'var(--color-primary)' }} /> Achievements
            </h3>
            <div className="space-y-3">
              {[
                { title: 'First Interview', desc: 'Conducted your first session', icon: '🎯', earned: true },
                { title: 'Team Player', desc: '10+ candidates evaluated', icon: '🤝', earned: true },
                { title: 'Expert Reviewer', desc: '50+ interviews completed', icon: '⭐', earned: false },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: badge.earned ? 'rgba(255,255,255,0.02)' : 'transparent',
                    border: `1px solid ${badge.earned ? 'var(--color-border)' : 'transparent'}`,
                    opacity: badge.earned ? 1 : 0.45,
                  }}
                >
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{badge.title}</p>
                    <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Preview */}
          <div className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5" style={cardStyle}>
            <h3 className="mb-5 flex items-center gap-2.5 font-bold text-[16px]" style={{ color: 'var(--color-text-primary)' }}>
              <Star size={18} style={{ color: 'var(--color-primary)' }} /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'TypeScript', 'Python', 'System Design', 'SQL', 'AWS', 'Docker'].map((skill, i) => (
                <span
                  key={i}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(124, 92, 255, 0.08)',
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(124, 92, 255, 0.12)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl relative" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-6 right-6 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Update Password</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Ensure your account is using a long, random password to stay secure.</p>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {[
                { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                { label: 'New Password', value: newPassword, setter: setNewPassword },
                { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>{field.label}</label>
                  <input
                    type="password"
                    required
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
              ))}
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowPasswordModal(false)} type="button">Cancel</Button>
                <Button variant="primary" type="submit" loading={isUpdatingPassword}>Save Password</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
