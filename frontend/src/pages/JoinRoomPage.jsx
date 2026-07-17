import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Hash, ArrowRight, AlertCircle, Code2, Users, Trophy, Award, Briefcase, PlayCircle, Clock, Star, Calendar, Activity, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import Button from '../components/ui/Button';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Badge from '../components/ui/Badge';

export default function JoinRoomPage() {
  const { joinRoom, user, reset } = useInterview();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const code = roomCode.trim().toUpperCase();
    if (!code) { setError('Please enter a room code.'); return; }
    if (code.length !== 6) { setError('Room code must be 6 characters.'); return; }
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/rooms/code/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Room not found');

      if (data.status === 'completed' || data.status === 'cancelled') {
        throw new Error('This interview has already ended and cannot be joined.');
      }

      joinRoom(data._id, data.code, data.title, data.createdBy);
      navigate(`/room/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(val);
    setError('');
  };

  return (
    <div className="flex h-screen bg-grid-pattern relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col relative z-0">
          
          {/* Watermark */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1] opacity-[0.03] blur-[2px]">
            <Code2 size={800} className="text-cyan-400" />
          </div>

          <div className="max-w-7xl mx-auto w-full space-y-8 pb-10 animate-fade-in">
            
            {/* Candidate Hero & Join Room Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 relative p-10 rounded-[24px] glass-panel hover-elevate soft-glow flex flex-col justify-center min-h-[300px] overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    Hello, {user?.name?.split(' ')[0] || 'Candidate'}
                  </h1>
                  <p className="mt-4 mb-8 text-lg font-medium opacity-90 text-slate-300">
                    Welcome to your candidate hub. Prepare for upcoming interviews, track your skill progress, and join live technical sessions.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="secondary" icon={Trophy} className="px-6 py-3">View Achievements</Button>
                    <Button variant="ghost" icon={Code2} className="px-6 py-3">Practice Code</Button>
                  </div>
                </div>
                <GraduationCap className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04] text-white hidden md:block w-[400px] h-[400px] translate-x-1/4" />
              </div>

              {/* Join Room Quick Action */}
              <div className="relative p-8 rounded-[24px] glass-panel hover-elevate soft-glow flex flex-col justify-center card-accent-royal">
                <h3 className="text-xl font-bold text-white mb-2">Join Interview</h3>
                <p className="text-xs text-slate-400 mb-6">Enter the 6-digit code shared by your interviewer</p>
                
                <div className="relative mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Hash size={16} />
                  </div>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={handleCodeInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                    placeholder="ABC123"
                    maxLength={6}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-slate-600 text-xl font-mono font-bold tracking-[0.3em] text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 uppercase transition-all"
                  />
                  <div className="flex justify-center gap-1.5 mt-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-200 ${i < roomCode.length ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>
                
                {error && <div className="text-xs text-rose-400 mb-4 bg-rose-500/10 px-3 py-2 rounded-lg flex items-center gap-2"><AlertCircle size={14} />{error}</div>}
                
                <Button variant="primary" className="w-full py-3.5 text-sm button-premium" loading={loading} iconRight={ArrowRight} onClick={handleJoin}>
                  {loading ? 'Connecting…' : 'Enter Session'}
                </Button>
              </div>
            </div>

            {/* 4 Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-[20px] glass-panel hover-elevate soft-glow card-accent-success">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><Award size={20} /></div>
                  <span className="text-sm font-semibold text-slate-400">Score</span>
                </div>
                <div className="text-3xl font-extrabold text-white">92/100</div>
              </div>
              <div className="p-6 rounded-[20px] glass-panel hover-elevate soft-glow card-accent-info">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400"><Briefcase size={20} /></div>
                  <span className="text-sm font-semibold text-slate-400">Resume</span>
                </div>
                <div className="text-3xl font-extrabold text-white">Verified</div>
              </div>
              <div className="p-6 rounded-[20px] glass-panel hover-elevate soft-glow card-accent-violet">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400"><Activity size={20} /></div>
                  <span className="text-sm font-semibold text-slate-400">Skill Level</span>
                </div>
                <div className="text-3xl font-extrabold text-white">Expert</div>
              </div>
              <div className="p-6 rounded-[20px] glass-panel hover-elevate soft-glow card-accent-orange">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400"><Star size={20} /></div>
                  <span className="text-sm font-semibold text-slate-400">Certificates</span>
                </div>
                <div className="text-3xl font-extrabold text-white">3 Earned</div>
              </div>
            </div>

            {/* Timelines and Invites */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Upcoming Interviews */}
              <div className="lg:col-span-2 p-8 rounded-[24px] glass-panel hover-elevate soft-glow card-accent-upcoming relative overflow-hidden">
                <Calendar className="absolute right-4 bottom-4 w-40 h-40 opacity-[0.03] text-violet-400 pointer-events-none" />
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Calendar size={18} className="text-violet-400" /> Upcoming Interviews</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400"><Video size={20} /></div>
                      <div>
                        <h4 className="font-semibold text-white">Senior Frontend Developer</h4>
                        <p className="text-xs text-slate-400">Tomorrow at 10:00 AM • 60 mins</p>
                      </div>
                    </div>
                    <Badge variant="waiting">Invited</Badge>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400"><Code2 size={20} /></div>
                      <div>
                        <h4 className="font-semibold text-white">System Design Round</h4>
                        <p className="text-xs text-slate-400">Friday at 2:00 PM • 90 mins</p>
                      </div>
                    </div>
                    <Badge variant="waiting">Scheduled</Badge>
                  </div>
                </div>
              </div>

              {/* Coding Test Status */}
              <div className="p-8 rounded-[24px] glass-panel hover-elevate soft-glow card-accent-orange relative overflow-hidden">
                <Activity className="absolute right-4 bottom-4 w-40 h-40 opacity-[0.03] text-orange-400 pointer-events-none" />
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity size={18} className="text-orange-400" /> Timeline</h2>
                
                <div className="relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-700 space-y-6">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-800 bg-emerald-500 text-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-700 bg-slate-800/50 shadow">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-200 text-xs">Applied</div>
                        <time className="text-[10px] font-medium text-emerald-400">Done</time>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-800 bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Clock size={14} />
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-700 bg-slate-800/50 shadow">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-200 text-xs">Code Test</div>
                        <time className="text-[10px] font-medium text-indigo-400">Pending</time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[24px] glass-panel hover-elevate soft-glow card-accent-history">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Star size={18} className="text-slate-400" /> Recent Feedback</h2>
                <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/20 text-sm text-slate-300">
                  "Candidate showed excellent problem-solving skills and communicated trade-offs effectively. Needs to brush up slightly on advanced React patterns, but overall very strong."
                </div>
              </div>
              <div className="p-8 rounded-[24px] glass-panel hover-elevate soft-glow card-accent-analytics">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Clock size={18} className="text-cyan-400" /> Recent Activity</h2>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Completed JavaScript Assessment (98%)</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-slate-500"></div> Updated Resume Document</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Passed Initial HR Screen</li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
