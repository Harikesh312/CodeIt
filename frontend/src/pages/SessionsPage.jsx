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
    <div className="rounded-2xl p-6 animate-pulse" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 rounded w-3/4 mb-2.5" style={{ backgroundColor: 'var(--color-border)' }} />
          <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
        <div className="h-5 w-16 rounded-full ml-2" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>
      <div className="flex items-center gap-4 mb-5">
        <div className="h-3 w-16 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="h-3 w-12 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="h-8 w-24 rounded-lg" style={{ backgroundColor: 'var(--color-border)' }} />
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
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(91,108,255,0.15)' }}>
              <Video size={18} style={{ color: 'var(--color-primary-light)' }} />
            </div>
            <h2 className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>New Interview Session</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-all duration-200 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800">
            <XCircle size={18} />
          </button>
        </div>
        <div className="p-7 space-y-6">
          <div>
            <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider text-slate-400">Session Title *</label>
            <input value={title} onChange={(e) => { setTitle(e.target.value); setError(''); }} placeholder="e.g. Senior Frontend Engineer" className="w-full rounded-xl px-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider text-slate-400">Candidate Name</label>
            <input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g. Riya Sharma" className="w-full rounded-xl px-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-slate-800/50 border border-slate-700 text-slate-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider text-slate-400">Duration: <span style={{ color: 'var(--color-primary-light)' }}>{duration} min</span></label>
            <input type="range" min={15} max={120} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs mt-2 text-slate-500">
              <span>15 min</span><span>120 min</span>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle size={15} />{error}
            </div>
          )}
        </div>
        <div className="flex gap-3 px-7 pb-7">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Plus} className="flex-1" loading={loading} onClick={handleCreate}>
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
      className={`group rounded-2xl p-6 transition-all duration-300 backdrop-blur-md ${isEnded ? 'opacity-50' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-indigo-500/30'}`}
      style={{ backgroundColor: 'rgba(24, 37, 59, 0.7)', border: '1px solid var(--color-border)' }}
      onClick={isEnded ? undefined : handleEnter}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate text-slate-100">{room.title}</h3>
          {room.candidate && (
            <p className="text-sm mt-1 flex items-center gap-1.5 text-slate-400">
              <Users size={13} />{room.candidate}
            </p>
          )}
        </div>
        <Badge variant={statusVariantMap[room.status]} dot className="flex-shrink-0 ml-3">{room.status}</Badge>
      </div>

      <div className="flex items-center gap-5 text-xs mb-5 text-slate-500">
        <span className="flex items-center gap-1.5"><TimerIcon size={12} />{room.duration} min</span>
        <span className="flex items-center gap-1.5"><Clock size={12} />{timeAgo(room.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            {room.code}
          </code>
          <button onClick={handleCopy} className="p-1.5 rounded-lg transition-all duration-200 cursor-pointer text-slate-500 border border-slate-700 hover:text-indigo-400 hover:border-indigo-500">
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isEnded ? (
            <span className="text-xs italic px-2 py-1 text-slate-500">
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
    <div className="h-full flex flex-col">
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

      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Interview Sessions</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Manage and join your technical interview sessions.
        </p>
      </div>

      <div className="flex-1">
        {loadingRooms ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : rooms.length === 0 ? (
          <div className="border-2 border-dashed rounded-2xl py-20 flex flex-col items-center gap-5 border-slate-700 bg-slate-800/20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-800">
              <Video size={28} className="text-slate-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-300">No interview sessions have been created.</p>
              <p className="text-sm mt-1.5 text-slate-500">Start by creating your first interview session and invite your candidate.</p>
            </div>
            <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)}>New Interview Session</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onAddProblem={handleAddProblem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
