import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Video, Clock, CheckCircle2, TrendingUp, PlayCircle, Plus, Activity, Calendar, Sparkles, Star, Zap } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES, ROOM_STATUSES } from '../utils/constants';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { timeAgo } from '../utils/helpers';
import Logo from '../components/Logo';

function StatCard({ label, value, icon: Icon, colorClass, accentClass }) {
  return (
    <div className={`p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 min-h-[140px] ${accentClass}`} style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease' }}>
      <div className="flex items-center gap-4 mb-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
        <p className="text-[15px] font-semibold tracking-wide" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      </div>
      <h3 className="font-extrabold text-3xl tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{value}</h3>
    </div>
  );
}

export default function DashboardPage() {
  const { user, role, setError } = useInterview();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch rooms');
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user && role === ROLES.HR) {
      fetchRooms();
    } else {
      setLoading(false);
    }
  }, [user, role, setError]);

  const activeRooms = rooms.filter(r => r.status === ROOM_STATUSES.ACTIVE).length;
  const completedRooms = rooms.filter(r => r.status === ROOM_STATUSES.COMPLETED).length;
  const waitingRooms = rooms.filter(r => r.status === ROOM_STATUSES.WAITING);
  const totalCandidates = new Set(rooms.map(r => r.candidate).filter(Boolean)).size;

  const recentRooms = [...rooms].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const upcomingSessions = [...waitingRooms].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  // Dummy data for Insights chart
  const weeklyData = [
    { day: 'M', value: 12 },
    { day: 'T', value: 18 },
    { day: 'W', value: 15 },
    { day: 'T', value: 24 },
    { day: 'F', value: 20 },
    { day: 'S', value: 8 },
    { day: 'S', value: 10 },
  ];
  const maxVal = Math.max(...weeklyData.map(d => d.value));

  return (
    <div className="relative h-full flex flex-col space-y-10 animate-fade-in max-w-7xl mx-auto pb-10 w-full z-0">
      
      {/* Premium Hero Section */}
      <div className="relative p-10 md:p-14 rounded-3xl overflow-hidden flex items-center justify-between glass-panel hover:-translate-y-0.5 transition-all duration-300 min-h-[240px]">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Interviewer'}
          </h1>
          <p className="mt-4 mb-8 text-lg font-medium opacity-90" style={{ color: 'var(--color-text-secondary)' }}>
            Conduct secure technical interviews, evaluate candidates efficiently and collaborate in real time.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" icon={Plus} size="lg" onClick={() => navigate('/sessions')} className="px-8 py-3.5 text-base hover-elevate">
              Create Session
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/sessions')} className="px-8 py-3.5 text-base hover-elevate" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
              View Sessions
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Interviews" value={rooms.length.toString()} icon={Video} colorClass="bg-indigo-500/10 text-indigo-400" accentClass="card-accent-analytics" />
        <StatCard label="Live Sessions" value={activeRooms.toString()} icon={PlayCircle} colorClass="bg-emerald-500/10 text-emerald-400" accentClass="card-accent-success" />
        <StatCard label="Pending Invites" value={waitingRooms.length.toString()} icon={Clock} colorClass="bg-amber-500/10 text-amber-400" accentClass="card-accent-warning" />
        <StatCard label="Unique Candidates" value={totalCandidates.toString()} icon={Users} colorClass="bg-cyan-500/10 text-cyan-400" accentClass="card-accent-candidates" />
      </div>

      {/* Row 1: Analytics & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* GitHub-style Performance Analytics */}
        <div className="lg:col-span-2 relative p-8 rounded-3xl transition-all duration-300 glass-panel hover:-translate-y-0.5 overflow-hidden card-accent-analytics" style={{ minHeight: '260px' }}>
          {/* Watermark */}
          <Activity className="absolute right-4 bottom-4 w-40 h-40 opacity-[0.03] pointer-events-none" style={{ color: 'var(--color-analytics)' }} />
          
          <div className="relative z-10 flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-text-primary)' }}>
              <Activity size={18} className="text-cyan-400" /> Performance Analytics
            </h2>
          </div>
          
          <div className="h-28 flex items-end justify-between gap-3 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }} />
              ))}
            </div>
            
            {weeklyData.map((d, i) => {
              const heightPct = (d.value / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end items-center h-full relative z-10 group">
                  <div 
                    className="w-full max-w-[40px] rounded-t-md transition-all duration-300 group-hover:opacity-80" 
                    style={{ 
                      height: `${heightPct}%`, 
                      background: 'linear-gradient(to top, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.8))'
                    }} 
                  />
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded-md shadow-lg">
                    {d.value}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 px-2">
            {weeklyData.map((d, i) => (
              <span key={i} className="text-xs w-full max-w-[40px] text-center" style={{ color: 'var(--color-text-muted)' }}>{d.day}</span>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="relative p-8 rounded-3xl transition-all duration-300 glass-panel hover:-translate-y-0.5 overflow-hidden card-accent-royal">
          <Sparkles className="absolute right-2 top-2 w-48 h-48 opacity-[0.02] pointer-events-none" style={{ color: 'var(--color-primary)' }} />
          <div className="relative z-10 flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-text-primary)' }}>
              <Sparkles size={18} className="text-indigo-400" /> AI Insights
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Review Riya's React code</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Riya showed strong state management skills, but struggled with context.</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Schedule follow-up with Alex</p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Score was above 85%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Sessions */}
        <div className="relative p-8 rounded-3xl transition-all duration-300 glass-panel hover:-translate-y-0.5 flex-1 overflow-hidden card-accent-upcoming">
          <Calendar className="absolute -right-6 -top-6 w-48 h-48 opacity-[0.03] pointer-events-none" style={{ color: 'var(--color-upcoming)' }} />
          
          <div className="relative z-10 flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-text-primary)' }}>
              <Calendar size={18} className="text-violet-400" /> Upcoming
            </h2>
            <button className="text-sm font-semibold transition-colors hover:underline text-violet-400" onClick={() => navigate('/sessions')}>
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse h-16 rounded-xl bg-slate-800/30 w-full" />
            ) : upcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No upcoming interviews.</p>
              </div>
            ) : (
              upcomingSessions.map(room => (
                <div key={room._id} className="flex items-center justify-between p-4 rounded-xl transition-all duration-250 hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }} onClick={() => navigate('/sessions')}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-violet-400 font-bold" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                      {room.candidate?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{room.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{room.candidate || 'Unknown'}</p>
                    </div>
                  </div>
                  <Badge variant="waiting" dot>Wait</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Session History */}
        <div className="relative p-8 rounded-3xl flex flex-col h-full transition-all duration-300 glass-panel hover:-translate-y-0.5 overflow-hidden card-accent-history">
          <TrendingUp className="absolute right-2 bottom-12 w-56 h-56 opacity-[0.03] pointer-events-none" style={{ color: 'var(--color-history)' }} />
          
          <div className="relative z-10 flex items-center justify-between mb-8">
            <h2 className="flex items-center gap-2 font-bold" style={{ color: 'var(--color-text-primary)' }}>
              <TrendingUp size={18} className="text-slate-400" /> History
            </h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {loading ? (
              <div className="animate-pulse h-16 rounded-xl bg-slate-800/30 w-full" />
            ) : recentRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No activity history yet.</p>
              </div>
            ) : (
              <div className="relative before:absolute before:inset-0 before:ml-[15px] before:w-px before:z-0 space-y-5 ml-1" style={{ before: { backgroundColor: 'var(--color-border)' } }}>
                {recentRooms.slice(0, 3).map((room) => {
                  let statusText = 'Created session';
                  let StatusIcon = Plus;
                  let iconColor = 'text-indigo-400';
                  
                  if (room.status === ROOM_STATUSES.COMPLETED) {
                    statusText = 'Concluded';
                    StatusIcon = CheckCircle2;
                    iconColor = 'text-emerald-400';
                  }
                  
                  return (
                    <div key={room._id} className="relative z-10 flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 mt-1" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <StatusIcon size={14} className={iconColor} />
                      </div>
                      <div className="flex-1 rounded-xl p-3 border transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--color-border)' }}>
                        <p className="font-semibold text-xs text-white truncate max-w-[120px]">
                          {room.title}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{timeAgo(room.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
