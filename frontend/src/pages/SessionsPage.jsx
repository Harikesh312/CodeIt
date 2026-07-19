import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Video, Clock, Users, CheckCircle2, XCircle, Copy, Check, AlertCircle, FileText, Timer as TimerIcon, Calendar } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES, ROOM_STATUSES } from '../utils/constants';
import { copyToClipboard, timeAgo, getRoomInviteLink } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProblemCreatorModal from '../components/ProblemCreatorModal';

const statusVariantMap = {
  [ROOM_STATUSES.ACTIVE]: 'active',
  [ROOM_STATUSES.WAITING]: 'waiting',
  [ROOM_STATUSES.COMPLETED]: 'completed',
  [ROOM_STATUSES.CANCELLED]: 'cancelled',
};

function SkeletonCard() {
  return (
    <div className="relative h-full flex flex-col p-8 rounded-3xl animate-pulse" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="h-6 rounded-md w-3/4 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <div className="h-4 rounded-md w-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        </div>
        <div className="h-5 w-16 rounded-full ml-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="flex items-center gap-5 mb-6">
        <div className="h-4 w-16 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div className="h-4 w-12 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-8 w-24 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div className="h-10 w-28 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  );
}

function CreateRoomModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [candidate, setCandidate] = useState('');
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) { setError('Session title is required.'); return; }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), candidate: candidate.trim(), duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');
      onCreate({ ...data, id: data._id });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" style={{ backgroundColor: 'rgba(10,15,28,0.85)' }}>
      <div className="rounded-[32px] shadow-2xl w-full max-w-2xl animate-slide-up-fade relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 30px 100px rgba(0,0,0,0.8), 0 0 40px rgba(91,108,255,0.15)' }}>
        {/* Modal Watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] blur-[2px]">
          <Video size={400} className="text-indigo-400 translate-x-1/4" />
        </div>
        
        <div className="relative z-10 flex items-center justify-between px-10 py-8" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(91,108,255,0.1)' }}>
              <Video size={28} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="font-extrabold text-2xl tracking-tight text-white">New Session</h2>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-text-muted)' }}>Configure details for your interview</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl transition-all duration-200 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800">
            <XCircle size={28} />
          </button>
        </div>
        <div className="px-10 py-8 space-y-8 relative z-10">
          <div>
            <label className="block text-[11px] font-bold mb-3 uppercase tracking-[0.15em] text-slate-400">Session Title *</label>
            <input value={title} onChange={(e) => { setTitle(e.target.value); setError(''); }} placeholder="e.g. Senior Frontend Engineer" className="w-full rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 shadow-inner" />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-3 uppercase tracking-[0.15em] text-slate-400">Candidate Name</label>
            <input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g. Riya Sharma" className="w-full rounded-2xl px-5 py-4 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 shadow-inner" />
          </div>
          <div className="pt-2">
            <label className="block text-[11px] font-bold mb-4 uppercase tracking-[0.15em] text-slate-400 flex items-center justify-between">
              Duration
              <span className="text-sm px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold tracking-normal">{duration} min</span>
            </label>
            <input type="range" min={15} max={120} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs mt-3 font-semibold text-slate-500">
              <span>15 min</span><span>120 min</span>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-3 text-sm rounded-2xl px-5 py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold shadow-sm">
              <AlertCircle size={18} />{error}
            </div>
          )}
        </div>
        <div className="flex gap-4 px-10 pb-10 relative z-10">
          <Button variant="ghost" className="flex-1 py-4 text-base" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Plus} className="flex-[2] py-4 text-base shadow-xl shadow-indigo-500/20 hover-elevate" loading={loading} onClick={handleCreate}>
            {loading ? 'Creating…' : 'Create Session'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, onEnter, onAddProblem }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { joinRoom } = useInterview();

  const handleCopy = async (e) => {
    e.stopPropagation();
    const ok = await copyToClipboard(getRoomInviteLink(room.code));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const handleEnter = () => {
    if (room.status === ROOM_STATUSES.COMPLETED || room.status === ROOM_STATUSES.CANCELLED) {
      alert('This interview has ended and cannot be rejoined.');
      return;
    }
    joinRoom(room.id, room.code, room.title);
    navigate(`/room/${room.id}`);
  };

  const isActive = room.status === ROOM_STATUSES.ACTIVE;
  const isWaiting = room.status === ROOM_STATUSES.WAITING;
  const isEnded = room.status === ROOM_STATUSES.COMPLETED || room.status === ROOM_STATUSES.CANCELLED;

  return (
    <div
      className={`group rounded-3xl p-8 transition-all duration-300 animate-slide-up-fade ${isEnded ? 'opacity-60 bg-slate-800/20 border border-slate-800' : 'cursor-pointer shadow-lg hover-elevate hover:shadow-xl'} ${isActive ? 'card-accent-success bg-surface border border-border' : isWaiting ? 'card-accent-warning bg-surface border border-border' : ''}`}
      style={{ animationFillMode: 'both' }}
      onClick={isEnded ? undefined : handleEnter}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-extrabold text-xl truncate text-white tracking-tight">{room.title}</h3>
          {room.candidate && (
            <p className="text-[14px] mt-2 flex items-center gap-2 font-medium" style={{ color: 'var(--color-text-muted)' }}>
              <Users size={16} className="text-indigo-400" />{room.candidate}
            </p>
          )}
        </div>
        <Badge variant={statusVariantMap[room.status]} dot className="flex-shrink-0 ml-3 shadow-sm">{room.status}</Badge>
      </div>

      <div className="flex items-center gap-5 text-[13px] font-semibold mb-6 text-slate-400">
        <span className="flex items-center gap-1.5"><TimerIcon size={14} className="text-slate-500" />{room.duration} min</span>
        <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-500" />{timeAgo(room.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <code className="text-sm font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-indigo-300 font-bold tracking-wide">
            {room.code}
          </code>
          <button onClick={handleCopy} className="p-2 rounded-lg transition-all duration-200 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-700 border border-transparent hover:border-slate-600">
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isEnded ? (
            <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 text-slate-500">
              {room.status === ROOM_STATUSES.COMPLETED ? 'Concluded' : 'Cancelled'}
            </span>
          ) : (isActive || isWaiting) && (
            <>
              <Button variant="ghost" size="sm" icon={FileText} onClick={(e) => { e.stopPropagation(); onAddProblem(room); }}>
                Problem
              </Button>
              <Button variant={isActive ? 'primary' : 'secondary'} size="sm" icon={Video} onClick={(e) => { e.stopPropagation(); handleEnter(); }}>
                {isActive ? 'Join Live' : 'Enter Room'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const { user, role, setError } = useInterview();
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [problemModal, setProblemModal] = useState(null);

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
        setRooms(data.map(r => ({ ...r, id: r._id })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRooms(false);
      }
    };
    if (user && role === ROLES.HR) {
      fetchRooms();
    } else {
      setLoadingRooms(false);
    }
  }, [user, role, setError]);

  const handleCreateRoom = (newRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
  };

  const handleAddProblem = (room) => {
    setProblemModal({ roomId: room.id, room });
  };

  return (
    <div className="relative h-full flex flex-col z-0">
      
      {/* Background Watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1] opacity-[0.03] blur-[2px]">
        <FileText size={800} className="text-indigo-400" />
      </div>

      {showCreateModal && (
        <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateRoom} />
      )}
      {problemModal && (
        <ProblemCreatorModal
          onClose={() => setProblemModal(null)}
          onSave={() => setProblemModal(null)}
          roomId={problemModal.roomId}
        />
      )}

      <div className="relative flex flex-col mb-10 overflow-hidden rounded-3xl p-10 shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.02] text-indigo-400 pointer-events-none">
          <Calendar size={192} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Interview Sessions</h1>
        <p className="text-lg mt-3 font-medium opacity-90 max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>
          Manage and join your technical interview sessions.
        </p>
      </div>

      <div className="flex-1">
        {loadingRooms ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : rooms.length === 0 ? (
          <div className="border border-dashed rounded-[32px] py-28 flex flex-col items-center gap-6 border-indigo-500/20 bg-indigo-500/5 transition-all duration-300 hover:border-indigo-500/40">
            <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center bg-indigo-500/10 shadow-[0_0_40px_rgba(91,108,255,0.15)]">
              <Video size={40} className="text-indigo-400" />
            </div>
            <div className="text-center max-w-sm">
              <p className="font-extrabold text-2xl" style={{ color: 'var(--color-text-primary)' }}>No sessions yet</p>
              <p className="text-base mt-2.5 font-medium" style={{ color: 'var(--color-text-muted)' }}>Start by creating your first interview session and invite your candidate.</p>
            </div>
            <Button variant="primary" size="lg" icon={Plus} className="px-8 py-4 mt-2 hover-elevate shadow-lg shadow-indigo-500/25" onClick={() => setShowCreateModal(true)}>New Interview Session</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <div key={room.id} style={{ animationDelay: `${index * 50}ms` }}>
                <RoomCard room={room} onAddProblem={handleAddProblem} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
