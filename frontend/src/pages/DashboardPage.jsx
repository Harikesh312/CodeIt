import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Video, Clock, CheckCircle2, TrendingUp, PlayCircle, Plus, Activity, Calendar, Code2 } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES, ROOM_STATUSES } from '../utils/constants';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { timeAgo } from '../utils/helpers';

function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="p-5 rounded-2xl flex flex-col transition-all duration-250 backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-indigo-500/30" style={{ backgroundColor: 'rgba(24, 37, 59, 0.7)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon size={20} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      </div>
      <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</h3>
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
    <div className="h-full flex flex-col space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
      
      {/* Premium Hero Section */}
      <div className="relative p-8 md:p-10 rounded-2xl overflow-hidden flex items-center justify-between backdrop-blur-md" style={{ backgroundColor: 'rgba(24, 37, 59, 0.7)', border: '1px solid var(--color-border)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
        <div className="relative z-10 max-w-xl">
          <h1 style={{ color: 'var(--color-text-primary)' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Interviewer'}
          </h1>
          <p className="mt-3 mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Conduct secure technical interviews, evaluate candidates efficiently and collaborate in real time.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" icon={Plus} size="lg" onClick={() => navigate('/sessions')}>
              Create Session
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/sessions')} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
              View Sessions
            </Button>
          </div>
        </div>

        {/* Abstract watermark illustration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05] text-white hidden md:block">
          <Code2 size={400} strokeWidth={1} style={{ transform: 'translateX(20%)' }} />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Interviews" value={rooms.length.toString()} icon={Video} colorClass="bg-indigo-500/10 text-indigo-400" />
        <StatCard label="Live Sessions" value={activeRooms.toString()} icon={PlayCircle} colorClass="bg-emerald-500/10 text-emerald-400" />
        <StatCard label="Pending Invites" value={waitingRooms.length.toString()} icon={Clock} colorClass="bg-amber-500/10 text-amber-400" />
        <StatCard label="Unique Candidates" value={totalCandidates.toString()} icon={Users} colorClass="bg-cyan-500/10 text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upcoming & Insights */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* GitHub-style Performance Analytics */}
          <div className="p-6 rounded-2xl transition-all duration-250 backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-indigo-500/30" style={{ backgroundColor: 'rgba(24, 37, 59, 0.7)', border: '1px solid var(--color-border)', height: '220px' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <Activity size={18} className="text-indigo-400" /> Performance Analytics
              </h2>
            </div>
            
            <div className="h-28 flex items-end justify-between gap-3 relative">
              {/* Soft grid lines */}
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
                        background: 'linear-gradient(to top, rgba(91, 108, 255, 0.2), rgba(91, 108, 255, 0.8))'
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

          {/* Upcoming Sessions */}
          <div className="p-6 rounded-2xl transition-all duration-250 backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-indigo-500/30" style={{ backgroundColor: 'rgba(24, 37, 59, 0.7)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <Calendar size={18} className="text-indigo-400" /> Upcoming Sessions
              </h2>
              <button className="text-sm font-semibold transition-colors hover:underline" style={{ color: 'var(--color-primary-light)' }} onClick={() => navigate('/sessions')}>
                View all
              </button>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse h-16 rounded-xl bg-slate-800/30 w-full" />
              ) : upcomingSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No upcoming interviews scheduled.</p>
                </div>
              ) : (
                upcomingSessions.map(room => (
                  <div key={room._id} className="flex items-center justify-between p-4 rounded-xl transition-all duration-250 hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }} onClick={() => navigate('/sessions')}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-indigo-400 font-bold" style={{ backgroundColor: 'rgba(91,108,255,0.1)' }}>
                        {room.candidate?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h3 style={{ color: 'var(--color-text-primary)' }}>{room.title}</h3>
                        <p className="mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{room.candidate || 'Unknown'} • {room.duration} min</p>
                      </div>
                    </div>
                    <Badge variant="waiting" dot>Waiting</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>

        {/* Right Column: Session History */}
        <div className="p-6 rounded-2xl flex flex-col h-full transition-all duration-250 backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-indigo-500/30" style={{ backgroundColor: 'rgba(24, 37, 59, 0.7)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <TrendingUp size={18} className="text-emerald-400" /> Session History
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
                {recentRooms.map((room) => {
                  let statusText = 'Created session';
                  let StatusIcon = Plus;
                  let iconColor = 'text-indigo-400';
                  
                  if (room.status === ROOM_STATUSES.COMPLETED) {
                    statusText = 'Concluded interview';
                    StatusIcon = CheckCircle2;
                    iconColor = 'text-emerald-400';
                  } else if (room.status === ROOM_STATUSES.ACTIVE) {
                    statusText = 'Started live session';
                    StatusIcon = PlayCircle;
                    iconColor = 'text-cyan-400';
                  }
                  
                  return (
                    <div key={room._id} className="relative z-10 flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 mt-1" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <StatusIcon size={14} className={iconColor} />
                      </div>
                      <div className="flex-1 rounded-xl p-3 border transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--color-border)' }}>
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {statusText} <span className="font-bold">{room.title}</span>
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Candidate: {room.candidate || 'Unknown'}</p>
                          <span className="text-[10px] uppercase font-semibold tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{timeAgo(room.createdAt)}</span>
                        </div>
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
